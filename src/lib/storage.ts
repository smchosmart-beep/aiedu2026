import type { SurveyResponse } from "./types";
import {
  createSurvey,
  findSurveysBySchool,
  getSurveyByCode,
  listAllSurveys,
} from "./surveys.functions";

export { generateCode } from "./surveys.server";

export async function saveResponse(r: SurveyResponse): Promise<void> {
  const result = await createSurvey({
    data: {
      region: r.region,
      schoolName: r.schoolName,
      deviceOS: r.deviceOS,
      deviceMode: r.deviceMode,
      account: r.account,
      skill: r.skill as unknown as number[],
      difficulties: r.difficulties,
      otherDifficulty: r.otherDifficulty ?? null,
      difficultyDetail: r.difficultyDetail ?? null,
      preferredTools: r.preferredTools,
      targetSubject: r.targetSubject,
      evalGoal: r.evalGoal,
    },
  });
  r.code = result.code;
}

export async function getResponse(code: string): Promise<SurveyResponse | null> {
  const c = code.toUpperCase().trim();
  if (!c) return null;
  return await getSurveyByCode({ data: { code: c } });
}

export async function findResponsesBySchool(
  region: string,
  schoolName: string,
): Promise<SurveyResponse[]> {
  const name = schoolName.trim();
  if (!region || !name) return [];
  return await findSurveysBySchool({ data: { region, schoolName: name } });
}

export async function listAllResponses(): Promise<SurveyResponse[]> {
  return await listAllSurveys();
}

export function seedIfNeeded() {
  // no-op
}
