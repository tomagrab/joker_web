"use client";

import { ChatWidgetState } from "@/lib/types/chat-widget/chat-widget-types";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import AppChatWidgetContext from "../../contexts/app-chat-widget/app-chat-widget-context";

type AppChatWidgetProviderProps = {
  initialState?: ChatWidgetState;
  children: ReactNode;
};

export function AppChatWidgetProvider({
  initialState = "open",
  children,
}: AppChatWidgetProviderProps) {
  const [state, setState] = useState<ChatWidgetState>(initialState);

  const setAndPersistState: Dispatch<SetStateAction<ChatWidgetState>> = (
    newState,
  ) => {
    setState(newState);
    document.cookie = `chat_widget_state=${newState}; path=/; max-age=${60 * 60 * 24 * 30}`;
  };

  return (
    <AppChatWidgetContext.Provider value={{ state, setAndPersistState }}>
      {children}
    </AppChatWidgetContext.Provider>
  );
}
