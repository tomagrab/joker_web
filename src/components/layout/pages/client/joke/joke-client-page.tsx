"use client";

import { AppChatWidgetPendingMessage } from "@/components/modules/app-chat-widget/app-chat-widget-pending-message";
import { Button } from "@/components/ui/button";
import useJoke from "@/hooks/joke/use-joke";
import { ApiResponse } from "@/lib/types/api/common/api-common-types";
import { JokeType } from "@/lib/types/api/joke/joke-types";
import { RefreshCcwIcon, TriangleAlertIcon } from "lucide-react";

type JokeClientPageProps = {
  serverJoke: Promise<ApiResponse<JokeType>>;
};

export default function JokeClientPage({ serverJoke }: JokeClientPageProps) {
  const { joke, fetchNewJoke, loading, error } = useJoke({ serverJoke });
  return (
    <div className="flex flex-col items-center gap-4">
      <span>
        {loading ? (
          <AppChatWidgetPendingMessage initialMessage="Fetching a hilarious joke for you..." />
        ) : error ? (
          <span className="text-red-500">
            <TriangleAlertIcon className="mr-1 inline-block" />
            {error}
          </span>
        ) : joke ? (
          <span>{joke.joke}</span>
        ) : null}
      </span>
      <span>
        <Button disabled={loading} onClick={fetchNewJoke}>
          <RefreshCcwIcon className="inline-block" />
        </Button>
      </span>
    </div>
  );
}
