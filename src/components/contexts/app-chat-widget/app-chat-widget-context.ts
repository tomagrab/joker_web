import { ChatWidgetState } from "@/lib/types/chat-widget/chat-widget-types";
import { createContext, Dispatch, SetStateAction } from "react";

type AppChatWidgetContextType = {
  state: ChatWidgetState;
  setAndPersistState: Dispatch<SetStateAction<ChatWidgetState>>;
};

const AppChatWidgetContext = createContext<AppChatWidgetContextType>({
  state: null,
  setAndPersistState: () => {},
});

export default AppChatWidgetContext;
