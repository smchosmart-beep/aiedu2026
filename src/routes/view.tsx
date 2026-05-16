import { createFileRoute } from "@tanstack/react-router";
import { CodeEntry } from "@/components/consult/CodeEntry";

export const Route = createFileRoute("/view")({
  component: ViewPage,
  head: () => ({
    meta: [
      { title: "컨설팅 결과 열람 · 컨설팅 사전 진단" },
      {
        name: "description",
        content: "지역과 학교명으로 컨설팅 결과를 누구나 열람할 수 있습니다.",
      },
    ],
  }),
});

function ViewPage() {
  return <CodeEntry readOnly />;
}
