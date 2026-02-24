import { BotIcon } from "lucide-react";
import { motion } from "motion/react";

export function ChatWidgetClosed() {
  return (
    <motion.div
      key="closed"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.15 }}
    >
      <BotIcon className="h-10 w-10" />
    </motion.div>
  );
}
