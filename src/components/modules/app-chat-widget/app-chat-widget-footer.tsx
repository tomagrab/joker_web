import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

export default function AppChatWidgetFooter() {
  return (
    <div className="relative flex items-center justify-center px-1 py-2">
      <Textarea
        placeholder="Type your message..."
        className="text-foreground! ring-none! focus:ring-none! bg-background! h-20! max-h-30! min-h-20! flex-1 resize-none overflow-auto border-none! pr-10 outline-none! focus:ring-0! focus:outline-none! focus-visible:ring-0!"
      />
      <button className="absolute right-2 bottom-3 cursor-pointer rounded-full bg-blue-500 p-2 transition-colors duration-200 hover:bg-blue-600">
        <SendIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
