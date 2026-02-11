/* File for interacting with the Joke API */
const JOKE_API_URL = process.env.JOKER_API_URL ?? "http://localhost:5247/api";

export class JokeApi {
  static async fetchRandomJoke(): Promise<{ id: string; joke: string }> {
    const response = await fetch(`${JOKE_API_URL}/Joke/random`);
    if (!response.ok) {
      throw new Error("Failed to fetch random joke");
    }
    return response.json();
  }
}
