import { fetchRandomJoke } from "@/lib/server/actions/joke/joke-server-actions";
import { ApiResult } from "@/lib/types/api/common/api-common-types";
import { JokeType } from "@/lib/types/api/joke/joke-types";
import { use, useState } from "react";

type useJokeProps = {
  serverJoke: Promise<ApiResult<JokeType>>;
};

export default function useJoke({ serverJoke }: useJokeProps) {
  const initialJokeRequest = use(serverJoke);

  const initialJoke: ApiResult<JokeType> = initialJokeRequest.success
    ? initialJokeRequest
    : {
        success: false,
        error: { message: "Failed to load joke", status: 500 },
      };

  const [joke, setJoke] = useState(
    initialJoke.success
      ? initialJoke.data
      : { id: "", joke: "Failed to load joke" },
  );

  const fetchNewJoke = async () => {
    try {
      const newJoke = await fetchRandomJoke();
      if (newJoke.success) {
        setJoke(newJoke.data);
      } else {
        console.error("Failed to fetch new joke:", newJoke.error.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching a new joke:", error);
    }
  };

  return { joke, fetchNewJoke };
}
