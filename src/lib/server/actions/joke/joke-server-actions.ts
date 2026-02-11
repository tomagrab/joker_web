"use server";

import { JokeApi } from "@/lib/server/api/joke/joke-api";
import type { ApiResult } from "@/lib/types/api/common/api-common-types";
import { type JokeType } from "@/lib/types/api/joke/joke-types";

export async function fetchRandomJoke(): Promise<ApiResult<JokeType>> {
  return await JokeApi.fetchRandomJoke();
}
