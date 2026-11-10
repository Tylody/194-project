import CaliforniaMap from "./components/map/CaliforniaMap";
import { getPoints } from "./lib/data/points";

export default async function Home() {
  const points = await getPoints();
  return (
    <main className="w-full p-6">
      <h1 className="mb-6 text-2xl font-semibold">California Funding</h1>
      <h2 className="mb-6 text-xl font-semibold">
        Data Centers vs. Public School Districts & Libraries
      </h2>
      <CaliforniaMap points={points} />
    </main>
  );
}
