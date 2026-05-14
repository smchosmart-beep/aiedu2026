import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { StepShell } from "./StepShell";
import { ChoiceCard } from "./ChoiceCard";
import { CompleteCard } from "./CompleteCard";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { REGIONS, type SurveyResponse, type DeviceOS, type DeviceMode, type Account, type Skill, type Difficulty, type EvalGoal } from "@/lib/types";
import { generateCode, saveResponse } from "@/lib/storage";

const TOTAL = 5;

const OS_OPTIONS: { v: DeviceOS; label: string }[] = [
  { v: "chromebook", label: "크롬북" },
  { v: "whalebook", label: "웨일북" },
  { v: "ipad", label: "아이패드" },
  { v: "android", label: "안드로이드" },
  { v: "windows", label: "윈도우" },
];
const MODE_OPTIONS: { v: DeviceMode; label: string; desc: string }[] = [
  { v: "1to1", label: "1인 1기기", desc: "학생마다 전용 기기 보유" },
  { v: "cart", label: "카트 공용", desc: "수업마다 카트로 배부·수합" },
  { v: "mobile", label: "이동 수업", desc: "특정 교실에서 공용 사용" },
];
const ACCOUNT_OPTIONS: { v: Account; label: string; desc: string }[] = [
  { v: "personal", label: "개인 계정 완료", desc: "학생 개별 계정 발급 완료" },
  { v: "shared", label: "교사 공용 계정", desc: "교사가 대표 계정으로 운용" },
  { v: "none", label: "계정 발급 불가", desc: "보호자 동의 등 미해결" },
];
const SKILL_OPTIONS: { v: Skill; label: string; desc: string }[] = [
  { v: 1, label: "1단계 · 제시용", desc: "수업 자료 제시 위주" },
  { v: 2, label: "2단계 · 상호작용", desc: "학생 응답·퀴즈 활용" },
  { v: 3, label: "3단계 · 코스웨어 활용", desc: "AI 코스웨어로 개별학습 운영" },
  { v: 4, label: "4단계 · 융합수업 설계", desc: "AI를 통합한 수업 직접 설계" },
];
const DIFF_OPTIONS: { v: Difficulty; label: string; desc: string }[] = [
  { v: "infra", label: "인프라 오류", desc: "네트워크·기기 트러블" },
  { v: "admin", label: "행정 부담", desc: "품의·구매·보고 부담" },
  { v: "design", label: "수업 설계 갈증", desc: "AI 활용 수업 모델 부재" },
  { v: "account", label: "계정 관리", desc: "로그인·동의서 관리 어려움" },
];
const EVAL_OPTIONS: { v: EvalGoal; label: string; desc: string }[] = [
  { v: "grading", label: "1. 채점 시간 경감", desc: "자동 채점·통계" },
  { v: "feedback", label: "2. 맞춤형 피드백", desc: "개별 학생 진단·처방" },
  { v: "inquiry", label: "3. 비판적 탐구", desc: "AI 응답을 검증·논쟁" },
  { v: "agency", label: "4. 학생 주체성 평가", desc: "AI를 도구로 한 창의적 산출" },
];

