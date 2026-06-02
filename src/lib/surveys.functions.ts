import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  SURVEY_COLUMNS,
  generateCode,
  rowToResponse,
  type SurveyRow,
} from "./surveys.server";
import type { SurveyResponse } from "./types";

const surveyPayloadSchema = z.object({
  region: z.string().trim().min(1).max(20),
  schoolName: z.string().trim().min(1).max(100),
  deviceOS: z.array(z.string().min(1).max(30)).max(20),
  deviceMode: z.string().min(1).max(30),
  account: z.string().min(1).max(30),
  skill: z.array(z.number().int().min(0).max(10)).max(20),
  difficulties: z.array(z.string().min(1).max(30)).max(20),
  otherDifficulty: z.string().trim().max(500).optional().nullable(),
  difficultyDetail: z.string().trim().max(4000).optional().nullable(),
  preferredTools: z.array(z.string().trim().min(1).max(60)).max(30),
  targetSubject: z.string().trim().max(60),
  evalGoal: z.string().min(1).max(30),
});

const codeSchema = z
  .string()
  .trim()
  .min(1)
  .max(20)
  .transform((v) => v.toUpperCase());

export const createSurvey = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => surveyPayloadSchema.parse(input))
  .handler(async ({ data }) => {
    let attempt = 0;
    while (attempt < 5) {
      const code = generateCode();
      const { error } = await supabaseAdmin.from("surveys").insert({
        code,
        region: data.region,
        school_name: data.schoolName,
        device_os: data.deviceOS,
        device_mode: data.deviceMode,
        account: data.account,
        skill: data.skill,
        difficulties: data.difficulties,
        other_difficulty: data.otherDifficulty ?? null,
        difficulty_detail: data.difficultyDetail ?? null,
        preferred_tools: data.preferredTools,
        target_subject: data.targetSubject,
        eval_goal: data.evalGoal,
      });
      if (!error) return { code };
      if (error.code === "23505") {
        attempt++;
        continue;
      }
      throw new Error(error.message);
    }
    throw new Error("코드 생성에 실패했습니다. 다시 시도해 주세요.");
  });

export const getSurveyByCode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ code: codeSchema }).parse(input))
  .handler(async ({ data }): Promise<SurveyResponse | null> => {
    const { data: row, error } = await supabaseAdmin
      .from("surveys")
      .select(SURVEY_COLUMNS)
      .eq("code", data.code)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? rowToResponse(row as SurveyRow) : null;
  });

export const findSurveysBySchool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        region: z.string().trim().min(1).max(20),
        schoolName: z.string().trim().min(1).max(100),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<SurveyResponse[]> => {
    const { data: rows, error } = await supabaseAdmin
      .from("surveys")
      .select(SURVEY_COLUMNS)
      .eq("region", data.region)
      .ilike("school_name", `%${data.schoolName}%`)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => rowToResponse(r as SurveyRow));
  });

export const listAllSurveys = createServerFn({ method: "GET" }).handler(
  async (): Promise<SurveyResponse[]> => {
    const { data: rows, error } = await supabaseAdmin
      .from("surveys")
      .select(SURVEY_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => rowToResponse(r as SurveyRow));
  },
);
