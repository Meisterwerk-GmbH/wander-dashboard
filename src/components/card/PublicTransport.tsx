import { useEffect, useMemo, useState } from "react";

const STATION_QUERY = import.meta.env.VITE_PT_STATION_QUERY?.trim() || "Bern";
const LOCATIONS_ENDPOINT = "https://transport.opendata.ch/v1/locations";
const STATIONBOARD_ENDPOINT = "https://transport.opendata.ch/v1/stationboard";
const MAX_DEPARTURES = 6;

type ApiStation = {
  id?: string;
  name?: string;
  type?: string;
  coordinate?: {
    x?: number | null;
    y?: number | null;
  };
};

type ApiStop = {
  departure?: string;
  platform?: string;
  prognosis?: {
    departure?: string;
    platform?: string;
  };
};

type ApiStationboardEntry = {
  name?: string;
  number?: string;
  to?: string;
  stop?: ApiStop;
};

type LocationsResponse = {
  stations?: ApiStation[];
};

type StationboardResponse = {
  station?: ApiStation;
  stationboard?: ApiStationboardEntry[];
};

type Departure = {
  line: string;
  destination: string;
  departure: Date | null;
  platform: string | null;
};

const timeFormat = new Intl.DateTimeFormat("de-CH", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Zurich",
});

const parseDeparture = (entry: ApiStationboardEntry): Departure => {
  const departureRaw = entry.stop?.prognosis?.departure ?? entry.stop?.departure;
  const departure = departureRaw ? new Date(departureRaw) : null;

  return {
    line: entry.number ?? entry.name ?? "?",
    destination: entry.to ?? "Unbekannt",
    departure: departure && !Number.isNaN(departure.getTime()) ? departure : null,
    platform: entry.stop?.prognosis?.platform ?? entry.stop?.platform ?? null,
  };
};

const minutesUntil = (departure: Date | null, now: number): string => {
  if (!departure) {
    return "--";
  }

  const diffMinutes = Math.round((departure.getTime() - now) / 60000);
  if (diffMinutes <= 0) {
    return "jetzt";
  }
  return `in ${diffMinutes} min`;
};

export default function PublicTransportCard() {
  const [stationName, setStationName] = useState(STATION_QUERY);
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;

    const fetchDepartures = async () => {
      setIsLoading(true);

      try {
        const stationResponse = await fetch(
          `${LOCATIONS_ENDPOINT}?query=${encodeURIComponent(STATION_QUERY)}&type=station`,
          { cache: "no-store" },
        );

        if (!stationResponse.ok) {
          throw new Error("ÖV-Station konnte nicht geladen werden");
        }

        const locations = (await stationResponse.json()) as LocationsResponse;
        const station =
          locations.stations?.find((item) => Boolean(item.id)) ??
          locations.stations?.find(
            (item) => typeof item.coordinate?.x === "number" && typeof item.coordinate?.y === "number",
          ) ??
          locations.stations?.[0];

        if (!station?.name) {
          throw new Error(`Keine Station für "${STATION_QUERY}" gefunden`);
        }

        const stationIdOrName = station.id ?? station.name;
        const departuresResponse = await fetch(
          `${STATIONBOARD_ENDPOINT}?id=${encodeURIComponent(stationIdOrName)}&limit=${MAX_DEPARTURES}`,
          { cache: "no-store" },
        );

        if (!departuresResponse.ok) {
          throw new Error("ÖV-Verbindungen konnten nicht geladen werden");
        }

        const stationboard = (await departuresResponse.json()) as StationboardResponse;
        const parsedDepartures = (stationboard.stationboard ?? []).map(parseDeparture);

        if (active) {
          setStationName(stationboard.station?.name ?? station.name);
          setDepartures(parsedDepartures);
          setError(parsedDepartures.length === 0 ? "Keine aktuellen Abfahrten" : null);
          setLastUpdate(new Date());
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "ÖV-Datenfehler");
          setDepartures([]);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchDepartures();
    const refresh = setInterval(fetchDepartures, 60_000);

    return () => {
      active = false;
      clearInterval(refresh);
    };
  }, []);

  const renderedRows = useMemo(
    () =>
      departures.map((departure, index) => (
        <li
          key={`${departure.line}-${departure.destination}-${departure.departure?.toISOString() ?? index}`}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl bg-white/5 px-3 py-2"
        >
          <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-semibold text-slate-100">
            {departure.line}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-50">{departure.destination}</p>
            <p className="text-xs text-slate-300">
              {departure.platform ? `Gleis ${departure.platform}` : "Gleis --"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-50">
              {departure.departure ? timeFormat.format(departure.departure) : "--:--"}
            </p>
            <p className="text-xs text-slate-300">{minutesUntil(departure.departure, now)}</p>
          </div>
        </li>
      )),
    [departures, now],
  );

  return (
    <section className="glass relative overflow-hidden rounded-3xl p-8">
      <div className="absolute -top-24 -right-16 h-52 w-52 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="relative space-y-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-200">Public Transport</p>
          <h2 className="text-2xl font-semibold text-slate-50">{stationName}</h2>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-200">Verbindungen werden geladen...</p>
        ) : (
          <ul className="space-y-2">{renderedRows}</ul>
        )}

        <div className="space-y-1 text-xs text-slate-200">
          {error ? <p className="text-rose-200">{error}</p> : null}
          <p>Letztes Update: {lastUpdate ? timeFormat.format(lastUpdate) : "gleich"}</p>
          <p>Datenquelle: transport.opendata.ch</p>
        </div>
      </div>
    </section>
  );
}
