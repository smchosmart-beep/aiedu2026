import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUPPORT_CODE = "2026ai";

type Props = { onUnlock: () => void };

export function SupportGate({ onUnlock }: Props) {
  const [value, setValue] = useState("");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (value.trim().toLowerCase() === SUPPORT_CODE) {
      try {
        sessionStorage.setItem("consult:gate", "ok");
      } catch {
        /* noop */
      }
      onUnlock();
    } else {
      toast.error("확인 코드가 일치하지 않습니다");
      setValue("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b bg-background/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link to="/" className="p-1 -ml-1 rounded-full hover:bg-muted">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="font-semibold">교사지원단 인증</div>
        </div>
      </div>

      <div className="flex-1 max-w-md w-full mx-auto px-5 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">교사지원단 확인 코드</h1>
          <p className="text-muted-foreground mt-2">
            B모드는 교사지원단 전용입니다.<br />
            지원단 확인 코드를 입력해 주세요.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input
              autoFocus
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="확인 코드"
              className="h-14 text-base rounded-2xl"
            />
            <Button
              type="submit"
              size="lg"
              disabled={value.trim().length === 0}
              className="w-full h-14 rounded-2xl text-base"
            >
              확인
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
