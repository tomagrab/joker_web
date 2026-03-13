"use server";

import { revalidateTag } from "next/cache";

import {
  loadUserPreferences,
  persistUserPreferences,
  USER_PREFERENCES_CACHE_TAG,
} from "@/lib/server/user-preferences/user-preferences-server";
import type { ApiResponse } from "@/lib/types/api/common/api-common-types";
import type { UserPreferences } from "@/lib/types/preferences/user-preferences-types";

export async function fetchUserPreferences(): Promise<
  ApiResponse<UserPreferences>
> {
  const preferences = await loadUserPreferences();

  return {
    success: true,
    message: null,
    data: preferences,
  };
}

export async function updateUserPreferences(
  preferences: UserPreferences,
): Promise<ApiResponse<UserPreferences>> {
  const response = await persistUserPreferences(preferences);

  if (response.success) {
    revalidateTag(USER_PREFERENCES_CACHE_TAG, "max");
  }

  return response;
}
