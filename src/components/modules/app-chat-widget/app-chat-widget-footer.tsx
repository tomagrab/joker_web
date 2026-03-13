import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";
import type { KeyboardEvent, RefObject } from "react";

type AppChatWidgetFooterProps = {
  inputRef: RefObject<HTMLTextAreaElement | null>;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  isDisabled: boolean;
  isLoading: boolean;
  isConfigured: boolean;
};

export default function AppChatWidgetFooter({
  inputRef,
  value,
  onValueChange,
  onSubmit,
  isDisabled,
  isLoading,
  isConfigured,
}: AppChatWidgetFooterProps) {
  const isSubmitDisabled = isDisabled || !value.trim();

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      className="flex flex-col gap-2 px-1 py-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="relative flex items-center justify-center">
        <Textarea
          ref={inputRef}
          value={value}
          disabled={isDisabled}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isConfigured
              ? "Type your message..."
              : "Configure Stonly to enable chat..."
          }
          className="text-foreground! ring-none! focus:ring-none! bg-background! h-20! max-h-30! min-h-20! flex-1 resize-none overflow-auto border-none! pr-12 outline-none! focus:ring-0! focus:outline-none! focus-visible:ring-0! disabled:cursor-not-allowed disabled:opacity-70"
        />
        <Button
          type="submit"
          size="icon-sm"
          disabled={isSubmitDisabled}
          className="absolute right-2 bottom-3 rounded-full"
          aria-label={isLoading ? "Waiting for Stonly answer" : "Send message"}
        >
          {isLoading ? (
            <Spinner className="size-4" />
          ) : (
            <SendIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}
