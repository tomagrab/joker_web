import type {
  ChatWidgetPosition,
  ChatWidgetState,
} from "@/lib/types/chat-widget/chat-widget-types";
import type {
  SidebarVariant,
  UserPreferenceSidebarItemId,
  UserPreferences,
  UserPreferencesPatch,
} from "@/lib/types/preferences/user-preferences-types";

export const USER_PREFERENCES_COOKIE_NAME = "user_preferences";
export const USER_PREFERENCES_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type UserPreferenceCookieEntry = {
  name: string;
  value: string;
};

const VALID_SIDEBAR_VARIANTS = ["sidebar", "floating", "inset"] as const;
const VALID_CHAT_WIDGET_STATES = ["closed", "open", "fullscreen"] as const;
const VALID_CHAT_WIDGET_POSITIONS = [
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
] as const;
const VALID_SIDEBAR_ITEM_IDS = [
  "home",
  "tools",
  "settings.app",
  "settings.user",
] as const;

type LegacyPreferenceCookieValues = {
  sidebarOpen?: string;
  sidebarVariant?: string;
  chatWidgetState?: string;
  chatWidgetPosition?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSidebarVariant(value: unknown): value is SidebarVariant {
  return VALID_SIDEBAR_VARIANTS.includes(value as SidebarVariant);
}

function isChatWidgetState(value: unknown): value is ChatWidgetState {
  return VALID_CHAT_WIDGET_STATES.includes(value as ChatWidgetState);
}

function isChatWidgetPosition(value: unknown): value is ChatWidgetPosition {
  return VALID_CHAT_WIDGET_POSITIONS.includes(value as ChatWidgetPosition);
}

function isSidebarItemId(value: unknown): value is UserPreferenceSidebarItemId {
  return VALID_SIDEBAR_ITEM_IDS.includes(value as UserPreferenceSidebarItemId);
}

function normalizePinnedItemIds(value: unknown): UserPreferenceSidebarItemId[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(new Set(value.filter(isSidebarItemId)));
}

export function createDefaultUserPreferences(): UserPreferences {
  return {
    version: 1,
    sidebar: {
      open: true,
      variant: "inset",
      pinnedItemIds: [],
    },
    chatWidget: {
      state: "open",
      position: "bottom-right",
    },
  };
}

export function normalizeUserPreferences(value: unknown): UserPreferences {
  const defaults = createDefaultUserPreferences();

  if (!isRecord(value)) {
    return defaults;
  }

  const sidebar = isRecord(value.sidebar) ? value.sidebar : undefined;
  const chatWidget = isRecord(value.chatWidget) ? value.chatWidget : undefined;

  return {
    version: 1,
    sidebar: {
      open:
        typeof sidebar?.open === "boolean"
          ? sidebar.open
          : defaults.sidebar.open,
      variant: isSidebarVariant(sidebar?.variant)
        ? sidebar.variant
        : defaults.sidebar.variant,
      pinnedItemIds: normalizePinnedItemIds(sidebar?.pinnedItemIds),
    },
    chatWidget: {
      state: isChatWidgetState(chatWidget?.state)
        ? chatWidget.state
        : defaults.chatWidget.state,
      position: isChatWidgetPosition(chatWidget?.position)
        ? chatWidget.position
        : defaults.chatWidget.position,
    },
  };
}

export function mergeUserPreferences(
  base: UserPreferences,
  patch?: UserPreferencesPatch | null,
): UserPreferences {
  if (!patch) {
    return normalizeUserPreferences(base);
  }

  return normalizeUserPreferences({
    ...base,
    ...patch,
    sidebar: {
      ...base.sidebar,
      ...patch.sidebar,
    },
    chatWidget: {
      ...base.chatWidget,
      ...patch.chatWidget,
    },
  });
}

export function createUserPreferencesSnapshot(
  preferences: UserPreferences,
): string {
  return JSON.stringify(normalizeUserPreferences(preferences));
}

export function areUserPreferencesEqual(
  left: UserPreferences,
  right: UserPreferences,
): boolean {
  return (
    createUserPreferencesSnapshot(left) === createUserPreferencesSnapshot(right)
  );
}

export function getUserPreferencesCookieEntries(
  preferences: UserPreferences,
): UserPreferenceCookieEntry[] {
  const normalizedPreferences = normalizeUserPreferences(preferences);

  return [
    {
      name: USER_PREFERENCES_COOKIE_NAME,
      value: serializeUserPreferencesCookie(normalizedPreferences),
    },
    {
      name: "sidebar_state",
      value: String(normalizedPreferences.sidebar.open),
    },
    {
      name: "sidebar_variant",
      value: normalizedPreferences.sidebar.variant,
    },
    {
      name: "chat_widget_state",
      value: normalizedPreferences.chatWidget.state,
    },
    {
      name: "chat_widget_position",
      value: normalizedPreferences.chatWidget.position,
    },
  ];
}

export function serializeUserPreferencesCookie(
  preferences: UserPreferences,
): string {
  return encodeURIComponent(
    JSON.stringify(normalizeUserPreferences(preferences)),
  );
}

export function parseUserPreferencesCookie(
  value: string | undefined,
): UserPreferences | null {
  if (!value) {
    return null;
  }

  try {
    return normalizeUserPreferences(JSON.parse(decodeURIComponent(value)));
  } catch {
    return null;
  }
}

export function applyLegacyPreferenceCookies(
  preferences: UserPreferences,
  legacyCookieValues: LegacyPreferenceCookieValues,
): UserPreferences {
  const sidebarOpen =
    legacyCookieValues.sidebarOpen === "true"
      ? true
      : legacyCookieValues.sidebarOpen === "false"
        ? false
        : undefined;

  return mergeUserPreferences(preferences, {
    sidebar: {
      open: sidebarOpen,
      variant: isSidebarVariant(legacyCookieValues.sidebarVariant)
        ? legacyCookieValues.sidebarVariant
        : undefined,
    },
    chatWidget: {
      state: isChatWidgetState(legacyCookieValues.chatWidgetState)
        ? legacyCookieValues.chatWidgetState
        : undefined,
      position: isChatWidgetPosition(legacyCookieValues.chatWidgetPosition)
        ? legacyCookieValues.chatWidgetPosition
        : undefined,
    },
  });
}
