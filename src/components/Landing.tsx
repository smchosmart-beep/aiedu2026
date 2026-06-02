import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ClipboardList, PencilLine, Eye, ArrowRight } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-xl w-full mx-auto px-5 pt-16 pb-12 flex-1 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-xs font-semibold text-primary tracking-widest">
            2026 AI·디지털 활용 선도학교
          </div>
          <h1 className="text-3xl font-bold mt-2 leading-tight">
            수업 평가 혁신<br />컨설팅
          </h1>
          <p className="text-muted-foreground mt-3">
            우리 학교 상황을 진단하고, 교사지원단의<br />
            컨설팅을 받아보세요.
          </p>
        </motion.div>

        <div className="mt-12 space-y-4">
          <Card
            to="/?mode=survey"
            tag="선도학교 교사"
            title="진단 시작하기"
            desc="5단계 설문으로 우리 학교 환경을 진단합니다"
            icon={<ClipboardList className="w-7 h-7" />}
            primary
            delay={0.1}
          />
          <Card
            to="/consult"
            tag="교사지원단"
            title="컨설팅 기록하기"
            desc="교사지원단 이시라면 컨설팅 내용을 기록해주세요."
            icon={<PencilLine className="w-7 h-7" />}
            delay={0.2}
          />
          <Card
            to="/view"
            tag="공개 · 누구나"
            title="컨설팅 결과 열람"
            desc="각 학교의 수업 컨설팅 결과를 확인하세요"
            icon={<Eye className="w-7 h-7" />}
            delay={0.3}
          />
          <Card
            to="https://canva.link/2026ai"
            external
            tag="발표 자료"
            title="수업 및 평가 혁신 사례 컨설팅 발표(초등) 자료 보기"
            desc="외부 링크(Canva)로 이동합니다"
            icon={<Eye className="w-7 h-7" />}
            delay={0.4}
          />
        </div>

      </div>
    </div>
  );
}

function Card({
  to, tag, title, desc, icon, primary, delay = 0,
}: {
  to: string; tag: string; title: string; desc: string;
  icon: React.ReactNode; primary?: boolean; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
    >
function Card({
  to, tag, title, desc, icon, primary, delay = 0, external,
}: {
  to: string; tag: string; title: string; desc: string;
  icon: React.ReactNode; primary?: boolean; delay?: number; external?: boolean;
}) {
  const classes = [
    "block rounded-3xl p-6 shadow-sm border-2 border-transparent transition-colors",
    primary
      ? "bg-primary text-primary-foreground hover:border-primary/30"
      : "bg-card hover:border-primary/30",
  ].join(" ");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
    >
      {external ? (
        <a href={to} target="_blank" rel="noopener noreferrer" className={classes}>
          <CardInner tag={tag} title={title} desc={desc} icon={icon} primary={primary} />
        </a>
      ) : (
        <Link to={to} className={classes}>
          <CardInner tag={tag} title={title} desc={desc} icon={icon} primary={primary} />
        </Link>
      )}
    </motion.div>
  );
}

function CardInner({
  tag, title, desc, icon, primary,
}: {
  tag: string; title: string; desc: string; icon: React.ReactNode; primary?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className={[
        "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
        primary ? "bg-white/20 text-white" : "bg-primary/10 text-primary",
      ].join(" ")}>
        {icon}
      </div>
      <div className="flex-1">
        <div className={[
          "text-xs font-semibold tracking-wide",
          primary ? "text-white/80" : "text-primary",
        ].join(" ")}>
          {tag}
        </div>
        <div className="text-xl font-bold mt-1">{title}</div>
        <div className={[
          "text-sm mt-1",
          primary ? "text-white/80" : "text-muted-foreground",
        ].join(" ")}>
          {desc}
        </div>
      </div>
      <ArrowRight className="w-5 h-5 mt-4 opacity-70" />
    </div>
  );
}
            <div className="text-xl font-bold mt-1">{title}</div>
            <div className={[
              "text-sm mt-1",
              primary ? "text-white/80" : "text-muted-foreground",
            ].join(" ")}>
              {desc}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 mt-4 opacity-70" />
        </div>
      </Link>
    </motion.div>
  );
}
