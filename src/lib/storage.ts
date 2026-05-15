import type { SurveyResponse } from "./types";

const KEY = "consult:responses";

function readAll(): Record<string, SurveyResponse> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, SurveyResponse>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const all = readAll();
  for (let i = 0; i < 50; i++) {
    let c = "";
    for (let j = 0; j < 6; j++) c += chars[Math.floor(Math.random() * chars.length)];
    if (!all[c]) return c;
  }
  return "X" + Date.now().toString(36).slice(-5).toUpperCase();
}

export function saveResponse(r: SurveyResponse) {
  const all = readAll();
  all[r.code] = r;
  writeAll(all);
}

export function getResponse(code: string): SurveyResponse | null {
  const all = readAll();
  return all[code.toUpperCase().trim()] || null;
}

export function seedIfNeeded() {
  // no-op: 시연용 하드코딩 데이터 제거
}

