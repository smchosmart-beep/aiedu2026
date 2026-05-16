import type { ClassifyResult, SurveyResponse } from "./types";

export function classify(r: SurveyResponse): ClassifyResult {
  // 하드 오버라이드: 계정 발급 불가 → 무조건 A
  if (r.account === "none") return { type: "A", score: 0 };

  // 신호 1: 계정 환경 (0~1)
  const accountScore = r.account === "personal" ? 1 : r.account === "shared" ? 0.5 : 0;

  // 신호 2: 수업 평가 고민 보정
  let adj = 0;
  const diffs = r.difficulties;
  const hasDeep = diffs.includes("pbl") || diffs.includes("fragmented");
  const onlyBurnout = diffs.length === 1 && diffs[0] === "burnout";
  if (hasDeep) adj += 1;
  else if (onlyBurnout) adj -= 0.5;

  const score = accountScore + adj;

  let type: ClassifyResult["type"];
  if (score <= 1.5) type = "A";
  else if (score <= 3.5) type = "B";
  else type = "C";

  return { type, score };
}
