import type {
  StonlyAiSearchLanguage,
  StonlyAiSearchRequest,
  StonlyAiWidgetSearchRequest,
} from "@/lib/types/api/stonly/ai/stonly-ai-types";

const DEFAULT_STONLY_LANGUAGE: StonlyAiSearchLanguage = "en";

function getOptionalEnvValue(value: string | undefined) {
  return value?.trim() ? value : null;
}

function getPreferredEnvValue(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];

    if (value?.trim()) {
      return value;
    }
  }

  return undefined;
}

export function getAppChatWidgetStonlyConfig() {
  const configuredAgentId = Number.parseInt(
    getPreferredEnvValue(
      "STONLY_AI_AGENT_ID",
      "NEXT_PUBLIC_STONLY_AI_AGENT_ID",
    ) ?? "",
    10,
  );

  return {
    aiAgentId:
      Number.isFinite(configuredAgentId) && configuredAgentId > 0
        ? configuredAgentId
        : null,
    language:
      (getPreferredEnvValue(
        "STONLY_AI_LANGUAGE",
        "NEXT_PUBLIC_STONLY_AI_LANGUAGE",
      ) as StonlyAiSearchLanguage | undefined) ?? DEFAULT_STONLY_LANGUAGE,
    kbBaseUrl: getOptionalEnvValue(
      getPreferredEnvValue(
        "STONLY_AI_KB_BASE_URL",
        "NEXT_PUBLIC_STONLY_AI_KB_BASE_URL",
      ),
    ),
    userEmail: getOptionalEnvValue(
      getPreferredEnvValue(
        "STONLY_AI_USER_EMAIL",
        "NEXT_PUBLIC_STONLY_AI_USER_EMAIL",
      ),
    ),
    webhookUrl: getOptionalEnvValue(
      getPreferredEnvValue(
        "STONLY_AI_WEBHOOK_URL",
        "NEXT_PUBLIC_STONLY_AI_WEBHOOK_URL",
      ),
    ),
  };
}

export function isAppChatWidgetStonlyConfigured() {
  return getAppChatWidgetStonlyConfig().aiAgentId !== null;
}

export function createAppChatWidgetStonlySearchRequest(
  request: StonlyAiWidgetSearchRequest,
): StonlyAiSearchRequest | null {
  const trimmedQuery = request.query.trim();
  const config = getAppChatWidgetStonlyConfig();

  if (!trimmedQuery || config.aiAgentId === null) {
    return null;
  }

  return {
    query: trimmedQuery,
    aiAgentId: config.aiAgentId,
    language: config.language,
    conversationId: request.conversationId ?? null,
    kbBaseUrl: config.kbBaseUrl,
    userEmail: config.userEmail,
    webhookUrl: config.webhookUrl,
  };
}
