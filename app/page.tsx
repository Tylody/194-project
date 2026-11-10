import CaliforniaMap from "./components/map/CaliforniaMap";
import { getPoints } from "./lib/data/points";

export default async function Home() {
  const points = await getPoints();
  return (
    <main id="main-content" className="mx-auto w-full max-w-[99rem] px-4 pb-16 pt-[calc(3rem+2rem)] md:px-8">
      <p className="type-label-01 text-[var(--cds-text-secondary)]">California funding</p>
      <h1 className="type-heading-05 mt-2 mb-8">
        Data centers vs. public school districts &amp; libraries
      </h1>
      <CaliforniaMap points={points} />
    </main>
  );
}
