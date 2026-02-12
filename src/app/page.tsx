import JokeClientPage from "@/components/layout/pages/client/joke/joke-client-page";
import { fetchRandomJoke } from "@/lib/server/actions/joke/joke-server-actions";

export default async function Home() {
  const serverJoke = fetchRandomJoke();

  return (
    <div className="flex flex-col items-center gap-4">
      <header>
        <h1 className="text-2xl font-bold">Jokes for Davey Wavey 🌊</h1>
      </header>
      <JokeClientPage serverJoke={serverJoke} />
    </div>
  );
}
