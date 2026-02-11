import { JokeApi } from "@/lib/server/api/joke/joke-api";

export default async function Home() {
  const randomJoke = async () => {
    return await JokeApi.fetchRandomJoke();
  };

  const joke = await randomJoke();

  return (
    <div className="">
      <main className="">
        <h1 className="text-2xl font-bold mb-4">Random Joke</h1>
        <p className="text-lg">{joke.joke}</p>
      </main>
    </div>
  );
}
