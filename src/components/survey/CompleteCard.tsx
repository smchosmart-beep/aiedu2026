import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Home } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CompleteCard() {
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
        </div>

        <div className="mt-6">
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
