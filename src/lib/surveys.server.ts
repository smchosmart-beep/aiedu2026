import type {
  SurveyResponse,
  DeviceOS,
  DeviceMode,
  Account,
  Skill,
  Difficulty,
  EvalGoal,
} from "./types";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCode(): string {
  let c = "";
  for (let j = 0; j < 6; j++) c += CHARS[Math.floor(Math.random() * CHARS.length)];
  return c;
}

export type SurveyRow = {
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

export function rowToResponse(r: SurveyRow): SurveyResponse {
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

export const SURVEY_COLUMNS =
  "code, region, school_name, device_os, device_mode, account, skill, difficulties, other_difficulty, difficulty_detail, preferred_tools, target_subject, eval_goal, created_at";
