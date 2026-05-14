import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CodeEntry } from "@/components/consult/CodeEntry";
import { seedIfNeeded } from "@/lib/storage";

export const Route = createFileRoute("/consult")({
  component: ConsultPage,
  head: () => ({
    meta: [
      { title: "공유 코드 조회 · 컨설팅 매칭 대시보드" },
      { name: "description", content: "공유 코드를 입력해 맞춤 컨설팅 처방전을 확인하세요." },
    ],
  }),
});

function ConsultPage() {
  useEffect(() => { seedIfNeeded(); }, []);
  return <CodeEntry />;
}
