import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Target, MessageSquareQuote, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, ListOrdered, Sparkles, Loader2, RefreshCw } from "lucide-react";
import type { SurveyResponse } from "@/lib/types";
import { classify } from "@/lib/classify";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { generatePrescription } from "@/lib/prescription.functions";

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

type TypeKey = "A" | "A-B" | "B" | "B-C" | "C";

type TypeContent = {
  label: string;
  stage: string;
  oneLiner: string;
  coreModel: string;
  lessonFlow: string[];
  evalFocus: string[];
  pitfalls: string[];
  nextStep: string;
  script: string;
};

const TYPE_META: Record<TypeKey, TypeContent> = {
  A: {
    label: "Type A · 입문형",
    stage: "📢 [1단계 입문형] AI 코스웨어 채점 자동화 + 오답 군집 진단",
    oneLiner: "계정·설치 없이 '채점 10분'을 확보해 학생 진단에 다시 투자하는 모델입니다.",
    coreModel:
      "교사가 직접 만든 진단지(또는 교과서 단원평가)를 PIN/링크 접속형 코스웨어에 올려 학생이 풀게 하고, AI는 채점·오답 군집화만 담당합니다. 교사는 채점에서 해방된 시간을 '오답 패턴 해석 → 보충 그룹 재편성'에 사용합니다. 평가의 본질은 '채점'이 아니라 '진단'임을 회복하는 단계입니다.",
    lessonFlow: [
      "도입(5분): 단원 핵심 개념 1장 정리, 진단지 PIN 안내",
      "전개(15분): 학생이 개별 기기 또는 모둠 1대로 진단지 풀이",
      "자동 채점(즉시): 코스웨어가 정답률·오답 위치를 표로 제공",
      "교사 분석(5분): 오답이 집중된 1~2개 문항을 '오개념 군집'으로 표시",
      "재구성(10분): 같은 오답군 학생끼리 모둠 재편성, 또래 설명 활동",
      "정리(5분): 교사가 가장 많은 오답 1개만 칠판으로 다시 풀이",
    ],
    evalFocus: [
      "정답률(전체/문항별) — 단원 도달도",
      "오답 패턴 — 계산 실수인지 개념 오류인지 분류",
      "풀이 시간 — 너무 빠른/느린 학생 식별",
      "재시도 시 변화 — 보충 후 즉시 재진단 권장",
    ],
    pitfalls: [
      "채점만 자동화하고 피드백은 '다 같이 답 맞추기'로 끝내는 것 — 시간이 다시 사라집니다.",
      "1회성 점수로만 활용 — 같은 진단지를 보충 후 한 번 더 돌리는 루틴까지 한 세트입니다.",
      "교사가 오답 데이터를 안 보는 것 — '확보된 10분에 무엇을 볼지'를 미리 정해두세요.",
    ],
    nextStep:
      "확보한 10분 중 5분을 '학생이 자기 풀이를 말로 설명하기' 활동으로 옮기면 A-B 단계로 자연스럽게 이행합니다.",
    script:
      "선생님, 복잡한 계정 잊으세요. 이 링크로 아이들 접속시키면 채점은 기계가 다 해줍니다. 대신 그렇게 아낀 10분으로 '왜 이 문제에서 우리 반이 다 틀렸지?'를 보세요. 그게 진짜 평가입니다.",
  },
  "A-B": {
    label: "Type A-B · 입문→표준 전환형",
    stage: "📢 [1.5단계 전환형] AI 생성 문항 + 학생 풀이 설명 1차시 실험",
    oneLiner: "채점 자동화 위에 '학생이 AI에게 자기 풀이를 설명하는' 1차시를 얹는 단계입니다.",
    coreModel:
      "교사가 단원 핵심 개념을 AI에게 제시하고 난도가 다른 문제 3개(쉬움/표준/도전)를 생성받습니다. 학생은 풀이 후, AI 챗에게 '내가 왜 이렇게 풀었는지' 설명을 입력하고, AI의 되묻기에 응답합니다. 평가는 '정답'이 아니라 '설명의 논리성'에 둡니다. 학생이 채점 대상에서 '설명하는 주체'로 이동하는 첫 경험입니다.",
    lessonFlow: [
      "사전(교사 5분): AI에 단원·성취기준을 주고 문제 3개 생성·검수",
      "도입(5분): 오늘은 '풀이를 말로 설명한다'고 명시",
      "풀이(10분): 학생이 노트에 풀이",
      "설명(15분): 학생이 풀이를 AI 챗에 입력 → AI 되묻기 1~2회 응답",
      "수합(5분): 학생이 대화 로그를 캡처/제출",
      "공유(5분): 가장 잘 설명한 1명의 로그를 칠판에 함께 읽기",
    ],
    evalFocus: [
      "풀이 정확성(채점은 여전히 자동)",
      "설명의 논리성 — 근거 → 절차 → 결론 구조가 있는가",
      "AI 되묻기에 대한 응답 깊이 — 단답 vs 재설명",
      "자기 오류 인지 여부 — 설명 중 스스로 수정했는가",
    ],
    pitfalls: [
      "AI 생성 문제의 난도·오류 검수 누락 — 반드시 교사가 먼저 풀어보세요.",
      "학생이 '복붙'으로 설명을 회피 — 첫 1문장만 손글씨 입력 의무화 권장.",
      "설명 활동을 매 차시 풀가동 — 단원당 1차시로 시작해야 지속 가능합니다.",
    ],
    nextStep:
      "설명 로그에서 '학생이 AI 답을 의심한 사례'가 보이기 시작하면 B 단계(비판적 대화 평가)로 확장합니다.",
    script:
      "지금 채점 자동화로 시간을 확보하셨다면, 그 10분을 학생이 AI에게 자기 풀이를 설명하는 활동에 써보세요. 단원당 딱 한 차시면 충분합니다. 아이들이 설명하는 순간 '풀이'가 '사고'가 됩니다.",
  },
  B: {
    label: "Type B · 표준형",
    stage: "📢 [2단계 표준형] AI 초안 비판적 대화(Critical Dialogue) 평가",
    oneLiner: "학생이 AI 초안을 받아 '오류·근거 부족'을 짚고 정정하는 대화 자체가 평가 대상입니다.",
    coreModel:
      "교사가 단원 핵심 발문(예: '4학년 학생에게 분수의 곱셈을 어떻게 설명할까?')을 제시하면, 학생은 AI에게 초안을 받습니다. 그다음 학생은 초안의 오류·비약·근거 부족을 표시하고, AI와 반박-재제시 대화를 1~3회 진행한 뒤 '최종 정정안'을 제출합니다. 평가는 '최종안의 정답성'이 아니라 '대화 로그에 드러난 비판적 사고 과정'입니다.",
    lessonFlow: [
      "도입(5분): 오늘의 발문 제시 + 평가 루브릭 공개",
      "초안 수령(5분): 학생이 AI에게 초안 1회 요청",
      "표시(10분): 초안에 오류·비약·근거 부족 부분 색칠/주석",
      "반박 대화(15분): 학생-AI 1~3턴 반박 → 재제시",
      "최종안(5분): 학생이 '내 언어로' 정정안 작성",
      "동료 검토(5분): 짝과 대화 로그 교환, 1줄 피드백",
    ],
    evalFocus: [
      "초안 대비 수정 횟수와 폭",
      "근거 인용 — 교과서/공식/이전 학습 내용 인용 여부",
      "반박 논리 — 왜 그것이 틀렸는지 설명했는가",
      "최종안의 자기 언어화 — AI 문장 복붙 여부",
    ],
    pitfalls: [
      "학생이 AI 초안을 그대로 제출 — 대화 로그 첨부를 제출 필수 조건으로 두세요.",
      "교사가 '정답 vs 오답'으로 채점 — 이 모델의 평가 대상은 '대화'입니다.",
      "AI가 너무 빨리 동의해 버림 — '반론을 더 강하게 말해줘' 프롬프트를 학생에게 미리 가르치세요.",
    ],
    nextStep:
      "한 단원에 한해 학생이 AI 응답에 대해 '수학적 반례'를 제시하는 활동을 넣으면 B-C로 이행합니다.",
    script:
      "AI가 준 초안을 그대로 제출하게 두지 마세요. AI와 논쟁한 대화 로그를 평가하십시오. 정답이 아니라, 어떻게 의심하고 어떻게 다시 묻는지가 이 시대의 수학 학력입니다.",
  },
  "B-C": {
    label: "Type B-C · 표준→전문가 전환형",
    stage: "📢 [2.5단계 심화 진입형] AI 응답 반례(Counterexample) 미니 프로젝트",
    oneLiner: "비판적 대화 위에 '수학적 반례로 AI를 논파하는' 모둠 프로젝트를 한 단원만 시도합니다.",
    coreModel:
      "단원 1개(예: 약수와 배수, 분수의 성질, 도형의 합동)를 골라, 학생이 AI에게 '일반화 진술'(예: '○○이면 항상 △△이다')을 받아냅니다. 모둠은 그 진술이 깨지는 반례를 탐색·검증·증명하고, 동료 모둠에게 발표합니다. 평가는 반례의 수학적 타당성과 증명 절차입니다. 교사 연구 주제인 '배수판별법' 같은 영역이 가장 잘 맞습니다.",
    lessonFlow: [
      "단원 선정(교사 사전): 일반화가 가능한 주제 1개 선정",
      "1차시 도입: AI에 일반화 진술을 의도적으로 받아내기",
      "탐색(2차시): 모둠별 반례 후보 3개 이상 수집",
      "검증(1차시): 정의·공식으로 반례가 진짜 반례인지 증명",
      "동료 평가(1차시): 모둠 간 반례 교차 검증",
      "발표·정정: AI 진술을 어떻게 수정해야 하는지 모둠안 제시",
    ],
    evalFocus: [
      "반례의 수학적 타당성 — 정의를 정확히 어겼는가",
      "증명의 단계성 — 가정 → 적용 → 결론",
      "동료 피드백 수용 — 다른 모둠 지적 후 수정했는가",
      "메타 인지 — '왜 AI가 이런 일반화를 했을까'에 대한 추측",
    ],
    pitfalls: [
      "단순 '틀렸다'로 끝나고 수학적 근거가 빠짐 — 반드시 '왜 반례인지' 한 줄 증명을 강제하세요.",
      "AI가 너무 옳은 진술만 내놓음 — 교사가 프롬프트로 '초등 수준 일반화'를 유도하세요.",
      "한 학기 내내 운영 — 단원 1개로 제한해야 학생이 지치지 않습니다.",
    ],
    nextStep:
      "반례 활동이 자리잡으면 학기 단위 '인간 주체성 프로젝트'(C단계)로 확장합니다.",
    script:
      "AI와 논쟁시키는 단계까지 오셨다면, 이번엔 학생이 'AI 너 틀렸어'라고 수학적으로 증명하는 한 차시를 설계해 보십시오. 한 단원이면 충분합니다. 그 한 번의 경험이 '나는 AI보다 수학을 안다'는 효능감을 만듭니다.",
  },
  C: {
    label: "Type C · 전문가형",
    stage: "📢 [3단계 전문가형] AI 알고리즘 검증 기반 수학적 주체성 수업",
    oneLiner: "AI 알고리즘 자체를 수학적으로 분해·반박·개선하는, 인간 주체성 중심 단원 프로젝트.",
    coreModel:
      "예: '7의 배수 판별법'처럼 AI가 자신만만하게 제시하는 알고리즘을 학생이 합동식·자릿수 분해 등 초등 수학의 원리로 직접 검증합니다. 학생은 알고리즘을 분해 → 반례·예외 설계 → 수학적 한계 증명 → 개선안 제안 → 학교/학년 내 발표까지 진행합니다. 평가의 종착점은 '기술을 의심할 줄 아는 시민'입니다.",
    lessonFlow: [
      "도입: AI에 '○○ 판별법을 알려줘'를 의뢰, 알고리즘 받기",
      "분해: 알고리즘을 단계별로 쪼개고 각 단계의 수학적 근거 명시",
      "공격: 의도적으로 큰 수·예외 수·경계값으로 반례 설계",
      "증명: 합동식·자릿수 합 등 원리로 한계 또는 정당성 증명",
      "개선: 알고리즘을 어떻게 보완할지 모둠 개선안 작성",
      "발표·메타 성찰: '내가 AI보다 더 잘 안 부분은 무엇인가' 1쪽 글쓰기",
    ],
    evalFocus: [
      "알고리즘 이해 — 단계 분해의 정확성",
      "수학적 증명 — 합동식 등 도구의 적절한 사용",
      "대안 설계 — 개선안의 수학적 정당성",
      "메타 성찰 — 기술과 수학의 관계에 대한 자기 진술",
    ],
    pitfalls: [
      "기술 비판이 감상('AI 무서워요')에 머무름 — 반드시 '수학적 근거'로 환원하세요.",
      "교사가 정답 알고리즘을 미리 알려줌 — 학생이 스스로 도달하는 시간이 핵심입니다.",
      "1차시 단발 운영 — 최소 4~6차시 단원 단위 프로젝트로 설계하세요.",
    ],
    nextStep:
      "학교/지역 단위 사례 공유와 동료 교사 코칭으로 확장하세요. 컨설턴트 후보입니다.",
    script:
      "기술을 의심하게 만드십시오. AI 알고리즘의 오류를 수학적 원리로 반박하게 가르치는 것이 진짜 혁신입니다. 7의 배수 판별처럼, 학생이 'AI보다 내가 더 정확하게 안다'를 한 번이라도 경험하면 평생 갑니다.",
  },
};

