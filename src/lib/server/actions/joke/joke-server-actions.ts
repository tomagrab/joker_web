import type { ApiResult } from "@/lib/types/api/common/api-common-types";
import { JokeApi } from "@/lib/server/api/joke/joke-api";
import { type JokeType } from "@/lib/types/api/joke/joke-types";

export async function fetchRandomJoke(): Promise<ApiResult<JokeType>> {
  "use server";

  return await JokeApi.fetchRandomJoke();
}
