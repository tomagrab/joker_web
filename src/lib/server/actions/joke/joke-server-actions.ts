"use server";

import { JokeApi } from "@/lib/server/api/joke/joke-api";
import type { ApiResponse } from "@/lib/types/api/common/api-common-types";
import { type JokeType } from "@/lib/types/api/joke/joke-types";

export async function fetchRandomJoke(): Promise<ApiResponse<JokeType>> {
  return await JokeApi.fetchRandomJoke();
}
