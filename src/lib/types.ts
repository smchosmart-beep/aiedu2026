export type DeviceOS = "chromebook" | "whalebook" | "ipad" | "android" | "windows";
export type DeviceMode = "1to1" | "cart" | "mobile";
export type Account = "personal" | "shared" | "none";
export type Skill = 1 | 2 | 3 | 4;
export type Difficulty = "courseware" | "burnout" | "pbl" | "fragmented" | "other";
export type EvalGoal = "grading" | "feedback" | "inquiry" | "agency";

export type SurveyResponse = {
  code: string;
  region: string;
  schoolName: string;
  deviceOS: DeviceOS[];
  deviceMode: DeviceMode;
  account: Account;
  skill: Skill[];
  difficulties: Difficulty[];
  otherDifficulty?: string;
  difficultyDetail?: string;
  preferredTools: string[];
  targetSubject: string;
  evalGoal: EvalGoal;
  createdAt: number;
};

export type ConsultType = "A" | "B" | "C";

export type ClassifyResult = { type: ConsultType; score: number };

export const REGIONS = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
];

export type SchoolLevel = "elementary" | "middle" | "high" | "other";
export const SCHOOL_LEVEL_LABEL: Record<SchoolLevel, string> = {
  elementary: "초등학교",
  middle: "중학교",
  high: "고등학교",
  other: "기타",
};
export function inferSchoolLevel(name: string): SchoolLevel {
  if (/초등/.test(name)) return "elementary";
  if (/중학/.test(name)) return "middle";
  if (/고등/.test(name)) return "high";
  return "other";
}

