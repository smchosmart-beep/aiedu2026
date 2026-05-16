import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PencilLine, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { findResponsesBySchool } from "@/lib/storage";
import { REGIONS } from "@/lib/types";
import type { SurveyResponse } from "@/lib/types";
import { Dashboard } from "./Dashboard";

export function CodeEntry({
  readOnly = false,
  embedded = false,
}: { readOnly?: boolean; embedded?: boolean } = {}) {
  const [region, setRegion] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [results, setResults] = useState<SurveyResponse[] | null>(null);
  const [selected, setSelected] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!region || !schoolName.trim()) {
      toast.error("지역과 학교명을 입력하세요");
      return;
    }
    setLoading(true);
    try {
      const list = await findResponsesBySchool(region, schoolName);
      if (list.length === 0) {
        toast.error("일치하는 학교 응답이 없습니다");
        setResults([]);
        return;
      }
      if (list.length === 1) {
        setSelected(list[0]);
        return;
      }
      setResults(list);
    } catch (err) {
      toast.error((err as Error).message || "조회에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  if (selected)
    return <Dashboard data={selected} onBack={() => setSelected(null)} readOnly={readOnly} />;

  return (
    <div className={embedded ? "flex flex-col" : "min-h-screen flex flex-col"}>
      {!embedded && (
        <div className="border-b bg-background/90 backdrop-blur sticky top-0 z-10">
          <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-3">
            <Link to="/" className="p-1 -ml-1 rounded-full hover:bg-muted">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div className="font-semibold">
              {readOnly ? "컨설팅 결과 열람" : "컨설팅 학교 찾기"}
            </div>
          </div>
        </div>
      )}

      <div className={["flex-1 max-w-md w-full mx-auto px-5 pb-12", embedded ? "pt-6" : "pt-12"].join(" ")}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <PencilLine className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">
            {readOnly ? "학교 결과 찾기" : "학교 응답 찾기"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {readOnly ? (
              <>지역과 학교명을 입력해<br />컨설팅 결과를 열람하세요</>
            ) : (
              <>지역과 학교명을 입력해 응답을 찾고<br />컨설팅 내용을 기록하세요</>
            )}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">지역</label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="mt-2 h-14 rounded-2xl text-base">
                  <SelectValue placeholder="시도를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">학교명</label>
              <Input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="예) 00초등학교"
                className="mt-2 h-14 rounded-2xl text-base"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full h-14 rounded-2xl text-base"
            >
              {loading ? "조회 중…" : "찾기"}
            </Button>
          </form>

          {results && results.length > 1 && (
            <div className="mt-8 space-y-3">
              <div className="text-sm text-muted-foreground">
                총 {results.length}건의 응답이 있습니다
              </div>
              {results.map((r) => (
                <button
                  key={r.code}
                  onClick={() => setSelected(r)}
                  className="w-full text-left p-4 rounded-2xl border bg-card hover:bg-muted/50 transition flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">{r.schoolName}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {r.region} · {new Date(r.createdAt).toLocaleString("ko-KR")}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 ml-3" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
