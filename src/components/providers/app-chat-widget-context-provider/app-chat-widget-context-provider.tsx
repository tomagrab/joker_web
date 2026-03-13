"use client";

import AppChatWidgetContext from "@/components/contexts/app-chat-widget/app-chat-widget-context";
import { ChatWidgetState } from "@/lib/types/chat-widget/chat-widget-types";
import { ReactNode, useState } from "react";

type AppChatWidgetProviderProps = {
  initialState?: ChatWidgetState;
  children: ReactNode;
};

export function AppChatWidgetProvider({
  initialState = "open",
  children,
}: AppChatWidgetProviderProps) {
  const [state, setState] = useState<ChatWidgetState>(initialState);

  const setAndPersistState = (newState: ChatWidgetState) => {
    setState(newState);
    document.cookie = `chat_widget_state=${newState}; path=/; max-age=${60 * 60 * 24 * 30}`;
  };

  return (
    <AppChatWidgetContext.Provider value={{ state, setAndPersistState }}>
      {children}
    </AppChatWidgetContext.Provider>
  );
}
