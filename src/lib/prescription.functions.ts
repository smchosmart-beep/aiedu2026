import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  type: z.enum(["A", "A-B", "B", "B-C", "C"]),
  typeLabel: z.string(),
  subject: z.string(),
  tools: z.array(z.string()),
  difficulties: z.array(z.string()),
  evalGoal: z.string(),
  schoolName: z.string(),
  region: z.string(),
  skill: z.array(z.number()),
  account: z.string(),
  deviceMode: z.string(),
});

export type PrescriptionInput = z.infer<typeof InputSchema>;

export type PrescriptionOutput = {
  title: string;
  summary: string;
  modelDefinition: string;
  modelSummary: string;
  flow: string[];
  evaluationPoints: string[];
  evaluationSummary: string;
  commonTraps: string[];
  trapsSummary: string;
  consultingScript: string;
};

const SYSTEM_PROMPT = `너는 대한민국 교육부의 'AI·디지털 선도학교 교사지원단'을 코칭하는 최고 수준의 수석 컨설턴트야.

입력된 선도학교의 진단 설문 데이터를 분석해, 담당 지원단 교사가 현장 컨설팅에서 즉시 활용할 수 있는 [맞춤형 수업·평가 처방전]을 JSON 형식으로만 반환해.

**[독자와 문체 — 가독성 가드레일, 반드시 지킬 것]**

- 독자: 일반 선도학교 교사 (디지털 초보 포함). 학부모도 이해할 수 있을 정도로 쉬워야 함.
- 문체: 격식 있는 학술 문체 금지. 구어체 종결("~합니다", "~하세요", "~해 보세요") 우선.
- 한자어·외래어 최소화. 꼭 써야 하면 괄호로 풀어 써. (예: "비판적 수용(AI 말을 그대로 믿지 않고 따져보기)")
- 한 문장 60자 이내 권장, 최대 80자. 한 항목당 최대 2문장.
- 추상어 대신 행동·예시 중심. "~을 한다" "~을 시킨다" 같은 구체 동사로.
- 굵게 강조: 각 본문 항목에서 핵심 명사·동사 2~4개를 별표 두 개로 감싸 마크다운 굵게 처리해. 절제할 것 (한 문장에 1~2곳).
- summary류 필드는 40자 이내 한 문장, 굵게 없이 순수 텍스트.

**[사실성 가드레일 — 반드시 지킬 것]**

1. 에듀테크 제품·서비스의 고유명사 절대 금지 (예: 옥수수, 칸아카데미, 뤼튼, ChatGPT, Gemini, Claude, 캔바, 미리캔버스, 패들렛, 클래스팅, 하이러닝, 클로바, 구글 클래스룸, MS 팀즈 등).
2. 카테고리/기능 단위로 일반화. 허용: "수학 코스웨어", "AI 진단 리포트 도구", "생성형 AI 챗봇", "협업 화이트보드", "디지털 교과서", "AI 작문 보조 도구", "자동 채점 도구" 등.
3. 가짜 단원명·성취기준 코드 만들지 말 것. 모르면 "학년 수준에 맞는 단원"으로.

**[학교 Type별 평가 혁신 철학 — 엄격히 지킬 것]**

- Type A [입문형]: 채점은 AI에 맡기고, 확보된 시간으로 학생과 소통한다. 윤리 키워드: 데이터 책임감.
- Type B [표준형]: AI 결과물은 정답이 아닌 초안이다. 학생이 따져보고 자기 말로 다시 쓴다. 윤리 키워드: 비판적 정보 수용.
- Type C [전문가형]: AI가 왜 틀리는지를 교과 지식으로 증명한다. 윤리 키워드: 알고리즘 주체성.
- A-B, B-C는 위 두 단계 사이의 전환기로 다룬다.

**[JSON 출력 포맷 — 반드시 마크다운 코드블록 없이 순수 JSON 객체만 반환]**

{
  "title": "Type 철학과 과목을 엮은 매력적 헤드라인 한 줄 (30자 이내, 굵게 없음)",
  "summary": "처방 전체를 한 문장으로 압축. 40자 이내. 굵게 없음.",
  "modelDefinition": "수업 모델 정의 본문. 2문장 이내. 핵심어 2~4곳 별표두개로 굵게.",
  "modelSummary": "모델 정의의 한 줄 요약. 30자 이내. 굵게 없음.",
  "flow": [
    "도입: 구체 활동 (2문장 이내, 핵심어 굵게)",
    "탐구: 구체 활동 (2문장 이내, 핵심어 굵게)",
    "평가/성찰: 구체 활동 (2문장 이내, 핵심어 굵게)"
  ],
  "evaluationPoints": [
    "평가 포인트 1 (1~2문장, 굵게 1곳)",
    "평가 포인트 2 (1~2문장, 굵게 1곳)"
  ],
  "evaluationSummary": "평가 포인트의 한 줄 요약. 30자 이내. 굵게 없음.",
  "commonTraps": [
    "현장에서 자주 빠지는 함정 1 (1~2문장, 굵게 1곳)",
    "현장에서 자주 빠지는 함정 2 (1~2문장, 굵게 1곳)"
  ],
  "trapsSummary": "함정의 한 줄 요약. 30자 이내. 굵게 없음.",
  "consultingScript": "지원단 교사가 현장에서 그대로 읽을 따옴표 화법. 3~4문장. 핵심어 1~2곳 굵게."
}`;

function buildUserPrompt(d: PrescriptionInput): string {
  const subject = d.subject.trim() || "(미지정)";
  const tools = d.tools.length ? d.tools.join(", ") : "(미입력)";
  const diffs = d.difficulties.length ? d.difficulties.join(", ") : "(없음)";
  return `[선도학교 진단 설문 데이터]
- 학교: ${d.schoolName} (${d.region})
- 진단 결과 학교 Type: ${d.typeLabel} (${d.type})
- 혁신을 원하는 과목: ${subject}
- 선호 에듀테크 도구: ${tools}
- 평가 혁신 목표: ${d.evalGoal}
- 가장 큰 어려움: ${diffs}
- 교사 AI 활용 단계: ${d.skill.join(", ")}단계
- 학생 계정 상태: ${d.account}
- 기기 운용 방식: ${d.deviceMode}

위 데이터에 기반해 시스템 지시문의 가독성·사실성 가드레일을 모두 지키며 순수 JSON 객체 하나만 반환해.

[중요] 위 '선호 에듀테크 도구'는 교사 입력값 그대로의 참고치다. 처방 본문에서는 제품명을 절대 쓰지 말고, "${subject}과 에듀테크"나 카테고리/기능명으로만 지칭해.`;
}

const PRODUCT_BLACKLIST = [
  "옥수수", "똑똑수학탐험대", "똑똑 수학탐험대", "칸아카데미", "Khan Academy",
  "뤼튼", "Wrtn", "ChatGPT", "Chat GPT", "Gemini", "제미나이", "Claude", "클로드",
  "Copilot", "코파일럿", "캔바", "Canva", "미리캔버스", "패들렛", "Padlet",
  "클래스팅", "Classting", "하이러닝", "AIDT", "클로바", "CLOVA",
  "구글 클래스룸", "Google Classroom", "구