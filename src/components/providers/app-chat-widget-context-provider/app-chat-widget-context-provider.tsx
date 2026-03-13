"use client";

import AppChatWidgetContext from "@/components/contexts/app-chat-widget/app-chat-widget-context";
import AppPreferencesContext from "@/components/contexts/app-preferences/app-preferences-context";
import { ChatWidgetState } from "@/lib/types/chat-widget/chat-widget-types";
import { ReactNode, useContext } from "react";

type AppChatWidgetProviderProps = {
  children: ReactNode;
};

export function AppChatWidgetProvider({
  children,
}: AppChatWidgetProviderProps) {
  const { preferences, setChatWidgetState } = useContext(AppPreferencesContext);
  const state = preferences.chatWidget.state;

  const setAndPersistState = (newState: ChatWidgetState) => {
    setChatWidgetState(newState);
  };

  return (
    <AppChatWidgetContext.Provider value={{ state, setAndPersistState }}>
      {children}
    </AppChatWidgetContext.Provider>
  );
}
