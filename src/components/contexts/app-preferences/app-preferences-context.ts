import { createContext } from "react";

import type {
  ChatWidgetPosition,
  ChatWidgetState,
} from "@/lib/types/chat-widget/chat-widget-types";
import type {
  SidebarVariant,
  UserPreferenceSidebarItemId,
  UserPreferences,
} from "@/lib/types/preferences/user-preferences-types";
import { createDefaultUserPreferences } from "@/lib/user-preferences/user-preferences";

type AppPreferencesContextType = {
  preferences: UserPreferences;
  isPersisting: boolean;
  setChatWidgetState: (state: ChatWidgetState) => void;
  setChatWidgetPosition: (position: ChatWidgetPosition) => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarVariant: (variant: SidebarVariant) => void;
  setPinnedSidebarItemIds: (itemIds: UserPreferenceSidebarItemId[]) => void;
};

const AppPreferencesContext = createContext<AppPreferencesContextType>({
  preferences: createDefaultUserPreferences(),
  isPersisting: false,
  setChatWidgetState: () => {},
  setChatWidgetPosition: () => {},
  setSidebarOpen: () => {},
  setSidebarVariant: () => {},
  setPinnedSidebarItemIds: () => {},
});

export default AppPreferencesContext;
