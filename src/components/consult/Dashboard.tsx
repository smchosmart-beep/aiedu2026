import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { SurveyResponse } from "@/lib/types";
import { ConsultationPanel } from "./ConsultationPanel";

const OS_LABEL: Record<string, string> = {
  chromebook: "크롬북", whalebook: "웨일북", ipad: "아이패드",
  android: "안드로이드", windows: "윈도우",
};
const MODE_LABEL: Record<string, string> = {
  "1to1": "1인 1기기", cart: "카트 공용", mobile: "이동 수업",
};
const ACCOUNT_LABEL: Record<string, string> = {
  personal: "개인 계정 완료", shared: "교사 공용 계정", none: "계정 발급 불가",
};
const DIFF_LABEL: Record<string, string> = {
  courseware: "AI 코스웨어 매너리즘형",
  burnout: "에듀테크 번아웃형",
  pbl: "PBL 평가 실종형",
  fragmented: "데이터 파편화형",
  other: "기타",
};

type Props = { data: SurveyResponse; onBack: () => void };

export function Dashboard({ data, onBack }: Props) {
  const diffLabel = (d: string) =>
    d === "other" ? (data.otherDifficulty?.trim() || "기타") : (DIFF_LABEL[d] ?? d);
  const difficultyBadges = data.difficulties.map(diffLabel);
  if (data.account === "none") difficultyBadges.push("계정 발급 불가");
  else if (data.account === "shared") difficultyBadges.push("교사 공용 계정");

  return (
    <div className="min-h-screen pb-16">
      <div className="border-b bg-background/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-muted">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="font-semibold">컨설팅 기록</div>
          <div className="ml-auto text-xs text-muted-foreground font-mono">
            {data.code}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-8 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="rounded-full">{data.region}</Badge>
            <span className="text-2xl font-bold">{data.schoolName}</span>
          </div>
          <p className="text-muted-foreground mt-1">컨설팅 사전 진단 결과</p>
        </motion.div>

        <Widget icon="📋" title="학교 응답 정보" delay={0.05}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <Field label="공유 코드" value={data.code} />
            <Field
              label="제출 일시"
              value={new Date(data.createdAt).toLocaleString("ko-KR")}
            />
            <Field label="지역" value={data.region} />
            <Field label="학교명" value={data.schoolName} />
            <Field
              label="기기 OS"
              value={data.deviceOS.map((v) => OS_LABEL[v]).join(", ") || "-"}
            />
            <Field label="기기 운용 방식" value={MODE_LABEL[data.deviceMode]} />
            <Field label="에듀테크 계정 환경" value={ACCOUNT_LABEL[data.account]} />
            <Field label="평가 혁신 대상 과목" value={data.targetSubject || "-"} />
            <div className="sm:col-span-2">
              <Field
                label="사용중인 에듀테크"
                value={data.preferredTools?.length ? data.preferredTools.join(", ") : "-"}
              />
            </div>
          </div>
        </Widget>

        <Widget icon="⚠️" title="학교가 체크한 고민" delay={0.1}>
          {difficultyBadges.length === 0 ? (
            <p className="text-sm text-muted-foreground">특이 사항 없음</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {difficultyBadges.map((b, i) => (
                <Badge key={i} variant="outline" className="rounded-full">{b}</Badge>
              ))}
            </div>
          )}
          {data.difficultyDetail && (
            <blockquote className="mt-4 rounded-2xl border-l-4 border-primary bg-primary/5 px-4 py-3 text-[15px] leading-7 text-foreground whitespace-pre-wrap">
              {data.difficultyDetail}
            </blockquote>
          )}
        </Widget>

        <ConsultationPanel surveyCode={data.code} />

        <div className="pt-4">
          <Button variant="outline" onClick={onBack} className="w-full h-12 rounded-2xl">
            다른 코드 조회하기
          </Button>
        </div>
      </div>
    </div>
  );
}

function Widget({
  icon, title, children, delay = 0,
}: { icon: string; title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card rounded-2xl shadow-sm border p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className="font-bold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-foreground font-medium text-[15px] break-words">{value}</div>
    </div>
  );
}
