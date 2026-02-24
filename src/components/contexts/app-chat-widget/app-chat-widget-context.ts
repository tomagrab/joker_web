import { ChatWidgetState } from "@/lib/types/chat-widget/chat-widget-types";
import { createContext, Dispatch, SetStateAction } from "react";

type AppChatWidgetContextType = {
  state: ChatWidgetState;
  setState: Dispatch<SetStateAction<ChatWidgetState>>;
};

const AppChatWidgetContext = createContext<AppChatWidgetContextType>({
  state: "open",
  setState: () => {},
});

export default AppChatWidgetContext;
