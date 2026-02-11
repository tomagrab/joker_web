import { fetchRandomJoke } from "@/lib/server/actions/joke/joke-server-actions";

export default async function Home() {
  const joke = await fetchRandomJoke();

  return (
    <div className="">
      <main className="">
        <h1 className="text-2xl font-bold mb-4">Random Joke</h1>
        <p className="text-lg">{joke.joke}</p>
      </main>
    </div>
  );
}
