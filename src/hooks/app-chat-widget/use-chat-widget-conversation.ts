import {
  appChatWidgetStonlyConfig,
  createAppChatWidgetMessageId,
  focusAppChatWidgetInput,
  getRandomAppChatWidgetLoadingMessage,
} from "@/lib/helpers/app-chat-widget/app-chat-widget-stonly-helpers";
import { stonlyAiSearchAndAnswer } from "@/lib/server/actions/stonly/ai/stonly-ai-server-actions";
import type { StonlyAiSearchAndAnswerApiResponse } from "@/lib/types/api/stonly/ai/stonly-ai-types";
import type { AppChatWidgetMessage } from "@/lib/types/chat-widget/chat-widget-types";
import DOMPurify from "dompurify";
import { useCallback, useRef, useState } from "react";

const EMPTY_ANSWER_MESSAGE = "Stonly did not return any answer text.";
const REQUEST_ERROR_MESSAGE = "Stonly could not complete the request.";

function createUserMessage(content: string): AppChatWidgetMessage {
  return {
    id: createAppChatWidgetMessageId(),
    role: "user",
    content,
    status: "complete",
    format: "text",
  };
}

function createPendingAssistantMessage(): AppChatWidgetMessage {
  return {
    id: createAppChatWidgetMessageId(),
    role: "assistant",
    content: getRandomAppChatWidgetLoadingMessage(),
    status: "pending",
    format: "text",
  };
}

function getCompletedAssistantMessage(
  response: StonlyAiSearchAndAnswerApiResponse,
): Pick<AppChatWidgetMessage, "content" | "status" | "format"> {
  const answer = response.data?.answer?.trim() || EMPTY_ANSWER_MESSAGE;
  const sanitizedAnswer = DOMPurify.sanitize(answer) || EMPTY_ANSWER_MESSAGE;

  return {
    content: sanitizedAnswer,
    status: "complete",
    format: "html",
  };
}

function getErroredAssistantMessage(
  content: string,
): Pick<AppChatWidgetMessage, "content" | "status" | "format"> {
  return {
    content,
    status: "error",
    format: "text",
  };
}

export function useChatWidgetConversation() {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<AppChatWidgetMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isConfigured = appChatWidgetStonlyConfig.aiAgentId !== null;

  const replacePendingMessage = useCallback(
    (
      pendingMessageId: string,
      nextMessage: Pick<AppChatWidgetMessage, "content" | "status" | "format">,
    ) => {
      setMessages((currentMessages) =>
        currentMessages.map((message) => {
          if (message.id !== pendingMessageId) {
            return message;
          }

          return {
            ...message,
            ...nextMessage,
          };
        }),
      );
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    const trimmedInput = inputValue.trim();

    if (!trimmedInput || isSubmitting || !appChatWidgetStonlyConfig.aiAgentId) {
      return;
    }

    const pendingMessage = createPendingAssistantMessage();

    setInputValue("");
    setMessages((currentMessages) => [
      ...currentMessages,
      createUserMessage(trimmedInput),
      pendingMessage,
    ]);
    setIsSubmitting(true);

    try {
      const response = await stonlyAiSearchAndAnswer({
        query: trimmedInput,
        language: appChatWidgetStonlyConfig.language,
        aiAgentId: appChatWidgetStonlyConfig.aiAgentId,
        conversationId,
        kbBaseUrl: appChatWidgetStonlyConfig.kbBaseUrl,
        userEmail: appChatWidgetStonlyConfig.userEmail,
        webhookUrl: appChatWidgetStonlyConfig.webhookUrl,
      });

      replacePendingMessage(
        pendingMessage.id,
        response.success && response.data
          ? getCompletedAssistantMessage(response)
          : getErroredAssistantMessage(
              response.message ?? REQUEST_ERROR_MESSAGE,
            ),
      );

      if (response.success && response.data?.conversationId) {
        setConversationId(response.data.conversationId);
      }
    } catch (error) {
      replacePendingMessage(
        pendingMessage.id,
        getErroredAssistantMessage(
          error instanceof Error ? error.message : REQUEST_ERROR_MESSAGE,
        ),
      );
    } finally {
      setIsSubmitting(false);
      focusAppChatWidgetInput(inputRef.current);
    }
  }, [conversationId, inputValue, isSubmitting, replacePendingMessage]);

  return {
    inputRef,
    inputValue,
    setInputValue,
    messages,
    isSubmitting,
    isConfigured,
    handleSubmit,
  };
}
