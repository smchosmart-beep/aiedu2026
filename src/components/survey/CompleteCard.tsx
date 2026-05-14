import { useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Sparkles, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = { code: string; schoolName: string };

export function CompleteCard({ code, schoolName }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const saveImage = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `${schoolName || "school"}_컨설팅코드.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
      toast.error("이미지 저장에 실패했어요");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="inline-flex w-14 h-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4"
          >
            <Sparkles className="w-7 h-7" />
          </motion.div>
          <h1 className="text-2xl font-bold">진단이 완료되었습니다</h1>
          <p className="text-muted-foreground mt-2">
            아래 코드를 교사지원단에 전달해 주세요
          </p>
        </div>

        <div
          ref={cardRef}
          className="bg-card rounded-3xl shadow-sm border p-8 text-center"
        >
          <div className="text-xs font-semibold text-primary tracking-wider mb-2">
            CONSULTING CODE
          </div>
          <div className="text-5xl font-bold tracking-[0.3em] text-primary py-4 font-mono">
            {code}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {schoolName}
          </div>
          <div className="mt-6 pt-6 border-t text-xs text-muted-foreground">
            2026 AI·디지털 선도학교 컨설팅
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            onClick={saveImage}
            size="lg"
            className="w-full h-14 rounded-2xl text-base"
          >
            <Download className="w-5 h-5 mr-2" />
            이미지로 저장하기
          </Button>
          <Link to="/">
            <Button variant="ghost" size="lg" className="w-full h-12 rounded-2xl">
              <Home className="w-4 h-4 mr-2" />
              처음으로
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
