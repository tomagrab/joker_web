import { JokeApi } from "../../api/joke/joke-api";

export async function fetchRandomJoke() {
  "use server";

  const randomJokeResponse = await JokeApi.fetchRandomJoke();

  return randomJokeResponse;
}
