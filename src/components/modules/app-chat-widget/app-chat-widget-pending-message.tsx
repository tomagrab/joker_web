import { Spinner } from "@/components/ui/spinner";
import {
  APP_CHAT_WIDGET_LOADING_MESSAGES,
  getAppChatWidgetLoadingMessage,
} from "@/lib/helpers/app-chat-widget/app-chat-widget-stonly-helpers";
import { useEffect, useMemo, useState } from "react";

type AppChatWidgetPendingMessageProps = {
  initialMessage?: string;
  isPaused?: boolean;
};

const TYPING_CHARACTER_INTERVAL_MS = 24;
const MIN_LOADING_MESSAGE_CYCLE_MS = 4200;
const FULLY_TYPED_MESSAGE_HOLD_MS = 2200;

export function AppChatWidgetPendingMessage({
  initialMessage,
  isPaused = false,
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
  const [visibleCharacterCount, setVisibleCharacterCount] = useState(0);
  const currentMessage = getAppChatWidgetLoadingMessage(messageIndex);

  useEffect(() => {
    setMessageIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    setVisibleCharacterCount(0);
  }, [currentMessage]);

  useEffect(() => {
    if (isPaused || visibleCharacterCount >= currentMessage.length) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setVisibleCharacterCount((currentCount) => currentCount + 1);
    }, TYPING_CHARACTER_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentMessage, isPaused, visibleCharacterCount]);

  useEffect(() => {
    if (isPaused) {
      return;
    }

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
  }, [currentMessage, isPaused]);

  const displayedMessage = isPaused
    ? currentMessage
    : currentMessage.slice(0, visibleCharacterCount);

  return (
    <div className="flex items-center gap-2">
      <Spinner className="size-4 shrink-0" />
      <span className="app-chat-widget-shimmer text-sm font-medium">
        {displayedMessage}
      </span>
    </div>
  );
}
