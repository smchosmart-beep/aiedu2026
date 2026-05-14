import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Props = {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

export function ChoiceCard({ selected, onClick, title, description, icon }: Props) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-2xl border-2 bg-card px-5 py-4 shadow-sm transition-colors",
        "flex items-center gap-4 min-h-[72px]",
        selected
          ? "border-primary bg-primary/5"
          : "border-transparent hover:border-primary/30",
      )}
    >
      {icon && <div className="text-2xl">{icon}</div>}
      <div className="flex-1">
        <div className="font-semibold text-foreground">{title}</div>
        {description && (
          <div className="text-sm text-muted-foreground mt-0.5">{description}</div>
        )}
      </div>
      <div
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
          selected ? "bg-primary text-primary-foreground" : "bg-muted",
        )}
      >
        {selected && <Check className="w-4 h-4" />}
      </div>
    </motion.button>
  );
}
