import {
  createAppChatWidgetMessageId,
  focusAppChatWidgetInput,
  getRandomAppChatWidgetLoadingMessage,
} from "@/lib/helpers/app-chat-widget/app-chat-widget-stonly-helpers";
import type {
  StonlyAiSearchAndAnswerApiResponse,
  StonlyAiWidgetConfigResponse,
  StonlyAiWidgetSearchRequest,
} from "@/lib/types/api/stonly/ai/stonly-ai-types";
import type { AppChatWidgetMessage } from "@/lib/types/chat-widget/chat-widget-types";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useRef, useState } from "react";

const EMPTY_ANSWER_MESSAGE = "Stonly did not return any answer text.";
const REQUEST_ERROR_MESSAGE = "Stonly could not complete the request.";
const REQUEST_ABORTED_MESSAGE = "Request was canceled.";

async function requestStonlyConfig(
  signal: AbortSignal,
): Promise<StonlyAiWidgetConfigResponse | null> {
  try {
    const response = await fetch("/api/stonly/config", {
      cache: "no-store",
      signal,
    });

    return (await response.json()) as StonlyAiWidgetConfigResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }

    return {
      isConfigured: false,
    };
  }
}

async function requestStonlyAnswer(
  request: StonlyAiWidgetSearchRequest,
  signal: AbortSignal,
): Promise<StonlyAiSearchAndAnswerApiResponse | null> {
  try {
    const response = await fetch("/api/stonly/search-and-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal,
    });

    return (await response.json()) as StonlyAiSearchAndAnswerApiResponse;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return null;
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : REQUEST_ERROR_MESSAGE,
      data: null,
    };
  }
}

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
  const requestAbortControllerRef = useRef<AbortController | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<AppChatWidgetMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isConfigLoading, setIsConfigLoading] = useState(true);

  useEffect(() => {
    const configurationAbortController = new AbortController();

    void (async () => {
      const response = await requestStonlyConfig(
        configurationAbortController.signal,
      );

      if (!response) {
        return;
      }

      setIsConfigured(response.isConfigured);
      setIsConfigLoading(false);
    })();

    return () => {
      configurationAbortController.abort();
      requestAbortControllerRef.current?.abort();
    };
  }, []);

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

    if (!trimmedInput || isSubmitting || isConfigLoading || !isConfigured) {
      return;
    }

    const pendingMessage = createPendingAssistantMessage();
    const abortController = new AbortController();

    requestAbortControllerRef.current?.abort();
    requestAbortControllerRef.current = abortController;

    setInputValue("");
    setMessages((currentMessages) => [
      ...currentMessages,
      createUserMessage(trimmedInput),
      pendingMessage,
    ]);
    setIsSubmitting(true);

    try {
      const response = await requestStonlyAnswer(
        {
          query: trimmedInput,
          conversationId,
        },
        abortController.signal,
      );

      if (!response) {
        return;
      }

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
      if (error instanceof Error && error.name === "AbortError") {
        replacePendingMessage(
          pendingMessage.id,
          getErroredAssistantMessage(REQUEST_ABORTED_MESSAGE),
        );

        return;
      }

      replacePendingMessage(
        pendingMessage.id,
        getErroredAssistantMessage(
          error instanceof Error ? error.message : REQUEST_ERROR_MESSAGE,
        ),
      );
    } finally {
      if (requestAbortControllerRef.current === abortController) {
        requestAbortControllerRef.current = null;
      }

      setIsSubmitting(false);
      focusAppChatWidgetInput(inputRef.current);
    }
  }, [
    conversationId,
    inputValue,
    isConfigLoading,
    isConfigured,
    isSubmitting,
    replacePendingMessage,
  ]);

  return {
    inputRef,
    inputValue,
    setInputValue,
    messages,
    isSubmitting,
    isConfigured,
    isConfigLoading,
    handleSubmit,
  };
}
