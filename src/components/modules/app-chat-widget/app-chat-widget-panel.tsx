"use client";

import AppChatWidgetBody from "@/components/modules/app-chat-widget/app-chat-widget-body";
import AppChatWidgetFooter from "@/components/modules/app-chat-widget/app-chat-widget-footer";
import AppChatWidgetHeader from "@/components/modules/app-chat-widget/app-chat-widget-header";
import type {
  AppChatWidgetMessage,
  ChatWidgetState,
} from "@/lib/types/chat-widget/chat-widget-types";
import { motion } from "motion/react";
import { memo, type RefObject } from "react";

type ChatWidgetPanelProps = {
  isFullscreen: boolean;
  onStateChange: (state: ChatWidgetState) => void;
  handleRef?: (element: Element | null) => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  inputValue: string;
  onInputValueChange: (value: string) => void;
  onSubmit: () => void;
  messages: AppChatWidgetMessage[];
  isLoading: boolean;
  isConfigured: boolean;
  isConfigurationLoading: boolean;
};

const ChatWidgetPanel = memo(function ChatWidgetPanel({
  isFullscreen,
  onStateChange,
  handleRef,
  inputRef,
  inputValue,
  onInputValueChange,
  onSubmit,
  messages,
  isLoading,
  isConfigured,
  isConfigurationLoading,
}: ChatWidgetPanelProps) {
  return (
    <motion.div
      key={isFullscreen ? "fullscreen" : "open"}
      className="flex h-full min-h-0 flex-col"
      transition={{ duration: 0.15 }}
    >
      <AppChatWidgetHeader
        onStateChange={onStateChange}
        handleRef={isFullscreen ? undefined : handleRef}
      />
      <div className="flex min-h-0 flex-1 px-1">
        <AppChatWidgetBody
          messages={messages}
          isLoading={isLoading}
          isConfigured={isConfigured}
          isConfigurationLoading={isConfigurationLoading}
        />
      </div>
      <AppChatWidgetFooter
        inputRef={inputRef}
        value={inputValue}
        onValueChange={onInputValueChange}
        onSubmit={onSubmit}
        isDisabled={isLoading || isConfigurationLoading || !isConfigured}
        isLoading={isLoading}
        isConfigured={isConfigured}
        isConfigurationLoading={isConfigurationLoading}
      />
    </motion.div>
  );
});

export { ChatWidgetPanel };
