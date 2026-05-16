import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Home } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  canNext: boolean;
  children: React.ReactNode;
};

export function StepShell({
  step, total, title, subtitle, onBack, onNext, nextLabel = "다음", canNext, children,
}: Props) {
  const progress = ((step + 1) / total) * 100;
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur border-b">
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center gap-3">
          {onBack ? (
            <button onClick={onBack} className="p-1 -ml-1 rounded-full hover:bg-muted" aria-label="이전 단계">
              <ChevronLeft className="w-6 h-6" />
            </button>
          ) : <div className="w-8" />}
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="text-xs text-muted-foreground tabular-nums w-8 text-right">
            {step + 1}/{total}
          </div>
          <button onClick={() => setConfirmOpen(true)} className="p-1 -mr-1 rounded-full hover:bg-muted" aria-label="홈으로">
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>진단을 중단할까요?</AlertDialogTitle>
            <AlertDialogDescription>입력한 내용은 저장되지 않아요.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate({ to: "/" })}>확인</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex-1 max-w-xl w-full mx-auto px-5 pt-8 pb-32">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        <div className="mt-8 space-y-6">{children}</div>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t">
        <div className="max-w-xl mx-auto px-5 py-4">
          <Button
            size="lg"
            className="w-full h-14 text-base rounded-2xl"
            disabled={!canNext}
            onClick={onNext}
          >
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
