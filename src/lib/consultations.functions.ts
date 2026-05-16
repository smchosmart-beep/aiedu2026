import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const pinSchema = z.string().regex(/^\d{4}$/, "PIN은 숫자 4자리여야 합니다");
const nameSchema = z.string().trim().min(1).max(60);
const contentSchema = z.string().trim().min(1).max(4000);
const linkSchema = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null))
  .refine(
    (v) => v === null || /^https?:\/\/[^\s]+$/i.test(v),
    "링크는 http(s):// 로 시작해야 합니다",
  );

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function verifyPin(id: string, pin: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("consultations")
    .select("pin_hash, pin_salt")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("기록을 찾을 수 없습니다");
  if (!data.pin_hash || !data.pin_salt) {
    throw new Error("이 기록은 PIN이 설정되지 않아 수정·삭제할 수 없습니다");
  }
  const hash = await sha256Hex(data.pin_salt + pin);
  if (!timingSafeEqual(hash, data.pin_hash)) {
    throw new Error("PIN이 올바르지 않습니다");
  }
}

export const createConsultation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        surveyCode: z.string().trim().min(1).max(20),
        consultantName: nameSchema,
        content: contentSchema,
        linkUrl: linkSchema,
        pin: pinSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const salt = randomSalt();
    const hash = await sha256Hex(salt + data.pin);
    const { error } = await supabaseAdmin.from("consultations").insert({
      survey_code: data.surveyCode,
      consultant_name: data.consultantName,
      content: data.content,
      link_url: data.linkUrl,
      pin_hash: hash,
      pin_salt: salt,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateConsultation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        pin: pinSchema,
        consultantName: nameSchema,
        content: contentSchema,
        linkUrl: linkSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    await verifyPin(data.id, data.pin);
    const { error } = await supabaseAdmin
      .from("consultations")
      .update({
        consultant_name: data.consultantName,
        content: data.content,
        link_url: data.linkUrl,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteConsultation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        pin: pinSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    await verifyPin(data.id, data.pin);
    const { error } = await supabaseAdmin
      .from("consultations")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
