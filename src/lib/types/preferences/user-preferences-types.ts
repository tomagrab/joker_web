import type {
  ChatWidgetPosition,
  ChatWidgetState,
} from "@/lib/types/chat-widget/chat-widget-types";

export type SidebarVariant = "sidebar" | "floating" | "inset";

export type UserPreferenceSidebarItemId =
  | "home"
  | "tools"
  | "settings.app"
  | "settings.user";

export type UserPreferences = {
  version: 1;
  sidebar: {
    open: boolean;
    variant: SidebarVariant;
    pinnedItemIds: UserPreferenceSidebarItemId[];
  };
  chatWidget: {
    state: ChatWidgetState;
    position: ChatWidgetPosition;
  };
};

export type UserPreferencesPatch = {
  sidebar?: Partial<UserPreferences["sidebar"]>;
  chatWidget?: Partial<UserPreferences["chatWidget"]>;
};
