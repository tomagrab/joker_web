import type { ApiResponse } from "@/lib/types/api/common/api-common-types";
import type { UserPreferences } from "@/lib/types/preferences/user-preferences-types";

const JOKER_API_URL = process.env.JOKER_API_URL ?? "http://localhost:5247/api";

export class UserPreferencesApi {
  static async fetchCurrentUserPreferences(): Promise<
    ApiResponse<UserPreferences>
  > {
    return this.request<ApiResponse<UserPreferences>>(
      `${JOKER_API_URL}/UserPreferences`,
    );
  }

  static async updateCurrentUserPreferences(
    preferences: UserPreferences,
  ): Promise<ApiResponse<UserPreferences>> {
    return this.request<ApiResponse<UserPreferences>>(
      `${JOKER_API_URL}/UserPreferences`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      },
    );
  }

  private static async request<TResponse extends ApiResponse<unknown>>(
    url: string,
    init?: RequestInit,
  ): Promise<TResponse> {
    try {
      const response = await fetch(url, init);

      if (!response.ok) {
        return {
          success: false,
          message: `Request failed: ${response.status} ${response.statusText}`,
          data: null,
        } as TResponse;
      }

      return (await response.json()) as TResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";

      return {
        success: false,
        message: `Request error: ${message}`,
        data: null,
      } as TResponse;
    }
  }
}
