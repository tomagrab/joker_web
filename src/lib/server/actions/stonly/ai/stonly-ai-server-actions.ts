"use server";

import { StonlyAiApi } from "@/lib/server/api/stonly/ai/stonly-ai-api";
import {
  type StonlyAiAnswerApiResponse,
  type StonlyAiAnswerQueryParams,
  type StonlyAiSearchApiResponse,
  type StonlyAiSearchRequest,
  StonlyAiAnswerStatusApiResponse,
  StonlyAiApiRequestOptions,
  StonlyAiGuideRecommendationRequest,
  StonlyAiRecommendGuidesApiResponse,
  StonlyAiSearchAndAnswerApiResponse,
} from "@/lib/types/api/stonly/ai/stonly-ai-types";

export async function stonlyAiSearch(
  request: StonlyAiSearchRequest,
  options?: StonlyAiApiRequestOptions,
): Promise<StonlyAiSearchApiResponse> {
  return await StonlyAiApi.search(request, options);
}

export async function stonlyAiGetAnswer(
  params: StonlyAiAnswerQueryParams,
  options?: StonlyAiApiRequestOptions,
): Promise<StonlyAiAnswerApiResponse> {
  return await StonlyAiApi.getAnswer(params, options);
}

export async function stonlyAiGetAnswerStatus(
  params: StonlyAiAnswerQueryParams,
  options?: StonlyAiApiRequestOptions,
): Promise<StonlyAiAnswerStatusApiResponse> {
  return await StonlyAiApi.getAnswerStatus(params, options);
}

export async function stonlyAiSearchAndAnswer(
  request: StonlyAiSearchRequest,
  options?: StonlyAiApiRequestOptions,
): Promise<StonlyAiSearchAndAnswerApiResponse> {
  return await StonlyAiApi.searchAndAnswer(request, options);
}

export async function stonlyAiRecommnededGuides(
  request: StonlyAiGuideRecommendationRequest,
  options?: StonlyAiApiRequestOptions,
): Promise<StonlyAiRecommendGuidesApiResponse> {
  return await StonlyAiApi.recommendGuides(request, options);
}
