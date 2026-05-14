import type { ConsultType, SurveyResponse } from "./types";

export function classify(r: SurveyResponse): ConsultType {
  const maxSkill = r.skill.length ? Math.max(...r.skill) : 1;
  const isA = r.account === "none" || maxSkill === 1;
  if (isA) return "A";
  const isC =
    r.account === "personal" &&
    (maxSkill === 3 || maxSkill === 4) &&
    r.difficulties.includes("design");
  if (isC) return "C";
  return "B";
}
