import { supabase } from "@/integrations/supabase/client";
import type { SurveyResponse, DeviceOS, DeviceMode, Account, Skill, Difficulty, EvalGoal } from "./types";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCode(): string {
  let c = "";
  for (let j = 0; j < 6; j++) c += CHARS[Math.floor(Math.random() * CHARS.length)];
  return c;
}

type Row = {
  code: string;
  region: string;
  school_name: string;
  device_os: string[];
  device_mode: string;
  account: string;
  skill: number[];
  difficulties: string[];
  other_difficulty: string | null;
  difficulty_detail: string | null;
  preferred_tools: string[];
  target_subject: string;
  eval_goal: string;
  created_at: string;
};

function rowToResponse(r: Row): SurveyResponse {
  return {
    code: r.code,
    region: r.region,
    schoolName: r.school_name,
    deviceOS: r.device_os as DeviceOS[],
    deviceMode: r.device_mode as DeviceMode,
    account: r.account as Account,
    skill: r.skill as Skill[],
    difficulties: r.difficulties as Difficulty[],
    otherDifficulty: r.other_difficulty ?? undefined,
    difficultyDetail: r.difficulty_detail ?? undefined,
    preferredTools: r.preferred_tools ?? [],
    targetSubject: r.target_subject ?? "",
    evalGoal: r.eval_goal as EvalGoal,
    createdAt: new Date(r.created_at).getTime(),
  };
}

export async function saveResponse(r: SurveyResponse): Promise<void> {
  let attempt = 0;
  let code = r.code;
  while (attempt < 3) {
    const { error } = await supabase.from("surveys").insert({
      code,
      region: r.region,
      school_name: r.schoolName,
      device_os: r.deviceOS,
      device_mode: r.deviceMode,
      account: r.account,
      skill: r.skill,
      difficulties: r.difficulties,
      other_difficulty: r.otherDifficulty ?? null,
      difficulty_detail: r.difficultyDetail ?? null,
      preferred_tools: r.preferredTools,
      target_subject: r.targetSubject,
      eval_goal: r.evalGoal,
    });
    if (!error) {
      r.code = code;
      return;
    }
    // duplicate primary key → 코드 재생성 후 재시도
    if (error.code === "23505") {
      code = generateCode();
      attempt++;
      continue;
    }
    throw new Error(error.message);
  }
  throw new Error("코드 생성에 실패했습니다. 다시 시도해 주세요.");
}

export async function getResponse(code: string): Promise<SurveyResponse | null> {
  const c = code.toUpperCase().trim();
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("code", c)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToResponse(data as Row) : null;
}

export async function findResponsesBySchool(
  region: string,
  schoolName: string
): Promise<SurveyResponse[]> {
  const name = schoolName.trim();
  if (!region || !name) return [];
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("region", region)
    .ilike("school_name", `%${name}%`)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToResponse(r as Row));
}

export function seedIfNeeded() {
  // no-op
}
