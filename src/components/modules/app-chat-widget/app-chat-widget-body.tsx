import { Spinner } from "@/components/ui/spinner";
import {
  APP_CHAT_WIDGET_LOADING_MESSAGES,
  getAppChatWidgetLoadingMessage,
} from "@/lib/helpers/app-chat-widget/app-chat-widget-stonly-helpers";
import type { AppChatWidgetMessage } from "@/lib/types/chat-widget/chat-widget-types";
import DOMPurify from "dompurify";
import { useEffect, useMemo, useRef, useState } from "react";

type AppChatWidgetPendingMessageProps = {
  initialMessage?: string;
};

const TYPING_CHARACTER_INTERVAL_MS = 24;
const MIN_LOADING_MESSAGE_CYCLE_MS = 4200;
const FULLY_TYPED_MESSAGE_HOLD_MS = 2200;

function AppChatWidgetPendingMessage({
  initialMessage,
}: AppChatWidgetPendingMessageProps) {
  const initialIndex = useMemo(() => {
    if (!initialMessage) {
      return 0;
    }

    const existingIndex = APP_CHAT_WIDGET_LOADING_MESSAGES.indexOf(
      initialMessage as (typeof APP_CHAT_WIDGET_LOADING_MESSAGES)[number],
    );

    return existingIndex >= 0 ? existingIndex : 0;
  }, [initialMessage]);

  const [messageIndex, setMessageIndex] = useState(initialIndex);
  const currentMessage = getAppChatWidgetLoadingMessage(messageIndex);
  const [visibleCharacterCount, setVisibleCharacterCount] = useState(0);

  useEffect(() => {
    setMessageIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    setVisibleCharacterCount(0);
  }, [currentMessage]);

  useEffect(() => {
    if (visibleCharacterCount >= currentMessage.length) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setVisibleCharacterCount((currentCount) => currentCount + 1);
    }, TYPING_CHARACTER_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentMessage, visibleCharacterCount]);

  useEffect(() => {
    const nextRotationDelay = Math.max(
      MIN_LOADING_MESSAGE_CYCLE_MS,
      currentMessage.length * TYPING_CHARACTER_INTERVAL_MS +
        FULLY_TYPED_MESSAGE_HOLD_MS,
    );

    const timeoutId = window.setTimeout(() => {
      setMessageIndex(
        (currentIndex) =>
          (currentIndex + 1) % APP_CHAT_WIDGET_LOADING_MESSAGES.length,
      );
    }, nextRotationDelay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentMessage]);

  return (
    <div className="flex items-center gap-2">
      <Spinner className="size-4 shrink-0" />
      <span className="app-chat-widget-shimmer text-sm font-medium">
        {currentMessage.slice(0, visibleCharacterCount)}
      </span>
    </div>
  );
}

type AppChatWidgetBodyProps = {
  messages: AppChatWidgetMessage[];
  isLoading: boolean;
  isConfigured: boolean;
};

export default function AppChatWidgetBody({
  messages,
  isLoading,
  isConfigured,
}: AppChatWidgetBodyProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      ref={scrollContainerRef}
      className="bg-background text-foreground min-h-0 flex-1 overflow-y-auto rounded-md p-4 inset-shadow-sm inset-shadow-black/5"
    >
      {messages.length === 0 ? (
        <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3 text-center">
          <p className="max-w-56 text-sm font-medium text-balance">
            {isConfigured
              ? "Ask Stonly a question and the answer will appear here."
              : "Set NEXT_PUBLIC_STONLY_AI_AGENT_ID to enable the Stonly chat widget."}
          </p>
          {isLoading ? (
            <div className="flex items-center gap-2 text-xs">
              <Spinner className="size-4" />
              <span>Waiting for Stonly to respond...</span>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-full flex-col gap-3">
          {messages.map((message) => {
            const isUserMessage = message.role === "user";

            return (
              <div
                key={message.id}
                className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm ${
                    isUserMessage
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : message.status === "error"
                        ? "bg-destructive/10 text-destructive rounded-bl-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {message.status === "pending" ? (
                    <AppChatWidgetPendingMessage
                      initialMessage={message.content}
                    />
                  ) : message.format === "html" ? (
                    <div
                      className="stonly-html [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_li]:mb-2 [&_li]:ml-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(message.content),
                      }}
                    />
                  ) : (
                    <p className="text-balance whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
