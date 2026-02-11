import { fetchRandomJoke } from "@/lib/server/actions/joke/joke-server-actions";

export default async function Home() {
  const joke = await fetchRandomJoke();

  return (
    <div className="">
      <main className="">
        <h1 className="mb-4 text-2xl font-bold">Random Joke</h1>
        <p className="text-lg">
          {joke.success ? joke.data.joke : "Failed to load joke"}
        </p>
      </main>
    </div>
  );
}
