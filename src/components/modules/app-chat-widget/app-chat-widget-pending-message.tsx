import { Spinner } from "@/components/ui/spinner";
import { getRandomAppChatWidgetLoadingMessage } from "@/lib/helpers/app-chat-widget/app-chat-widget-stonly-helpers";

type AppChatWidgetPendingMessageProps = {
  initialMessage?: string;
};

export function AppChatWidgetPendingMessage({
  initialMessage,
}: AppChatWidgetPendingMessageProps) {
  const displayedMessage =
    initialMessage ?? getRandomAppChatWidgetLoadingMessage();

  return (
    <div className="flex items-center gap-2">
      <Spinner className="size-4 shrink-0" />
      <span className="app-chat-widget-shimmer text-sm font-medium">
        {displayedMessage}
      </span>
    </div>
  );
}
