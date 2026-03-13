import {
  stonlyAiGetAnswer,
  stonlyAiGetAnswerStatus,
  stonlyAiRecommendedGuides,
  stonlyAiSearch,
  stonlyAiSearchAndAnswer,
} from "@/lib/server/actions/stonly/ai/stonly-ai-server-actions";
import {
  type StonlyAiAnswerQueryParams,
  type StonlyAiGuideRecommendationRequest,
  type StonlyAiSearchRequest,
} from "@/lib/types/api/stonly/ai/stonly-ai-types";
import { useCallback } from "react";

export function useStonlyApi() {
  const search = useCallback((request: StonlyAiSearchRequest) => {
    return stonlyAiSearch(request);
  }, []);

  const getAnswer = useCallback((params: StonlyAiAnswerQueryParams) => {
    return stonlyAiGetAnswer(params);
  }, []);

  const getAnswerStatus = useCallback((params: StonlyAiAnswerQueryParams) => {
    return stonlyAiGetAnswerStatus(params);
  }, []);

  const searchAndAnswer = useCallback((request: StonlyAiSearchRequest) => {
    return stonlyAiSearchAndAnswer(request);
  }, []);

  const recommendGuides = useCallback(
    (request: StonlyAiGuideRecommendationRequest) => {
      return stonlyAiRecommendedGuides(request);
    },
    [],
  );

  return {
    search,
    getAnswer,
    getAnswerStatus,
    searchAndAnswer,
    recommendGuides,
  };
}
