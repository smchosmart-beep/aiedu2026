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
  modelDefinition: string;
  flow: string[];
  evaluationPoints: string[];
  commonTraps: string[];
  consultingScript: string;
};

const SYSTEM_PROMPT = `너는 대한민국 교육부의 'AI·디지털 선도학교 교사지원단'을 코칭하는 최고 수준의 수석 컨설턴트야.

입력된 선도학교의 진단 설문 데이터(과목, 선호 도구, 페인포인트, 학교 Type 등)를 분석하여, 담당 지원단 교사가 현장 컨설팅에서 즉시 활용할 수 있는 [맞춤형 수업·평가 처방전]을 JSON 형식으로만 반환해.

**[사실성 가드레일 — 반드시 지킬 것]**

1. **에듀테크 제품·서비스의 고유명사 절대 금지**: 처방전 본문(title, modelDefinition, flow, evaluationPoints, commonTraps, consultingScript)에 어떤 에듀테크 제품명·서비스명·앱명도 쓰지 마. (예: 옥수수, 똑똑수학탐험대, 칸아카데미, 뤼튼, ChatGPT, Gemini, Claude, 캔바, 미리캔버스, 패들렛, 클래스팅, 하이러닝, 클로바, 구글 클래스룸, MS 팀즈 등 일체 금지)
2. **카테고리/기능 단위로 일반화**해서 진술해. 허용 표현 예시: "{과목}과 에듀테크", "수학 코스웨어", "AI 진단 리포트 도구", "생성형 AI 챗봇", "협업 화이트보드", "디지털 교과서", "AI 작문 보조 도구", "자동 채점 도구".
3. **함수적 지칭**: "○○ 기능이 있는 도구를 활용해 ~한다" 형태로 능력을 기술하고, 어떤 제품을 쓸지는 교사 판단에 맡겨. 존재 여부가 불확실한 기능을 특정 제품에 귀속시키지 마.
4. **단원 예시 가드레일**: 가짜 단원명·성취기준 코드는 만들지 말고, 잘 모르면 "학년 수준에 맞는 단원" 같은 일반화 표현을 써. 전형적 영역(국어-논설문, 수학-도형, 사회-지역문제 등) 수준의 일반 예시는 허용.

**[학교 Type별 평가 혁신 철학 (반드시 아래 방향성을 엄격히 지킬 것)]**

- Type A [생존·입문형]: "평가의 자동화와 하이터치(High-Touch) 피드백"
  - 수업 철학: 채점은 AI(코스웨어 등)에 맡기고, 확보된 시간으로 학생과 소통하는 데 집중한다.
  - 활동 및 평가: AI 진단 결과를 바탕으로 학생이 자신의 도달도와 학습 태도를 짧은 글로 성찰하게 한다.
  - AI 윤리 루브릭: 자신의 데이터를 속이지 않고 정직하게 입력했는가? (데이터 책임감)

- Type B [도약·표준형]: "AI 산출물의 비판적 수용과 주체적 재구성"
  - 수업 철학: AI의 결과물은 정답이 아닌 '초안(Draft)'이다. 최종 결정권은 인간에게 있다.
  - 활동 및 평가: AI(챗봇, 생성형 도구 등)가 만든 산출물에서 논리적 허점, 편향성, 오류를 팩트체크하여 반박하고, 학생 본인의 교과 지식으로 재구성(Refining)한다.
  - AI 윤리 루브릭: AI의 제안을 무비판적으로 복붙하지 않고 비판적 사고로 보완했는가? (비판적 정보 수용)

- Type C [선도·전문가형]: "시스템의 해체와 알고리즘 한계 검증"
  - 수업 철학: 도구 활용을 넘어, 시스템이 왜 틀리는지, 혹은 데이터가 어떻게 편향을 만드는지를 교과 지식으로 증명한다.
  - 활동 및 평가: AI가 실패하는 반례(Edge Case)를 의도적으로 설계하여, 교과적 논리(수학적 증명, 사회적 맥락 등)로 시스템의 결함을 분석하고 개선안을 도출하는 프로젝트를 진행한다.
  - AI 윤리 루브릭: 기술의 불완전성을 교과 지식으로 명확히 설명하며 메타인지를 발휘했는가? (알고리즘 주체성)

**[JSON 출력 포맷 (반드시 마크다운 코드블록 없이 순수 JSON 객체만 반환할 것)]**

{
  "title": "[{해당 Type의 핵심 철학}]과 [{입력된 과목}]을 엮은 매력적인 헤드라인 한 줄",
  "modelDefinition": "선택한 [{입력된 과목}] 및 [{입력된 도구}]에 맞춘 해당 Type의 핵심 수업 모델 정의 (3문장 이내)",
  "flow": [
    "도입: (선택한 도구를 활용해 상황을 제시하는 구체적 방법)",
    "탐구: (Type 철학과 과목 성취기준이 결합된 학생 주도 활동)",
    "평가/성찰: (결과물 제출 및 루브릭에 기반한 평가 방법)"
  ],
  "evaluationPoints": [
    "[{입력된 과목}]의 교과적 논리와 해당 Type의 AI 윤리를 융합한 구체적 평가 포인트 1",
    "[{입력된 과목}]의 교과적 논리와 해당 Type의 AI 윤리를 융합한 구체적 평가 포인트 2"
  ],
  "commonTraps": [
    "이 Type과 [{입력된 과목}] 컨설팅 시 교사들이 흔히 빠지는 함정 1",
    "이 Type과 [{입력된 과목}] 컨설팅 시 교사들이 흔히 빠지는 함정 2"
  ],
  "consultingScript": "지원단 교사가 현장에 가서 직접 말하듯 읽을 수 있는 따옴표 형태의 화법 스크립트. 해당 Type의 핵심 철학, 과목의 특성, 도구 활용법을 한 번에 묶어서 설득력 있게 전달할 것. (4문장 이내)"
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

위 데이터에 기반하여 시스템 지시문에 따라 순수 JSON 객체 하나만 반환해.`;
}

export const generatePrescription = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<PrescriptionOutput> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("AI 게이트웨이 키가 설정되지 않았습니다.");
    }

    const res = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: buildUserPrompt(data) },
          ],
          response_format: { type: "json_object" },
        }),
      },
    );

    if (res.status === 429) {
      throw new Error("AI 호출 빈도 제한입니다. 잠시 후 다시 시도해 주세요.");
    }
    if (res.status === 402) {
      throw new Error("AI 크레딧이 소진되었습니다. 워크스페이스 사용량을 확인해 주세요.");
    }
    if (!res.ok) {
      const text = await res.text();
      console.error("AI gateway error", res.status, text);
      throw new Error(`AI 호출 실패 (${res.status})`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    let parsed: PrescriptionOutput;
    try {
      parsed = JSON.parse(content);
    } catch {
      // strip code fences if any
      const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      parsed = JSON.parse(cleaned);
    }

    return {
      title: String(parsed.title ?? ""),
      modelDefinition: String(parsed.modelDefinition ?? ""),
      flow: Array.isArray(parsed.flow) ? parsed.flow.map(String) : [],
      evaluationPoints: Array.isArray(parsed.evaluationPoints)
        ? parsed.evaluationPoints.map(String)
        : [],
      commonTraps: Array.isArray(parsed.commonTraps)
        ? parsed.commonTraps.map(String)
        : [],
      consultingScript: String(parsed.consultingScript ?? ""),
    };
  });
