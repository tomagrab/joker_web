"use client";

import { BotIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type AppChatWidgetProps = {
  ref: (element: Element | null) => void;
};

export default function AppChatWidget({ ref }: AppChatWidgetProps) {
  type ChatWidgetStateType = "closed" | "open" | "fullscreen";
  const [chatWidgetState, setChatWidgetState] =
    useState<ChatWidgetStateType>("closed");

  const isClosed = chatWidgetState === "closed";
  const isOpen = chatWidgetState === "open";

  const closedSize = 56;
  const openWidth = 300;
  const openHeight = 500;

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col overflow-hidden ${
        isClosed
          ? "cursor-pointer items-center justify-center"
          : isOpen
            ? ""
            : "fixed inset-0 z-50 h-full w-full p-2"
      }`}
      initial={false}
      animate={{
        width: isClosed ? closedSize : isOpen ? openWidth : "100%",
        height: isClosed ? closedSize : isOpen ? openHeight : "100%",
        borderRadius: isClosed ? closedSize / 2 : isOpen ? 8 : 0,
        backgroundColor: isClosed
          ? "var(--color-blue-500)"
          : "var(--color-white)",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      onClick={() => {
        if (chatWidgetState === "closed") {
          setChatWidgetState("open");
        }
      }}
    >
      <AnimatePresence mode="popLayout">
        {isClosed ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <BotIcon className="h-10 w-10" />
          </motion.div>
        ) : isOpen ? (
          <motion.div
            key="open"
            className="flex h-full flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between bg-white p-2">
              <span>Header</span>
              <button
                className="rounded p-1 text-sm hover:bg-gray-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setChatWidgetState("closed");
                }}
              >
                ✕
              </button>
            </div>
            <div className="flex-1 bg-gray-500">Body</div>
            <div className="bg-white p-2">Footer</div>
          </motion.div>
        ) : (
          <motion.div
            key="fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Fullscreen
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
