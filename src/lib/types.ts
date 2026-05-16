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
