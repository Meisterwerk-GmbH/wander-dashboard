import { useEffect, useState } from "react";
import repoQrImage from "./assets/repoqr.png";
import AcceleritCard from "./components/card/Accelerit";
import DogToggle from "./components/DogToggle";
import RentshopCard from "./components/card/Rentshop";
import RiverTemperatureCard from "./components/card/RiverTemparature";

const DASHBOARD_REPO_URL = "https://github.com/Meisterwerk-GmbH/wander-dashboard";

const timeFormat = new Intl.DateTimeFormat("de-CH", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Zurich",
});

const clockFormat = new Intl.DateTimeFormat("de-CH", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Europe/Zurich",
});

export default function App() {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  return (
    <div className="min-h-screen w-full px-8 py-10 pb-28 lg:px-16">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-200">Office Dashboard</p>
          <h1 className="text-3xl font-semibold text-balance text-slate-50 lg:text-5xl">
            Wander Workspace
          </h1>
          <p className="text-sm text-slate-200">
            Gemeinsamer Standort · Bern · Fokus auf Klarheit, Energie und Flow
          </p>
        </div>
        <div className="glass shimmer-border rounded-2xl px-6 py-4 text-right">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-200">Jetzt</p>
          <p className="text-2xl font-semibold text-slate-50">
            {clockFormat.format(clock)}
          </p>
          <p className="text-sm text-slate-200">{timeFormat.format(clock)}</p>
        </div>
      </header>

      <main className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr_1.1fr]">
        <AcceleritCard />
        <RiverTemperatureCard />
        <RentshopCard />
      </main>

      <DogToggle />

      <footer className="fixed right-0 bottom-4 left-0 z-20 px-4 text-xs text-slate-400 sm:px-8 lg:px-16">
        <div className="flex items-end justify-between gap-4">
        <a
          href={DASHBOARD_REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="glass flex items-center gap-3 rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/10"
          aria-label="GitHub repository"
        >
          <div className="h-14 w-14 overflow-hidden rounded-md bg-white p-0.5">
            <img
              src={repoQrImage}
              alt="QR code for GitHub repository"
              className="h-full w-full scale-125 object-cover"
              loading="lazy"
            />
          </div>
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
            <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.91c.57.1.78-.25.78-.55v-2.13c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.69 1.25 3.35.96.1-.74.4-1.25.74-1.53-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
          </svg>
          <span className="uppercase tracking-[0.2em]">GitHub</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-white/20" />
          <p className="uppercase tracking-[0.35em]">Shared Office</p>
        </div>
        </div>
      </footer>
    </div>
  );
}
