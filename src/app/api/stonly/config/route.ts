import { isAppChatWidgetStonlyConfigured } from "@/lib/server/app-chat-widget/app-chat-widget-stonly-server";
import type { StonlyAiWidgetConfigResponse } from "@/lib/types/api/stonly/ai/stonly-ai-types";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json<StonlyAiWidgetConfigResponse>(
    {
      isConfigured: isAppChatWidgetStonlyConfigured(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
