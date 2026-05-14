import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Laptop2, Tablet, FileText, UserCog, Target, MessageSquareQuote, Sparkles } from "lucide-react";
import type { SurveyResponse } from "@/lib/types";
import { classify } from "@/lib/classify";

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
const SKILL_LABEL: Record<number, string> = {
  1: "1단계 · 제시용",
  2: "2단계 · 상호작용",
  3: "3단계 · 코스웨어 활용",
  4: "4단계 · 융합수업 설계",
};
const DIFF_LABEL: Record<string, string> = {
  infra: "인프라 오류", admin: "행정 부담",
  design: "수업 설계 갈증", account: "계정 관리",
};
const EVAL_LABEL: Record<string, string> = {
  grading: "채점 시간 경감", feedback: "맞춤형 피드백",
  inquiry: "비판적 탐구", agency: "학생 주체성 평가",
};

type Props = { data: SurveyResponse; onBack: () => void };

export function Dashboard({ data, onBack }: Props) {
  const { type, score } = classify(data);

  const infraItems: { icon: React.ReactNode; text: string }[] = [];
  if (data.deviceOS.some((o) => o === "chromebook" || o === "whalebook")) {
    infraItems.push({
      icon: <Laptop2 className="w-5 h-5" />,
      text: "웹 기반 환경입니다. 워크스페이스를 활용한 URL 차단/탭 제어 노하우를 안내하세요.",
    });
  }
  if (data.deviceOS.some((o) => o === "ipad" || o === "android")) {
    infraItems.push({
      icon: <Tablet className="w-5 h-5" />,
      text: "앱 기반 환경입니다. MDM(기기 관리 시스템)을 통한 화면 제어 가이드를 제공하세요.",
    });
  }
  if (data.deviceMode === "cart") {
    infraItems.push({
      icon: <Sparkles className="w-5 h-5" />,
      text: "기기 배부/수합에 시간이 낭비됩니다. 10분 컷 기기 관리 루틴부터 세팅해 주세요.",
    });
  }

  const adminItems: { icon: React.ReactNode; text: string }[] = [];
  if (data.difficulties.includes("admin")) {
    adminItems.push({
      icon: <FileText className="w-5 h-5" />,
      text: "품의서 예시와 행정 Quick-Start 가이드를 바로 넘겨주세요.",
    });
  }
  if (data.account === "none" || data.difficulties.includes("account")) {
    adminItems.push({
      icon: <UserCog className="w-5 h-5" />,
      text: "가입이 필요 없는 PIN 접속 도구를 안내하거나 보호자 동의서 양식을 제공하세요.",
    });
  }

  const TYPE_META: Record<typeof type, { label: string; stage: string; prescription: string; script: string }> = {
    A: {
      label: "Type A · 입문형",
      stage: "📢 [1단계 입문형]",
      prescription: "계정 없이 접속 가능한 AI 수학 코스웨어 중심의 채점 자동화 루틴을 심어주세요.",
      script: "선생님, 복잡한 계정 잊으세요. 이 링크로 아이들 접속시키면 채점은 기계가 다 해줍니다.",
    },
    "A-B": {
      label: "Type A-B · 입문→표준 전환형",
      stage: "📢 [1.5단계 전환 준비형]",
      prescription: "채점 자동화 루틴을 안정화하면서, 다음 단계로 'AI가 만든 문제를 학생이 풀고 풀이 과정을 설명'하는 1차시 실험을 권하세요.",
      script: "지금 채점 자동화로 시간을 확보하셨다면, 그 10분을 학생이 AI에게 자기 풀이를 설명하는 활동에 써보세요.",
    },
    B: {
      label: "Type B · 표준형",
      stage: "📢 [2단계 표준형]",
      prescription: "내장형 AI 챗봇이 써준 초안의 오류를 학생이 고치는 '비판적 대화' 모델을 제안하세요.",
      script: "AI가 준 초안을 그대로 제출하게 두지 마세요. AI와 논쟁한 대화 로그를 평가하십시오.",
    },
    "B-C": {
      label: "Type B-C · 표준→전문가 전환형",
      stage: "📢 [2.5단계 심화 진입형]",
      prescription: "'비판적 대화' 모델을 운영하시면서, 단원 1개에 한정해 AI 응답의 수학적 오류를 학생이 반례로 반박하는 미니 프로젝트를 시도해 보세요.",
      script: "AI와 논쟁시키는 단계까지 오셨다면, 이번엔 학생이 'AI 너 틀렸어'라고 수학적으로 증명하는 한 차시를 설계해 보십시오.",
    },
    C: {
      label: "Type C · 전문가형",
      stage: "📢 [3단계 전문가형]",
      prescription: "7의 배수 사례처럼, AI의 한계를 수학적으로 검증하는 인간 주체성 중심의 수업을 설계하세요.",
      script: "기술을 의심하게 만드십시오. AI 알고리즘의 오류를 수학적 원리로 반박하게 가르치는 것이 진짜 혁신입니다.",
    },
  };
  const typeMeta = TYPE_META[type];

  const STAGES: { key: typeof type; label: string }[] = [
    { key: "A", label: "A" },
    { key: "A-B", label: "A-B" },
    { key: "B", label: "B" },
    { key: "B-C", label: "B-C" },
    { key: "C", label: "C" },
  ];

  return (
    <div className="min-h-screen pb-16">
      <div className="border-b bg-background/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-muted">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="font-semibold">컨설팅 처방전</div>
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
          <p className="text-muted-foreground mt-1">컨설팅 처방전</p>
        </motion.div>

        <Widget
          icon="💻"
          title="기기·인프라 맞춤 처방"
          delay={0.05}
          empty={infraItems.length === 0 ? "추가 처방이 없습니다." : undefined}
        >
          {infraItems.map((it, i) => (
            <Item key={i} icon={it.icon} text={it.text} />
          ))}
        </Widget>

        <Widget
          icon="📝"
          title="행정·계정 맞춤 처방"
          delay={0.1}
          empty={adminItems.length === 0 ? "행정·계정 관련 추가 처방은 없습니다." : undefined}
        >
          {adminItems.map((it, i) => (
            <Item key={i} icon={it.icon} text={it.text} />
          ))}
        </Widget>

        <Widget icon="🎯" title="핵심 수업·평가 모델 처방" delay={0.15}>
          <div className="flex items-center gap-2 mb-3">
            <Badge className="rounded-full bg-primary text-primary-foreground">
              <Target className="w-3 h-3 mr-1" />
              {typeMeta.label}
            </Badge>
          </div>
          <div className="text-sm font-semibold text-primary mb-1">{typeMeta.stage}</div>
          <p className="text-foreground leading-relaxed">{typeMeta.prescription}</p>
        </Widget>

        <Widget icon="💬" title="현장 스크립트" delay={0.2}>
          <div className="rounded-2xl bg-primary/5 border-l-4 border-primary p-5">
            <MessageSquareQuote className="w-6 h-6 text-primary mb-2" />
            <p className="text-foreground text-base leading-relaxed font-medium">
              "{typeMeta.script}"
            </p>
          </div>
        </Widget>

        <details className="rounded-2xl bg-card border p-5 text-sm">
          <summary className="cursor-pointer font-semibold text-muted-foreground">
            응답 원본 보기
          </summary>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
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
            <Field label="교사 숙련도" value={data.skill.map((s) => SKILL_LABEL[s]).join(", ")} />
            <Field
              label="가장 큰 어려움"
              value={data.difficulties.map((v) => DIFF_LABEL[v]).join(", ") || "-"}
            />
            <Field label="선호 에듀테크 도구" value={data.preferredTool || "-"} />
            <Field label="평가 혁신 목표" value={EVAL_LABEL[data.evalGoal]} />
          </div>
        </details>

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
  icon, title, children, delay = 0, empty,
}: { icon: string; title: string; children: React.ReactNode; delay?: number; empty?: string }) {
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
      {empty ? <p className="text-sm text-muted-foreground">{empty}</p> : children}
    </motion.div>
  );
}

function Item({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex gap-3 py-2">
      <div className="text-primary mt-0.5 shrink-0">{icon}</div>
      <p className="text-foreground leading-relaxed text-[15px]">{text}</p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs">{label}</div>
      <div className="text-foreground font-medium">{value}</div>
    </div>
  );
}
