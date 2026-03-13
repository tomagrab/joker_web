import { type ApiResponse } from "@/lib/types/api/common/api-common-types";
import { JokeType } from "@/lib/types/api/joke/joke-types";

const JOKER_API_URL = process.env.JOKER_API_URL ?? "http://localhost:5247/api";

export class JokeApi {
  static async fetchRandomJoke(): Promise<ApiResponse<JokeType>> {
    try {
      const response = await fetch(`${JOKER_API_URL}/Joke/random`);

      if (!response.ok) {
        return {
          success: false,
          message: `Failed to fetch joke: ${response.status} ${response.statusText}`,
          data: null,
        };
      }

      const data: JokeType = await response.json();

      return { success: true, message: null, data };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        message: `Error fetching joke: ${message}`,
        data: null,
      };
    }
  }
}
