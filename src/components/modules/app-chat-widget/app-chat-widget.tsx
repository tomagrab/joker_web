import { BotIcon } from "lucide-react";

type AppChatWidgetProps = {
  ref: (element: Element | null) => void;
};

export default function AppChatWidget({ ref }: AppChatWidgetProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-full bg-blue-500 p-2"
      ref={ref}
    >
      <BotIcon className="h-10 w-10 cursor-pointer" />
    </div>
  );
}
