import { useEffect, useMemo, useState } from "react";

type AarePayload = Record<string, unknown>;

type AareData = {
  temperature?: number;
  location?: string;
  timestamp?: Date;
};

const AARE_ENDPOINT =
  "https://aareguru.existenz.ch/v2018/today?app=office-dashboard&version=1.0.1&city=bern";

const ACCELERIT_LOGO =
  "https://static.wixstatic.com/media/3582a0_4c1005955a7e45a1a127f4655356a71e~mv2.png/v1/fill/w_980,h_147,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/accelerit-logo-1.png";
const RENTSHOP_LOGO =
  "https://www.rentshop.ch/_next/static/media/logo-white.28480f1c.svg";
const DASHBOARD_REPO_URL = "https://github.com/Meisterwerk-GmbH/wander-dashboard";

const numberFormat = new Intl.NumberFormat("de-CH", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

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

const parseAareData = (payload: AarePayload): AareData => {
  const anyPayload = payload as Record<string, any>;
  const temperature =
    anyPayload?.aare ??
    anyPayload?.aare_prec ??
    anyPayload?.temperature ??
    anyPayload?.aareTemperature ??
    anyPayload?.aare_temperature ??
    anyPayload?.temperature_precise ??
    anyPayload?.aare_temperature_precise ??
    undefined;

  const timeRaw =
    anyPayload?.time ??
    anyPayload?.timestamp ??
    anyPayload?.updated ??
    anyPayload?.updated_at ??
    undefined;

  const parsedTemperature =
    typeof temperature === "number"
      ? temperature
      : typeof temperature === "string"
        ? Number.parseFloat(temperature)
        : undefined;

  const parsedTime =
    typeof timeRaw === "number"
      ? new Date(timeRaw * 1000)
      : typeof timeRaw === "string"
        ? new Date(Number.parseFloat(timeRaw) * 1000 || timeRaw)
        : undefined;

  return {
    temperature: Number.isFinite(parsedTemperature) ? parsedTemperature : undefined,
    location: anyPayload?.longname ?? anyPayload?.name ?? anyPayload?.location ?? "Aare · Bern",
    timestamp: parsedTime instanceof Date && !Number.isNaN(parsedTime.getTime()) ? parsedTime : undefined,
  };
};

const temperatureMood = (value?: number) => {
  if (value === undefined) {
    return {
      label: "Daten werden geladen",
      color: "text-slate-200",
      glow: "shadow-[0_0_45px_rgba(148,163,184,0.35)]",
    };
  }

  if (value < 14) {
    return {
      label: "Frisch",
      color: "text-sky-200",
      glow: "shadow-[0_0_45px_rgba(56,189,248,0.35)]",
    };
  }

  if (value < 18) {
    return {
      label: "Klar & angenehm",
      color: "text-emerald-200",
      glow: "shadow-[0_0_45px_rgba(16,185,129,0.35)]",
    };
  }

  if (value < 22) {
    return {
      label: "Perfekt",
      color: "text-amber-200",
      glow: "shadow-[0_0_45px_rgba(251,191,36,0.35)]",
    };
  }

  return {
    label: "Sommerfeeling",
    color: "text-rose-200",
    glow: "shadow-[0_0_45px_rgba(244,114,182,0.35)]",
  };
};

export default function App() {
  const [aare, setAare] = useState<AareData>({});
  const [error, setError] = useState<string | null>(null);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const tick = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    let active = true;

    const fetchAare = async () => {
      try {
        const response = await fetch(AARE_ENDPOINT, { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Aare API antwortet nicht");
        }
        const data = (await response.json()) as AarePayload;
        if (active) {
          const parsed = parseAareData(data);
          setAare(parsed);
          setError(parsed.temperature === undefined ? "Keine Temperaturdaten" : null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Datenfehler");
        }
      }
    };

    fetchAare();
    const timer = setInterval(fetchAare, 5 * 60 * 1000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  const mood = useMemo(() => temperatureMood(aare.temperature), [aare.temperature]);

  return (
    <div className="min-h-screen w-full px-8 py-10 lg:px-16">
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
        <section className="glass relative overflow-hidden rounded-3xl p-8">
          <div className="absolute -top-24 -left-16 h-48 w-48 rounded-full bg-accelerit/30 blur-3xl" />
          <div className="relative space-y-6">
            <div className="flex items-center">
              <img
                src={ACCELERIT_LOGO}
                alt="Accelerit"
                className="h-9 md:h-10 object-contain brightness-0 invert"
              />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold text-slate-50">Build. Scale. Accelerate.</h2>
              <p className="text-sm text-slate-100">
                Produkt- und Plattformteams, die jetzt liefern. Fokus auf Engineering,
                Geschwindigkeit und messbaren Impact.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-200">
              <span className="rounded-full bg-white/5 px-3 py-1">Engineering Momentum</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Cloud & Platform</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Delivery Partners</span>
            </div>
          </div>
        </section>

        <section className="glass rounded-3xl p-8 text-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-200">Aare River</p>
            <h2 className="text-3xl font-semibold text-slate-50">{aare.location ?? "Aare · Bern"}</h2>
            <div className={`mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full bg-white/5 ${mood.glow} animate-float`}>
              <div>
                <p className="text-5xl font-semibold">
                  {aare.temperature !== undefined ? numberFormat.format(aare.temperature) : "--"}
                  <span className="text-2xl">°C</span>
                </p>
                <p className={`text-sm uppercase tracking-[0.3em] ${mood.color}`}>{mood.label}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              {error ? <p className="text-rose-200">{error}</p> : null}
              <p>Letztes Update: {aare.timestamp ? timeFormat.format(aare.timestamp) : "gleich"}</p>
              <p>Datenquelle: aare.guru</p>
            </div>
          </div>
        </section>

        <section className="glass relative overflow-hidden rounded-3xl p-8">
          <div className="absolute -bottom-24 -right-16 h-52 w-52 rounded-full bg-rentshop/30 blur-3xl" />
          <div className="relative space-y-6">
            <div className="flex items-center">
              <img src={RENTSHOP_LOGO} alt="Rentshop" className="h-10 md:h-12 object-contain" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold text-slate-50">Easy Miete. Easy Lieferung.</h2>
              <p className="text-sm text-slate-100">
                Flexible Retailflächen, die sich an Business und Community anpassen. Pop-ups,
                Showrooms und Räume mit Charakter.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-slate-200">
              <span className="rounded-full bg-white/5 px-3 py-1">Locations & Leasing</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Pop-up Spaces</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Community Driven</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-10 flex flex-wrap items-center justify-end gap-4 text-xs text-slate-400">
        <a
          href={DASHBOARD_REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="glass flex items-center gap-3 rounded-xl px-3 py-2 text-slate-200 transition hover:bg-white/10"
          aria-label="GitHub repository"
        >
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(DASHBOARD_REPO_URL)}`}
            alt="QR code for GitHub repository"
            className="h-10 w-10 rounded-md bg-white p-1"
            loading="lazy"
          />
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
            <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.91c.57.1.78-.25.78-.55v-2.13c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.69 1.25 3.35.96.1-.74.4-1.25.74-1.53-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.17a10.9 10.9 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.62 1.57.23 2.73.11 3.02.73.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.07.78 2.16v3.2c0 .31.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
          </svg>
          <span className="uppercase tracking-[0.2em]">GitHub</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-white/20" />
          <p className="uppercase tracking-[0.35em]">Shared Office</p>
        </div>
      </footer>
    </div>
  );
}
