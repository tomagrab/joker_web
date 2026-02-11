"use client";

import { Button } from "@/components/ui/button";
import useJoke from "@/hooks/joke/use-joke";
import { ApiResult } from "@/lib/types/api/common/api-common-types";
import { JokeType } from "@/lib/types/api/joke/joke-types";

type JokeClientPageProps = {
  serverJoke: Promise<ApiResult<JokeType>>;
};

export default function JokeClientPage({ serverJoke }: JokeClientPageProps) {
  const { joke, fetchNewJoke } = useJoke({ serverJoke });
  return (
    <div className="flex flex-col items-center gap-4">
      <span>
        <p>{joke.joke}</p>
      </span>
      <span>
        <Button onClick={fetchNewJoke}>Fetch New Joke</Button>
      </span>
    </div>
  );
}
