import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageSquareQuote, Send, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type Consultation = {
  id: string;
  survey_code: string;
  consultant_name: string;
  content: string;
  created_at: string;
};

async function fetchConsultations(code: string): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("survey_code", code)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Consultation[];
}

export function ConsultationPanel({ surveyCode, readOnly = false }: { surveyCode: string; readOnly?: boolean }) {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const { data: list, isLoading } = useQuery({
    queryKey: ["consultations", surveyCode],
    queryFn: () => fetchConsultations(surveyCode),
  });

  const m = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("consultations").insert({
        survey_code: surveyCode,
        consultant_name: name.trim(),
        content: content.trim(),
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      setContent("");
      qc.invalidateQueries({ queryKey: ["consultations", surveyCode] });
      toast.success("컨설팅 기록이 저장되었습니다");
    },
    onError: (e: Error) => toast.error(e.message || "저장에 실패했습니다"),
  });

  const canSubmit = name.trim().length > 0 && content.trim().length > 0 && !m.isPending;

  return (
    <div className="bg-card rounded-2xl shadow-sm border p-5 space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-xl">📝</span>
        <h3 className="font-bold">교사지원단 컨설팅 기록</h3>
        <Badge variant="secondary" className="ml-auto rounded-full text-[11px]">공개</Badge>
      </div>

      <p className="text-xs text-muted-foreground -mt-2">
        이 영역은 공개되어 있어 누구나 열람·작성할 수 있습니다. 기록은 수정·삭제되지 않습니다.
      </p>

      <div className="space-y-3 rounded-2xl border bg-muted/30 p-4">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="작성자 (예: 홍길동 · 00교육청 지원단)"
          className="h-12 rounded-xl"
          maxLength={60}
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="진단 결과와 학교 상황을 바탕으로 컨설팅 의견을 작성해 주세요."
          className="min-h-[140px] rounded-xl leading-relaxed"
          maxLength={4000}
        />
        <div className="flex justify-end">
          <Button onClick={() => m.mutate()} disabled={!canSubmit} className="rounded-xl">
            {m.isPending ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-1.5" />
            )}
            기록 남기기
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-muted-foreground">
          컨설팅 기록 {list ? `(${list.length})` : ""}
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> 불러오는 중…
          </div>
        )}

        {!isLoading && list && list.length === 0 && (
          <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
            아직 작성된 컨설팅 기록이 없습니다. 첫 기록을 남겨 보세요.
          </div>
        )}

        {list?.map((c) => (
          <article
            key={c.id}
            className="rounded-2xl border-l-4 border-primary bg-primary/5 p-4 space-y-2"
          >
            <header className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <User className="w-3.5 h-3.5 text-primary" />
                {c.consultant_name}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {new Date(c.created_at).toLocaleString("ko-KR")}
              </span>
            </header>
            <p className="text-[15px] leading-7 text-foreground whitespace-pre-wrap">
              {c.content}
            </p>
          </article>
        ))}
      </div>

      <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
        <MessageSquareQuote className="w-3 h-3 mt-0.5 shrink-0" />
        이 페이지의 모든 컨설팅 기록은 공유 코드를 아는 누구나 열람할 수 있습니다.
      </p>
    </div>
  );
}
