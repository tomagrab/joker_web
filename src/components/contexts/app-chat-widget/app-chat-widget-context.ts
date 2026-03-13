import { ChatWidgetState } from "@/lib/types/chat-widget/chat-widget-types";
import { createContext } from "react";

type AppChatWidgetContextType = {
  state: ChatWidgetState;
  setAndPersistState: (state: ChatWidgetState) => void;
};

const AppChatWidgetContext = createContext<AppChatWidgetContextType>({
  state: "open",
  setAndPersistState: () => {},
});

export default AppChatWidgetContext;
