import JokeClientPage from "@/components/layout/pages/client/joke/joke-client-page";
import { fetchRandomJoke } from "@/lib/server/actions/joke/joke-server-actions";

export default async function Home() {
  const serverJoke = fetchRandomJoke();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <header className="">
        <h2 className="text-2xl font-bold">Joker 🤡</h2>
      </header>
      <JokeClientPage serverJoke={serverJoke} />
    </div>
  );
}
