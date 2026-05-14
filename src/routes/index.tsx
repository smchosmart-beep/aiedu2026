import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { Landing } from "@/components/Landing";
import { SurveyFlow } from "@/components/survey/SurveyFlow";
import { seedIfNeeded } from "@/lib/storage";

const searchSchema = z.object({
  mode: fallback(z.enum(["survey"]).optional(), undefined),
});

export const Route = createFileRoute("/")({
  validateSearch: zodValidator(searchSchema),
  component: Index,
  head: () => ({
    meta: [
      { title: "2026 AI·디지털 선도학교 컨설팅 매칭 대시보드" },
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
