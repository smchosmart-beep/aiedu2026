import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { getResponse } from "@/lib/storage";
import type { SurveyResponse } from "@/lib/types";
import { Dashboard } from "./Dashboard";

export function CodeEntry() {
  const [code, setCode] = useState("");
  const [data, setData] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const r = await getResponse(code);
      if (!r) {
        toast.error("유효하지 않은 코드입니다");
        return;
      }
      setData(r);
    } catch (err) {
      toast.error((err as Error).message || "조회에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  if (data) return <Dashboard data={data} onBack={() => setData(null)} />;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b bg-background/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-3">
          <Link to="/" className="p-1 -ml-1 rounded-full hover:bg-muted">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="font-semibold">공유 코드 조회</div>
        </div>
      </div>

      <div className="flex-1 max-w-md w-full mx-auto px-5 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">공유 코드를 입력하세요</h1>
          <p className="text-muted-foreground mt-2">
            선도학교에서 받은 6자리 코드를 입력하면<br />맞춤 처방이 나타납니다
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <Input
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="6자리 코드 입력"
              maxLength={6}
              className="h-16 text-center text-2xl tracking-[0.5em] font-mono rounded-2xl"
            />
            <Button
              type="submit"
              size="lg"
              disabled={code.length < 4}
              className="w-full h-14 rounded-2xl text-base"
            >
              처방전 보기
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
