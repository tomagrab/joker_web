import { ApiResponse } from "@/lib/types/api/common/api-common-types";

export type StonlyAiAnswerResultStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

export type StonlyAiSearchLanguage =
  | "en"
  | "en-US"
  | "en-GB"
  | "fr"
  | "fr-BE"
  | "fr-CA"
  | "de"
  | "nl"
  | "es"
  | "it"
  | "pt"
  | "pt-BR"
  | "pl"
  | "sv"
  | "no"
  | "nb"
  | "nn"
  | "fi"
  | "hi"
  | "bn";

export type StonlyAiGuideLaunchMode =
  | "redirected"
  | "embedded"
  | "customMessage";

export type StonlyAiRecommendedGuideType = "GUIDE" | "ARTICLE" | "CHECKLIST";

export type StonlyAiRecommendationSearchType = "keyword" | "semantic";

export type StonlyAiSearchRequest = {
  query: string;
  language: StonlyAiSearchLanguage;
  aiAgentId: number;
  conversationId?: string | null;
  kbBaseUrl?: string | null;
  userEmail?: string | null;
  webhookUrl?: string | null;
};

export type StonlyAiSearchResponse = {
  questionAnswerId: string;
};

export type StonlyAiAnswerQueryParams = {
  questionAnswerId: string;
};

export type StonlyAiQueryMetadata = {
  language?: string | null;
  aiAgentId?: number | null;
  userEmail?: string | null;
  webhookUrl?: string | null;
  kbBaseUrl?: string | null;
};

export type StonlyAiAnswerMetadataLink = {
  url: string;
};

export type StonlyAiStandardAnswerMetadata = {
  links: StonlyAiAnswerMetadataLink[];
  language: string;
  isFallback: boolean;
};

export type StonlyAiClarificationAnswerMetadata = {
  clarificationOptions: string[];
  clarificationCustomerExplanation?: string | null;
  queryIsAmbiguous?: boolean | null;
  originalQuestion?: string | null;
  phrase?: string | null;
  gptModel?: string | null;
};

export type StonlyAiGuidedAnswerMetadata = {
  intentRecognised: number;
  guideId: string;
  stepId: string;
  guideLaunchMode: StonlyAiGuideLaunchMode;
  language: string;
  originalQuestion: string;
  phrase: string;
  detectedIntent: string;
  answerText: string;
  linkText: string;
};

export type StonlyAiAnswerMetadata =
  | StonlyAiStandardAnswerMetadata
  | StonlyAiClarificationAnswerMetadata
  | StonlyAiGuidedAnswerMetadata;

export type StonlyAiAnswerResponse = {
  questionAnswerId?: string | null;
  conversationId: string;
  query: string;
  queryMetadata: StonlyAiQueryMetadata;
  answer?: string | null;
  answerMetadata?: StonlyAiAnswerMetadata | null;
  status: StonlyAiAnswerResultStatus;
};

export type StonlyAiRaisedIssue = {
  issue: string;
  resolved: boolean;
  resolutionSummary?: string | null;
};

export type StonlyAiGuideRecommendationInput = {
  raisedIssues: StonlyAiRaisedIssue[];
  priorUserActions: string[];
  errorMessages: string[];
  technicalDetails: string[];
};

export type StonlyAiGuideRecommendationRequest = {
  issues: StonlyAiGuideRecommendationInput;
  kbId: number;
  tagFilter: string[];
  includeDebug: boolean;
};

export type StonlyAiRecommendedGuide = {
  guideId: string;
  guideType: StonlyAiRecommendedGuideType;
  stepId: number;
  stepTitle: string;
  title: string;
  type: StonlyAiRecommendationSearchType;
  content?: string | null;
  score: number;
};

export type StonlyAiGuideRecommendationDebug = {
  queryExpansionTime: number;
  searchTime: number;
  issueCount: number;
};

export type StonlyAiGuideRecommendationResultItem = {
  issue: string;
  guides: StonlyAiRecommendedGuide[];
  guidesForGeneration: StonlyAiRecommendedGuide[];
  verdict: boolean;
  explanation: string;
  generationVerdict: boolean;
  generationExplanation: string;
};

export type StonlyAiGuideRecommendationResult = {
  results: StonlyAiGuideRecommendationResultItem[];
  debug?: StonlyAiGuideRecommendationDebug | null;
};

export type StonlyAiApiRequestOptions = {
  signal?: AbortSignal;
};

export type StonlyAiSearchApiResponse = ApiResponse<StonlyAiSearchResponse>;

export type StonlyAiAnswerApiResponse = ApiResponse<StonlyAiAnswerResponse>;

export type StonlyAiAnswerStatusApiResponse =
  ApiResponse<StonlyAiAnswerResultStatus | null>;

export type StonlyAiSearchAndAnswerApiResponse =
  ApiResponse<StonlyAiAnswerResponse>;

export type StonlyAiRecommendGuidesApiResponse =
  ApiResponse<StonlyAiGuideRecommendationResult>;
