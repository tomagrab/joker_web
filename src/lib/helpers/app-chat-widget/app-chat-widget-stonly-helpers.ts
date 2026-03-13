import type { StonlyAiSearchLanguage } from "@/lib/types/api/stonly/ai/stonly-ai-types";

const DEFAULT_STONLY_LANGUAGE: StonlyAiSearchLanguage = "en";

function getOptionalEnvValue(value: string | undefined) {
  return value?.trim() ? value : null;
}

const configuredAgentId = Number.parseInt(
  process.env.NEXT_PUBLIC_STONLY_AI_AGENT_ID ?? "",
  10,
);

export const appChatWidgetStonlyConfig = {
  aiAgentId:
    Number.isFinite(configuredAgentId) && configuredAgentId > 0
      ? configuredAgentId
      : null,
  language:
    (process.env.NEXT_PUBLIC_STONLY_AI_LANGUAGE as
      | StonlyAiSearchLanguage
      | undefined) ?? DEFAULT_STONLY_LANGUAGE,
  kbBaseUrl: getOptionalEnvValue(process.env.NEXT_PUBLIC_STONLY_AI_KB_BASE_URL),
  userEmail: getOptionalEnvValue(process.env.NEXT_PUBLIC_STONLY_AI_USER_EMAIL),
  webhookUrl: getOptionalEnvValue(
    process.env.NEXT_PUBLIC_STONLY_AI_WEBHOOK_URL,
  ),
};

export function createAppChatWidgetMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function focusAppChatWidgetInput(input: HTMLTextAreaElement | null) {
  requestAnimationFrame(() => {
    if (!input) {
      return;
    }

    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });
}
