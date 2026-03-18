import "server-only";

import { cookies } from "next/headers";

import { UserPreferencesApi } from "@/lib/server/api/user-preferences/user-preferences-api";
import type { ApiResponse } from "@/lib/types/api/common/api-common-types";
import type { UserPreferences } from "@/lib/types/preferences/user-preferences-types";
import {
  applyLegacyPreferenceCookies,
  createDefaultUserPreferences,
  getUserPreferencesCookieEntries,
  mergeUserPreferences,
  normalizeUserPreferences,
  parseUserPreferencesCookie,
  USER_PREFERENCES_COOKIE_MAX_AGE,
  USER_PREFERENCES_COOKIE_NAME,
} from "@/lib/user-preferences/user-preferences";

type CookieStoreReader = {
  get(name: string): { value: string } | undefined;
};

type CookieStoreWriter = CookieStoreReader & {
  set(
    name: string,
    value: string,
    options?: {
      path?: string;
      maxAge?: number;
      sameSite?: "lax" | "strict" | "none";
    },
  ): void;
};

const LEGACY_COOKIE_OPTIONS = {
  path: "/",
  maxAge: USER_PREFERENCES_COOKIE_MAX_AGE,
  sameSite: "lax" as const,
};

const USER_PREFERENCES_API_SYNC_ENABLED =
  process.env.JOKER_USER_PREFERENCES_API_SYNC === "true";

export const USER_PREFERENCES_CACHE_TAG = "user-preferences";

export function readUserPreferencesFromCookieStore(
  cookieStore: CookieStoreReader,
): UserPreferences {
  const cookiePreferences =
    parseUserPreferencesCookie(
      cookieStore.get(USER_PREFERENCES_COOKIE_NAME)?.value,
    ) ?? createDefaultUserPreferences();

  return applyLegacyPreferenceCookies(cookiePreferences, {
    sidebarOpen: cookieStore.get("sidebar_state")?.value,
    sidebarVariant: cookieStore.get("sidebar_variant")?.value,
    chatWidgetState: cookieStore.get("chat_widget_state")?.value,
    chatWidgetPosition: cookieStore.get("chat_widget_position")?.value,
  });
}

export function writeUserPreferencesToCookieStore(
  cookieStore: CookieStoreWriter,
  preferences: UserPreferences,
) {
  for (const cookie of getUserPreferencesCookieEntries(preferences)) {
    cookieStore.set(cookie.name, cookie.value, LEGACY_COOKIE_OPTIONS);
  }
}

export async function loadUserPreferences(): Promise<UserPreferences> {
  const cookieStore = await cookies();
  const cookiePreferences = readUserPreferencesFromCookieStore(cookieStore);

  if (!USER_PREFERENCES_API_SYNC_ENABLED) {
    return cookiePreferences;
  }

  const apiResponse = await UserPreferencesApi.fetchCurrentUserPreferences();

  if (!apiResponse.success || !apiResponse.data) {
    return cookiePreferences;
  }

  return mergeUserPreferences(cookiePreferences, apiResponse.data);
}

export async function persistUserPreferences(
  preferences: UserPreferences,
): Promise<ApiResponse<UserPreferences>> {
  const normalizedPreferences = normalizeUserPreferences(preferences);
  const cookieStore = await cookies();

  writeUserPreferencesToCookieStore(cookieStore, normalizedPreferences);

  if (!USER_PREFERENCES_API_SYNC_ENABLED) {
    return {
      success: true,
      message: null,
      data: normalizedPreferences,
    };
  }

  const apiResponse = await UserPreferencesApi.updateCurrentUserPreferences(
    normalizedPreferences,
  );

  if (!apiResponse.success || !apiResponse.data) {
    return {
      success: false,
      message: apiResponse.message,
      data: normalizedPreferences,
    };
  }

  const mergedPreferences = mergeUserPreferences(
    normalizedPreferences,
    apiResponse.data,
  );

  writeUserPreferencesToCookieStore(cookieStore, mergedPreferences);

  return {
    success: true,
    message: apiResponse.message,
    data: mergedPreferences,
  };
}
