import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/Landing";
import { SurveyFlow } from "@/components/survey/SurveyFlow";
import { seedIfNeeded } from "@/lib/storage";

type Search = { mode?: "survey" };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    mode: s.mode === "survey" ? "survey" : undefined,
  }),
  component: Index,
  head: () => ({
    meta: [
      { title: "2026 AI·디지털 선도학교 컨설팅 처방 가이드" },
      { name: "description", content: "선도학교의 상황을 진단하고 교사지원단에게 동적 처방을 제공합니다." },
    ],
  }),
});

function Index() {
  const { mode } = Route.useSearch();
  useEffect(() => { seedIfNeeded(); }, []);
  if (mode === "survey") return <SurveyFlow />;
  return <Landing />;
}