const variants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export function SurveyFlow() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string | null>(null);

  const [region, setRegion] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [deviceOS, setDeviceOS] = useState<DeviceOS[]>([]);
  const [deviceMode, setDeviceMode] = useState<DeviceMode | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [preferredTool, setPreferredTool] = useState("");
  const [evalGoal, setEvalGoal] = useState<EvalGoal | null>(null);

  const toggleOS = (v: DeviceOS) =>
    setDeviceOS((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  const toggleDiff = (v: Difficulty) => {
    setDifficulties((p) => {
      if (p.includes(v)) return p.filter((x) => x !== v);
      if (p.length >= 2) {
        toast("최대 2개까지 선택할 수 있어요");
        return p;
      }
      return [...p, v];
    });
  };

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = () => {
    const code = generateCode();
    const r: SurveyResponse = {
      code, region, schoolName,
      deviceOS, deviceMode: deviceMode!, account: account!,
      skill: skill!, difficulties,
      preferredTool, evalGoal: evalGoal!,
      createdAt: Date.now(),
    };
    saveResponse(r);
    setDone(code);
  };

  if (done) return <CompleteCard code={done} schoolName={schoolName} />;

  const canNext = (() => {
    switch (step) {
      case 0: return !!region && schoolName.trim().length > 0;
      case 1: return deviceOS.length > 0 && !!deviceMode;
      case 2: return !!account;
      case 3: return !!skill && difficulties.length === 2;
      case 4: return preferredTool.trim().length > 0 && !!evalGoal;
      default: return false;
    }
  })();

  return (
    <StepShell
      step={step}
      total={TOTAL}
      title={[
        "학교 정보를 알려주세요",
        "기기 환경은 어떤가요?",
        "에듀테크 계정 환경은요?",
        "선생님의 현재 상황은요?",
        "마지막으로, 수업 목표를 알려주세요",
      ][step]}
      subtitle={[
        "처방의 기준이 되는 기본 정보예요",
        "사용 중인 OS와 운용 방식을 모두 골라주세요",
        "학생 계정 발급 상태를 골라주세요",
        "현재 숙련도와 가장 큰 어려움 2가지",
        "주로 쓰는 도구와 평가 혁신 방향",
      ][step]}
      onBack={step > 0 ? back : undefined}
      onNext={step === TOTAL - 1 ? submit : next}
      nextLabel={step === TOTAL - 1 ? "진단 완료하기" : "다음"}
      canNext={canNext}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {step === 0 && (
            <>
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
            </>
          )}

          {step === 1 && (
            <>
              <Section label="기기 OS (다중 선택)">
                {OS_OPTIONS.map((o) => (
                  <ChoiceCard key={o.v} title={o.label}
                    selected={deviceOS.includes(o.v)} onClick={() => toggleOS(o.v)} />
                ))}
              </Section>
              <Section label="기기 운용 방식 (1개)">
                {MODE_OPTIONS.map((o) => (
                  <ChoiceCard key={o.v} title={o.label} description={o.desc}
                    selected={deviceMode === o.v} onClick={() => setDeviceMode(o.v)} />
                ))}
              </Section>
            </>
          )}

          {step === 2 && (
            <Section label="에듀테크 계정 환경 (1개)">
              {ACCOUNT_OPTIONS.map((o) => (
                <ChoiceCard key={o.v} title={o.label} description={o.desc}
                  selected={account === o.v} onClick={() => setAccount(o.v)} />
              ))}
            </Section>
          )}

          {step === 3 && (
            <>
              <Section label="교사 숙련도 (1개)">
                {SKILL_OPTIONS.map((o) => (
                  <ChoiceCard key={o.v} title={o.label} description={o.desc}
                    selected={skill === o.v} onClick={() => setSkill(o.v)} />
                ))}
              </Section>
              <Section label={`가장 큰 어려움 (정확히 2개 · ${difficulties.length}/2)`}>
                {DIFF_OPTIONS.map((o) => (
                  <ChoiceCard key={o.v} title={o.label} description={o.desc}
                    selected={difficulties.includes(o.v)} onClick={() => toggleDiff(o.v)} />
                ))}
              </Section>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  선호 에듀테크 도구
                </label>
                <Input
                  value={preferredTool}
                  onChange={(e) => setPreferredTool(e.target.value)}
                  placeholder="예) Khanmigo, 똑똑수학탐험대"
                  className="mt-2 h-14 rounded-2xl text-base"
                />
              </div>
              <Section label="평가 혁신 목표 (1개)">
                {EVAL_OPTIONS.map((o) => (
                  <ChoiceCard key={o.v} title={o.label} description={o.desc}
                    selected={evalGoal === o.v} onClick={() => setEvalGoal(o.v)} />
                ))}
              </Section>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </StepShell>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-muted-foreground">{label}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
