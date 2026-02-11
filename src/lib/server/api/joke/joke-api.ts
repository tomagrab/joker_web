import {
  type ApiResult,
  apiSuccess,
  apiFailure,
} from "@/lib/types/api/common/api-common-types";
import { JokeType } from "@/lib/types/api/joke/joke-types";

const JOKER_API_URL = process.env.JOKER_API_URL ?? "http://localhost:5247/api";

export class JokeApi {
  static async fetchRandomJoke(): Promise<ApiResult<JokeType>> {
    try {
      const response = await fetch(`${JOKER_API_URL}/Joke/random`);

      if (!response.ok) {
        return apiFailure("Failed to fetch random joke", response.status);
      }

      const data: JokeType = await response.json();

      return apiSuccess(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return apiFailure(message);
    }
  }
}
