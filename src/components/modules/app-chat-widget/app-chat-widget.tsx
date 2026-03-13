"use client";

import { ChatWidgetClosed } from "@/components/modules/app-chat-widget//app-chat-widget-closed";
import { ChatWidgetPanel } from "@/components/modules/app-chat-widget//app-chat-widget-panel";
import { useChatWidgetState } from "@/hooks/app-chat-widget/use-chat-widget-state";
import { useStonlyApi } from "@/hooks/stonly/use-stonly-api";
import {
  getAnimateProps,
  getContainerClassName,
} from "@/lib/helpers/app-chat-widget/app-chat-widget-helpers";
import {
  appChatWidgetStonlyConfig,
  createAppChatWidgetMessageId,
  focusAppChatWidgetInput,
} from "@/lib/helpers/app-chat-widget/app-chat-widget-stonly-helpers";
import type { AppChatWidgetMessage } from "@/lib/types/chat-widget/chat-widget-types";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

type AppChatWidgetProps = {
  ref?: (element: Element | null) => void;
  handleRef?: (element: Element | null) => void;
};

const CONTAINER_TRANSITION = {
  type: "spring" as const,
  stiffness: 400,
  damping: 30,
};

export default function AppChatWidget({ ref, handleRef }: AppChatWidgetProps) {
  const { searchAndAnswer } = useStonlyApi();
  const {
    state,
    containerRef,
    originRect,
    isFullscreen,
    isClosed,
    needsFixed,
    isExitingFullscreen,
    handleStateChange,
    handleAnimationComplete,
  } = useChatWidgetState();
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<AppChatWidgetMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(async () => {
    const trimmedInput = inputValue.trim();

    if (!trimmedInput || isSubmitting || !appChatWidgetStonlyConfig.aiAgentId) {
      return;
    }

    const pendingMessageId = createAppChatWidgetMessageId();

    setInputValue("");
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: createAppChatWidgetMessageId(),
        role: "user",
        content: trimmedInput,
        status: "complete",
        format: "text",
      },
      {
        id: pendingMessageId,
        role: "assistant",
        content: "Stonly is working on your answer...",
        status: "pending",
        format: "text",
      },
    ]);
    setIsSubmitting(true);

    try {
      const response = await searchAndAnswer({
        query: trimmedInput,
        language: appChatWidgetStonlyConfig.language,
        aiAgentId: appChatWidgetStonlyConfig.aiAgentId,
        conversationId,
        kbBaseUrl: appChatWidgetStonlyConfig.kbBaseUrl,
        userEmail: appChatWidgetStonlyConfig.userEmail,
        webhookUrl: appChatWidgetStonlyConfig.webhookUrl,
      });

      setMessages((currentMessages) =>
        currentMessages.map((message) => {
          if (message.id !== pendingMessageId) {
            return message;
          }

          if (response.success && response.data) {
            return {
              ...message,
              content:
                response.data.answer?.trim() ||
                "Stonly did not return any answer text.",
              status: "complete",
              format: "html",
            };
          }

          return {
            ...message,
            content:
              response.message ?? "Stonly could not complete the request.",
            status: "error",
            format: "text",
          };
        }),
      );

      if (response.success && response.data?.conversationId) {
        setConversationId(response.data.conversationId);
      }
    } catch (error) {
      setMessages((currentMessages) =>
        currentMessages.map((message) => {
          if (message.id !== pendingMessageId) {
            return message;
          }

          return {
            ...message,
            content:
              error instanceof Error
                ? error.message
                : "Stonly could not complete the request.",
            status: "error",
            format: "text",
          };
        }),
      );
    } finally {
      setIsSubmitting(false);
      focusAppChatWidgetInput(inputRef.current);
    }
  }, [conversationId, inputValue, isSubmitting, searchAndAnswer]);

  return (
    <motion.div
      ref={(el) => {
        if (ref) ref(el);
        if (el) containerRef.current = el as HTMLDivElement;
      }}
      className={getContainerClassName(state, needsFixed)}
      style={
        isFullscreen && originRect
          ? { top: originRect.top, left: originRect.left }
          : undefined
      }
      initial={false}
      animate={getAnimateProps(state, isExitingFullscreen, originRect)}
      transition={CONTAINER_TRANSITION}
      onAnimationComplete={handleAnimationComplete}
      onClick={() => isClosed && handleStateChange("open")}
    >
      <AnimatePresence mode="popLayout">
        {isClosed ? (
          <ChatWidgetClosed />
        ) : (
          <ChatWidgetPanel
            isFullscreen={isFullscreen}
            onStateChange={handleStateChange}
            handleRef={handleRef}
            inputRef={inputRef}
            inputValue={inputValue}
            onInputValueChange={setInputValue}
            onSubmit={handleSubmit}
            messages={messages}
            isLoading={isSubmitting}
            isConfigured={appChatWidgetStonlyConfig.aiAgentId !== null}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
