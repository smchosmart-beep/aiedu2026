import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CodeEntry } from "@/components/consult/CodeEntry";
import { SupportGate } from "@/components/consult/SupportGate";
import { seedIfNeeded } from "@/lib/storage";

export const Route = createFileRoute("/consult")({
  component: ConsultPage,
  head: () => ({
    meta: [
      { title: "공유 코드 조회 · 수업 평가 혁신 컨설팅" },
      { name: "description", content: "공유 코드를 입력해 맞춤 컨설팅 처방전을 확인하세요." },
    ],
  }),
});

function ConsultPage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    seedIfNeeded();
    try {
      if (sessionStorage.getItem("consult:gate") === "ok") setUnlocked(true);
    } catch {
      /* noop */
    }
  }, []);

  if (!unlocked) return <SupportGate onUnlock={() => setUnlocked(true)} />;
  return <CodeEntry />;
}
