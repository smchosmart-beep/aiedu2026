import type { ConsultType, SurveyResponse } from "./types";

export function classify(r: SurveyResponse): ConsultType {
  const isA = r.account === "none" || r.skill === 1;
  if (isA) return "A";
  const isC =
    r.account === "personal" &&
    (r.skill === 3 || r.skill === 4) &&
    r.difficulties.includes("design");
  if (isC) return "C";
  return "B";
}
