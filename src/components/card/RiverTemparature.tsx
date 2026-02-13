import { useEffect, useMemo, useState } from "react";

type AarePayload = Record<string, unknown>;

type AareData = {
  temperature?: number;
  location?: string;
  timestamp?: Date;
};

type TemperatureMood = {
  label: string;
  color: string;
  glow: string;
};

const AARE_ENDPOINT =
  "https://aareguru.existenz.ch/v2018/today?app=office-dashboard&version=1.0.1&city=bern";

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

const temperatureMood = (value?: number): TemperatureMood => {
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

export default function RiverTemperatureCard() {
  const [aare, setAare] = useState<AareData>({});
  const [error, setError] = useState<string | null>(null);

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
  const location = aare.location ?? "Aare · Bern";
  const temperature = aare.temperature !== undefined ? numberFormat.format(aare.temperature) : "--";
  const lastUpdate = aare.timestamp ? timeFormat.format(aare.timestamp) : "gleich";

  return (
    <section className="glass rounded-3xl p-8 text-center">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-200">Aare River</p>
        <h2 className="text-3xl font-semibold text-slate-50">{location}</h2>
        <div
          className={`mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full bg-white/5 ${mood.glow} animate-float`}
        >
          <div>
            <p className="text-5xl font-semibold">
              {temperature}
              <span className="text-2xl">°C</span>
            </p>
            <p className={`text-sm uppercase tracking-[0.3em] ${mood.color}`}>{mood.label}</p>
          </div>
        </div>
        <div className="space-y-2 text-xs text-slate-200">
          {error ? <p className="text-rose-200">{error}</p> : null}
          <p>Letztes Update: {lastUpdate}</p>
          <p>Datenquelle: aare.guru</p>
        </div>
      </div>
    </section>
  );
}
