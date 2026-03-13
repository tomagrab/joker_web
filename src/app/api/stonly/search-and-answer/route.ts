import { StonlyAiApi } from "@/lib/server/api/stonly/ai/stonly-ai-api";
import {
  createAppChatWidgetStonlySearchRequest,
  isAppChatWidgetStonlyConfigured,
} from "@/lib/server/app-chat-widget/app-chat-widget-stonly-server";
import type {
  StonlyAiSearchAndAnswerApiResponse,
  StonlyAiWidgetSearchRequest,
} from "@/lib/types/api/stonly/ai/stonly-ai-types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<StonlyAiWidgetSearchRequest>;

    if (typeof body.query !== "string" || !body.query.trim()) {
      return NextResponse.json<StonlyAiSearchAndAnswerApiResponse>(
        {
          success: false,
          message: "A question is required.",
          data: null,
        },
        { status: 400 },
      );
    }

    if (!isAppChatWidgetStonlyConfigured()) {
      return NextResponse.json<StonlyAiSearchAndAnswerApiResponse>(
        {
          success: false,
          message: "Chat is not configured on the server.",
          data: null,
        },
        { status: 503 },
      );
    }

    const stonlyRequest = createAppChatWidgetStonlySearchRequest({
      query: body.query,
      conversationId:
        typeof body.conversationId === "string" ? body.conversationId : null,
    });

    if (!stonlyRequest) {
      return NextResponse.json<StonlyAiSearchAndAnswerApiResponse>(
        {
          success: false,
          message: "Chat is not configured on the server.",
          data: null,
        },
        { status: 503 },
      );
    }

    const response = await StonlyAiApi.searchAndAnswer(stonlyRequest, {
      signal: request.signal,
    });

    return NextResponse.json<StonlyAiSearchAndAnswerApiResponse>(response, {
      status: response.success ? 200 : 502,
    });
  } catch (error) {
    return NextResponse.json<StonlyAiSearchAndAnswerApiResponse>(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Stonly could not complete the request.",
        data: null,
      },
      { status: 500 },
    );
  }
}
