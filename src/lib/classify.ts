import type { ClassifyResult, SurveyResponse } from "./types";

export function classify(r: SurveyResponse): ClassifyResult {
  // 하드 오버라이드: 계정 발급 불가 → 무조건 A
  if (r.account === "none") return { type: "A", score: 0 };

  // 신호 1: 계정 환경 (0~2)
  const accountScore = r.account === "personal" ? 2 : r.account === "shared" ? 1 : 0;

  // 신호 2: 숙련도 평균 1~4 → 0~3
  const avgSkill = r.skill.length
    ? r.skill.reduce((a, b) => a + b, 0) / r.skill.length
    : 1;
  const skillScore = Math.max(0, Math.min(3, avgSkill - 1));

  // 신호 3: 어려움 보정
  let adj = 0;
  const hasDesign = r.difficulties.includes("design");
  const onlyInfraOrAccount =
    !hasDesign &&
    r.difficulties.length > 0 &&
    r.difficulties.every((d) => d === "infra" || d === "account");
  if (hasDesign) adj += 1;
  if (onlyInfraOrAccount) adj -= 0.5;

  const score = accountScore + skillScore + adj;

  let type: ClassifyResult["type"];
  if (score <= 1.0) type = "A";
  else if (score <= 2.0) type = "A-B";
  else if (score <= 3.5) type = "B";
  else if (score <= 4.5) type = "B-C";
  else type = "C";

  return { type, score };
}
