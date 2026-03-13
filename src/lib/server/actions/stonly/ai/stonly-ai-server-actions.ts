"use server";

import { StonlyAiApi } from "@/lib/server/api/stonly/ai/stonly-ai-api";
import {
  type StonlyAiAnswerApiResponse,
  type StonlyAiAnswerQueryParams,
  type StonlyAiSearchApiResponse,
  type StonlyAiSearchRequest,
  StonlyAiAnswerStatusApiResponse,
  StonlyAiGuideRecommendationRequest,
  StonlyAiRecommendGuidesApiResponse,
  StonlyAiSearchAndAnswerApiResponse,
} from "@/lib/types/api/stonly/ai/stonly-ai-types";

export async function stonlyAiSearch(
  request: StonlyAiSearchRequest,
): Promise<StonlyAiSearchApiResponse> {
  return StonlyAiApi.search(request);
}

export async function stonlyAiGetAnswer(
  params: StonlyAiAnswerQueryParams,
): Promise<StonlyAiAnswerApiResponse> {
  return StonlyAiApi.getAnswer(params);
}

export async function stonlyAiGetAnswerStatus(
  params: StonlyAiAnswerQueryParams,
): Promise<StonlyAiAnswerStatusApiResponse> {
  return StonlyAiApi.getAnswerStatus(params);
}

export async function stonlyAiSearchAndAnswer(
  request: StonlyAiSearchRequest,
): Promise<StonlyAiSearchAndAnswerApiResponse> {
  return StonlyAiApi.searchAndAnswer(request);
}

export async function stonlyAiRecommendedGuides(
  request: StonlyAiGuideRecommendationRequest,
): Promise<StonlyAiRecommendGuidesApiResponse> {
  return StonlyAiApi.recommendGuides(request);
}
