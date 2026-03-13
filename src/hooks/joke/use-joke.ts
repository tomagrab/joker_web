import { fetchRandomJoke } from "@/lib/server/actions/joke/joke-server-actions";
import { ApiResponse } from "@/lib/types/api/common/api-common-types";
import { JokeType } from "@/lib/types/api/joke/joke-types";
import { use, useState } from "react";

type useJokeProps = {
  serverJoke: Promise<ApiResponse<JokeType>>;
};

export default function useJoke({ serverJoke }: useJokeProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialJokeRequest = use(serverJoke);

  const initialJoke: ApiResponse<JokeType> = initialJokeRequest.success
    ? initialJokeRequest
    : {
        success: false,
        message: "Failed to load joke",
        data: null,
      };

  const [joke, setJoke] = useState(
    initialJoke.success
      ? initialJoke.data
      : { id: "", joke: "Failed to load joke" },
  );

  const fetchNewJoke = async () => {
    setLoading(true);
    setError(null);
    try {
      const newJoke = await fetchRandomJoke();
      if (newJoke.success && newJoke.data) {
        setJoke(newJoke.data);
      } else {
        console.error("Failed to fetch new joke:", newJoke.message);
        setError(newJoke.message);
      }
    } catch (error) {
      console.error("An error occurred while fetching a new joke:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { joke, fetchNewJoke, loading, error };
}
