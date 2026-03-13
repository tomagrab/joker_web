import { ChatWidgetState } from "@/lib/types/chat-widget/chat-widget-types";
import {
  GripVerticalIcon,
  MaximizeIcon,
  MinimizeIcon,
  XIcon,
} from "lucide-react";

type AppChatWidgetHeaderProps = {
  onStateChange: (state: ChatWidgetState) => void;
  handleRef?: (element: Element | null) => void;
};

export default function AppChatWidgetHeader({
  onStateChange,
  handleRef,
}: AppChatWidgetHeaderProps) {
  return (
    <div className="flex items-center px-1 py-2">
      <div className="flex flex-1 justify-start">
        {handleRef && (
          <button
            ref={handleRef}
            className="hover:bg-accent/15 hover:shadow-primary/20 cursor-grab rounded-full p-1.5 text-sm transition-all duration-200 hover:shadow-[0_0_10px_2px] active:cursor-grabbing"
          >
            <GripVerticalIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex flex-1 justify-center">
        <h3 className="font-bold">🤡🤖</h3>
      </div>
      <div className="flex flex-1 justify-end">
        {handleRef ? (
          <button
            className="hover:bg-accent/15 hover:shadow-primary/20 cursor-pointer rounded-full p-1.5 text-sm transition-all duration-200 hover:shadow-[0_0_10px_2px]"
            onClick={(e) => {
              e.stopPropagation();
              onStateChange("fullscreen");
            }}
          >
            <MaximizeIcon className="h-4 w-4" />
          </button>
        ) : (
          <button
            className="hover:bg-accent/15 hover:shadow-primary/20 cursor-pointer rounded-full p-1.5 text-sm transition-all duration-200 hover:shadow-[0_0_10px_2px]"
            onClick={(e) => {
              e.stopPropagation();
              onStateChange("open");
            }}
          >
            <MinimizeIcon className="h-4 w-4" />
          </button>
        )}

        <button
          className="hover:bg-accent/15 hover:shadow-primary/20 cursor-pointer rounded-full p-1.5 text-sm transition-all duration-200 hover:shadow-[0_0_10px_2px]"
          onClick={(e) => {
            e.stopPropagation();
            onStateChange("closed");
          }}
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