const STAGES: { key: TypeKey; label: string }[] = [
  { key: "A", label: "A" },
  { key: "A-B", label: "A-B" },
  { key: "B", label: "B" },
  { key: "B-C", label: "B-C" },
  { key: "C", label: "C" },
];

type Props = { data: SurveyResponse; onBack: () => void };

export function Dashboard({ data, onBack }: Props) {
  const { type, score } = classify(data);
  const typeMeta = TYPE_META[type];

  const difficultyBadges = data.difficulties.map((d) => DIFF_LABEL[d]);
  if (data.account === "none") difficultyBadges.push("계정 발급 불가");
  else if (data.account === "shared") difficultyBadges.push("교사 공용 계정");

  const generate = useServerFn(generatePrescription);
  const aiQuery = useQuery({
    queryKey: ["prescription", data.code],
    queryFn: () =>
      generate({
        data: {
          type,
          typeLabel: typeMeta.label,
          subject: data.targetSubject ?? "",
          tools: data.preferredTools ?? [],
          difficulties: (data.difficulties ?? []).map((d) => DIFF_LABEL[d] ?? d),
          evalGoal: EVAL_LABEL[data.evalGoal] ?? data.evalGoal,
          schoolName: data.schoolName,
          region: data.region,
          skill: data.skill ?? [],
          account: ACCOUNT_LABEL[data.account] ?? data.account,
          deviceMode: MODE_LABEL[data.deviceMode] ?? data.deviceMode,
        },
      }),
    staleTime: Infinity,
    retry: false,
  });

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

        <Widget icon="🤖" title="AI 맞춤 처방전" delay={0.02}>
          {aiQuery.isFetching && (
            <div className="flex items-center gap-2 text-muted-foreground py-6">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">
                {data.targetSubject || "선택한 과목"} · {(data.preferredTools ?? []).join(", ") || "선호 도구"} 기반 맞춤 처방전을 작성 중입니다…
              </span>
            </div>
          )}

          {aiQuery.isError && (
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-amber-700 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  {(aiQuery.error as Error)?.message ?? "처방전 생성에 실패했습니다."}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={() => aiQuery.refetch()}>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                다시 생성
              </Button>
            </div>
          )}

          {aiQuery.data && !aiQuery.isFetching && (
            <div className="space-y-5">
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-lg font-bold text-foreground leading-snug">
                  {aiQuery.data.title}
                </p>
              </div>

              <Section icon={<BookOpen className="w-4 h-4" />} title="모델 정의">
                <p className="text-[15px] leading-relaxed text-foreground">
                  {aiQuery.data.modelDefinition}
                </p>
              </Section>

              <Section icon={<ListOrdered className="w-4 h-4" />} title="수업 흐름">
                <ol className="space-y-1.5 text-[15px] leading-relaxed text-foreground list-decimal pl-5 marker:text-primary marker:font-semibold">
                  {aiQuery.data.flow.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              </Section>

              <Section icon={<CheckCircle2 className="w-4 h-4" />} title="평가 포인트">
                <ul className="space-y-1.5">
                  {aiQuery.data.evaluationPoints.map((s, i) => (
                    <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section icon={<AlertTriangle className="w-4 h-4" />} title="흔한 함정">
                <ul className="space-y-1.5">
                  {aiQuery.data.commonTraps.map((s, i) => (
                    <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-foreground">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-1 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </Section>

              <div className="rounded-2xl bg-primary/5 border-l-4 border-primary p-4">
                <MessageSquareQuote className="w-5 h-5 text-primary mb-2" />
                <p className="text-foreground text-[15px] leading-relaxed font-medium">
                  "{aiQuery.data.consultingScript}"
                </p>
              </div>

              <div className="flex justify-end">
                <Button size="sm" variant="ghost" onClick={() => aiQuery.refetch()}>
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  다시 생성
                </Button>
              </div>
            </div>
          )}
        </Widget>

        <Widget icon="🎯" title="핵심 수업·평가 모델 처방 (기준 모델)" delay={0.05}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge className="rounded-full bg-primary text-primary-foreground">
              <Target className="w-3 h-3 mr-1" />
              {typeMeta.label}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">
              점수 {score.toFixed(1)} / 5
            </span>
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-1">
              {STAGES.map((s) => {
                const active = s.key === type;
                return (
                  <div key={s.key} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full h-1.5 rounded-full ${
                        active ? "bg-primary" : "bg-muted"
                      }`}
                    />
                    <span
                      className={`text-[10px] ${
                        active ? "text-primary font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-sm font-semibold text-primary mb-1">{typeMeta.stage}</div>
          <p className="text-foreground leading-relaxed mb-6">{typeMeta.oneLiner}</p>

          <div className="space-y-5">
            <Section icon={<BookOpen className="w-4 h-4" />} title="모델 정의">
              <p className="text-[15px] leading-relaxed text-foreground">{typeMeta.coreModel}</p>
            </Section>

            <Section icon={<ListOrdered className="w-4 h-4" />} title="1차시 운영 흐름">
              <ol className="space-y-1.5 text-[15px] leading-relaxed text-foreground list-decimal pl-5 marker:text-primary marker:font-semibold">
                {typeMeta.lessonFlow.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
            </Section>

            <Section icon={<CheckCircle2 className="w-4 h-4" />} title="평가 포인트">
              <ul className="space-y-1.5">
                {typeMeta.evalFocus.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={<AlertTriangle className="w-4 h-4" />} title="흔한 함정">
              <ul className="space-y-1.5">
                {typeMeta.pitfalls.map((s, i) => (
                  <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-foreground">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-1 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 flex gap-3">
              <ArrowRight className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-primary mb-1">다음 단계</div>
                <p className="text-[15px] leading-relaxed text-foreground">{typeMeta.nextStep}</p>
              </div>
            </div>
          </div>
        </Widget>

        <Widget icon="💬" title="현장 스크립트" delay={0.1}>
          <div className="rounded-2xl bg-primary/5 border-l-4 border-primary p-5">
            <MessageSquareQuote className="w-6 h-6 text-primary mb-2" />
            <p className="text-foreground text-base leading-relaxed font-medium">
              "{typeMeta.script}"
            </p>
          </div>
        </Widget>

        <Widget icon="⚠️" title="현재 겪고 있는 어려움 (확인용)" delay={0.15}>
          <p className="text-xs text-muted-foreground mb-3">
            처방이 아니라, 선생님이 체크하신 항목을 다시 확인하는 영역입니다.
          </p>
          {difficultyBadges.length === 0 ? (
            <p className="text-sm text-muted-foreground">특이 사항 없음</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {difficultyBadges.map((b, i) => (
                <Badge key={i} variant="outline" className="rounded-full">{b}</Badge>
              ))}
            </div>
          )}
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
            <Field label="평가 혁신 대상 과목" value={data.targetSubject || "-"} />
            <Field label="선호 에듀테크 도구" value={data.preferredTools?.length ? data.preferredTools.join(", ") : "-"} />
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

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2 text-primary">
        {icon}
        <h4 className="text-sm font-bold">{title}</h4>
      </div>
      {children}
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
