import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { ChevronRight, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { listAllResponses } from "@/lib/storage";
import { countConsultationsByCodes } from "@/lib/consultations.functions";
import { consultShade } from "@/lib/consult-shade";
import {
  inferSchoolLevel,
  SCHOOL_LEVEL_LABEL,
  type SurveyResponse,
} from "@/lib/types";
import { Dashboard } from "./Dashboard";


export function KeywordSearch() {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<SurveyResponse | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["all-responses"],
    queryFn: listAllResponses,
  });

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return [];
    return (data ?? []).filter((r) => {
      const haystack = [
        r.schoolName,
        r.region,
        r.targetSubject,
        r.otherDifficulty ?? "",
        r.difficultyDetail ?? "",
        ...(r.preferredTools ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data, keyword]);

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
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold">키워드로 검색</h2>
        <p className="text-sm text-muted-foreground mt-1">
          학교명·지역·과목·에듀테크·고민 내용에서 키워드를 검색합니다
        </p>
      </motion.div>

      <div className="mt-6 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="예: 패들렛, 국어, 서울, 프로젝트…"
          className="h-12 rounded-xl pl-9"
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> 불러오는 중…
          </div>
        ) : keyword.trim() === "" ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            검색어를 입력해 주세요
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            "{keyword}"에 해당하는 결과가 없습니다
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground mb-3">총 {filtered.length}건</div>
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
