import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { listAllResponses } from "@/lib/storage";
import { countConsultationsByCodes } from "@/lib/consultations.functions";
import { consultShade } from "@/lib/consult-shade";
import {
  inferSchoolLevel,
  SCHOOL_LEVEL_LABEL,
  type SchoolLevel,
  type SurveyResponse,
} from "@/lib/types";
import { Dashboard } from "./Dashboard";


const LEVELS: { value: SchoolLevel | "all"; label: string }[] = [
  { value: "all", label: "전체 학교급" },
  { value: "elementary", label: "초등학교" },
  { value: "middle", label: "중학교" },
  { value: "high", label: "고등학교" },
  { value: "other", label: "기타" },
];

export function BrowseAll() {
  const [level, setLevel] = useState<SchoolLevel | "all">("all");
  const [subject, setSubject] = useState<string>("all");
  const [selected, setSelected] = useState<SurveyResponse | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["all-responses"],
    queryFn: listAllResponses,
  });

  const subjects = useMemo(() => {
    const set = new Set<string>();
    (data ?? []).forEach((r) => {
      const s = r.targetSubject?.trim();
      if (s) set.add(s);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "ko"));
  }, [data]);

  const filtered = useMemo(() => {
    return (data ?? []).filter((r) => {
      if (level !== "all" && inferSchoolLevel(r.schoolName) !== level) return false;
      if (subject !== "all" && r.targetSubject?.trim() !== subject) return false;
      return true;
    });
  }, [data, level, subject]);

  const codes = useMemo(() => filtered.map((r) => r.code), [filtered]);
  const countConsults = useServerFn(countConsultationsByCodes);
  const { data: counts } = useQuery({
    queryKey: ["consult-counts", codes],
    queryFn: () => countConsults({ data: { codes } }),
    enabled: codes.length > 0,
  });

  if (selected)
    return <Dashboard data={selected} onBack={() => setSelected(null)} readOnly />;


  return (
    <div className="max-w-2xl w-full mx-auto px-5 pt-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold">학교급·과목으로 찾기</h2>
        <p className="text-sm text-muted-foreground mt-1">
          학교급과 과목을 선택하면 결과가 표시됩니다
        </p>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">학교급</label>
          <Select value={level} onValueChange={(v) => setLevel(v as SchoolLevel | "all")}>
            <SelectTrigger className="mt-1 h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEVELS.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">평가 혁신 대상 과목</label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="mt-1 h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 과목</SelectItem>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6">
        {level === "all" && subject === "all" ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            학교급 또는 과목을 선택하세요
          </div>
        ) : isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> 불러오는 중…
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            조건에 맞는 결과가 없습니다
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground mb-3">
              총 {filtered.length}건
            </div>
            <div className="space-y-3">
              {filtered.map((r) => (
                <button
                  key={r.code}
                  onClick={() => setSelected(r)}
                  className="w-full text-left p-4 rounded-2xl border bg-card hover:bg-muted/50 transition flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{r.schoolName}</div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <Badge variant="secondary" className="rounded-full text-[11px]">
                        {r.region}
                      </Badge>
                      <Badge variant="outline" className="rounded-full text-[11px]">
                        {SCHOOL_LEVEL_LABEL[inferSchoolLevel(r.schoolName)]}
                      </Badge>
                      {r.targetSubject?.trim() && (
                        <Badge variant="outline" className="rounded-full text-[11px]">
                          {r.targetSubject}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {new Date(r.createdAt).toLocaleString("ko-KR")}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
