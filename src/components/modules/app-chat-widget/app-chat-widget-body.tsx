import { AppChatWidgetPendingMessage } from "@/components/modules/app-chat-widget/app-chat-widget-pending-message";
import { Spinner } from "@/components/ui/spinner";
import type { AppChatWidgetMessage } from "@/lib/types/chat-widget/chat-widget-types";
import { useEffect, useRef } from "react";

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
                        __html: message.content,
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
