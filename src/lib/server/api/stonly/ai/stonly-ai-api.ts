import { type ApiResponse } from "@/lib/types/api/common/api-common-types";
import {
  type StonlyAiAnswerApiResponse,
  type StonlyAiAnswerQueryParams,
  type StonlyAiAnswerStatusApiResponse,
  type StonlyAiApiRequestOptions,
  type StonlyAiGuideRecommendationRequest,
  type StonlyAiRecommendGuidesApiResponse,
  type StonlyAiSearchAndAnswerApiResponse,
  type StonlyAiSearchApiResponse,
  type StonlyAiSearchRequest,
} from "@/lib/types/api/stonly/ai/stonly-ai-types";

const JOKER_API_URL = process.env.JOKER_API_URL ?? "http://localhost:5247/api";

export class StonlyAiApi {
  static async search(
    request: StonlyAiSearchRequest,
    options?: StonlyAiApiRequestOptions,
  ): Promise<StonlyAiSearchApiResponse> {
    return this.request<StonlyAiSearchApiResponse>(
      `${JOKER_API_URL}/StonlyAi/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: options?.signal,
      },
    );
  }

  static async getAnswer(
    params: StonlyAiAnswerQueryParams,
    options?: StonlyAiApiRequestOptions,
  ): Promise<StonlyAiAnswerApiResponse> {
    const searchParams = new URLSearchParams({
      questionAnswerId: params.questionAnswerId,
    });

    return this.request<StonlyAiAnswerApiResponse>(
      `${JOKER_API_URL}/StonlyAi/answer?${searchParams.toString()}`,
      {
        signal: options?.signal,
      },
    );
  }

  static async getAnswerStatus(
    params: StonlyAiAnswerQueryParams,
    options?: StonlyAiApiRequestOptions,
  ): Promise<StonlyAiAnswerStatusApiResponse> {
    const searchParams = new URLSearchParams({
      questionAnswerId: params.questionAnswerId,
    });

    return this.request<StonlyAiAnswerStatusApiResponse>(
      `${JOKER_API_URL}/StonlyAi/answer/status?${searchParams.toString()}`,
      {
        signal: options?.signal,
      },
    );
  }

  static async searchAndAnswer(
    request: StonlyAiSearchRequest,
    options?: StonlyAiApiRequestOptions,
  ): Promise<StonlyAiSearchAndAnswerApiResponse> {
    return this.request<StonlyAiSearchAndAnswerApiResponse>(
      `${JOKER_API_URL}/StonlyAi/search-and-answer`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: options?.signal,
      },
    );
  }

  static async recommendGuides(
    request: StonlyAiGuideRecommendationRequest,
    options?: StonlyAiApiRequestOptions,
  ): Promise<StonlyAiRecommendGuidesApiResponse> {
    return this.request<StonlyAiRecommendGuidesApiResponse>(
      `${JOKER_API_URL}/StonlyAi/recommend-guides`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
        signal: options?.signal,
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
      if (error instanceof Error && error.name === "AbortError") {
        return {
          success: false,
          message: "Request was canceled.",
          data: null,
        } as TResponse;
      }

      const message = error instanceof Error ? error.message : "Unknown error";

      return {
        success: false,
        message: `Request error: ${message}`,
        data: null,
      } as TResponse;
    }
  }
}
