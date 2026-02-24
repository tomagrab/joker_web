"use client";

import type { ChatWidgetState } from "@/lib/types/chat-widget/chat-widget-types";
import { motion } from "motion/react";

import AppChatWidgetBody from "./app-chat-widget-body";
import AppChatWidgetFooter from "./app-chat-widget-footer";
import AppChatWidgetHeader from "./app-chat-widget-header";

type ChatWidgetPanelProps = {
  isFullscreen: boolean;
  onStateChange: (state: ChatWidgetState) => void;
  handleRef?: (element: Element | null) => void;
};

export function ChatWidgetPanel({
  isFullscreen,
  onStateChange,
  handleRef,
}: ChatWidgetPanelProps) {
  return (
    <motion.div
      key={isFullscreen ? "fullscreen" : "open"}
      className="flex h-full flex-col"
      transition={{ duration: 0.15 }}
    >
      <AppChatWidgetHeader
        onStateChange={onStateChange}
        handleRef={isFullscreen ? undefined : handleRef}
      />
      <div className="flex flex-1 px-1">
        <AppChatWidgetBody />
      </div>
      <AppChatWidgetFooter />
    </motion.div>
  );
}
