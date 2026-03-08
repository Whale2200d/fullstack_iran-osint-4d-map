/**
 * ACLED API 프록시 (CORS 회피)
 * - 브라우저는 이 서버만 호출하고, 서버가 acleddata.com을 호출합니다.
 * - 토큰은 backend/.env의 ACLED_API_TOKEN에만 두세요.
 */
import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 5001;

app.use(cors({ origin: true }));
app.use(express.json());

const ACLED_BASE = "https://acleddata.com/api/acled/read";

interface ACLEDRow {
  latitude?: string | number;
  longitude?: string | number;
  event_date?: string;
  event_id_cnty?: string;
  id?: string | number;
  event_type?: string;
  notes?: string;
  sub_event_type?: string;
  disorder_type?: string;
}

interface NormalizedEvent {
  id: string;
  lat: number;
  lon: number;
  time: string;
  type: string;
  desc: string;
}

function mapEventType(eventType: string | undefined): string {
  if (!eventType) return "military_activity";
  const t = String(eventType).toLowerCase();
  if (t.includes("air") || t.includes("explosion") || t.includes("battle"))
    return "airstrike";
  if (
    t.includes("riot") ||
    t.includes("protest") ||
    t.includes("demonstration")
  )
    return "military_activity";
  return "military_activity";
}

function normalizeRow(row: ACLEDRow): NormalizedEvent {
  const lat = parseFloat(String(row.latitude ?? ""));
  const lon = parseFloat(String(row.longitude ?? ""));
  const date = row.event_date ?? "";
  const time =
    date.length >= 10 ? `${date}T12:00:00Z` : `${date}T12:00:00Z`;
  return {
    id: String(
      row.event_id_cnty ?? row.id ?? Math.random().toString(36).slice(2)
    ),
    lat: Number.isFinite(lat) ? lat : 0,
    lon: Number.isFinite(lon) ? lon : 0,
    time,
    type: mapEventType(row.event_type),
    desc:
      [row.notes, row.sub_event_type, row.disorder_type]
        .filter(Boolean)
        .join(" · ") || "—",
  };
}

app.get("/api/acled/events", async (req: Request, res: Response) => {
  let token = (process.env.ACLED_API_TOKEN ?? "").trim();
  token = token.replace(/^["']|["']$/g, "");
  if (token.includes(",")) token = token.split(",")[0].trim();
  if (!token) {
    return res
      .status(200)
      .json({ events: [], count: 0, error: "ACLED_API_TOKEN not set" });
  }

  const country = (req.query.country as string) || "Iran";
  const year =
    req.query.year != null
      ? Number(req.query.year)
      : new Date().getFullYear();
  const limit = (req.query.limit as string) || "150";

  const params = new URLSearchParams({
    _format: "json",
    country,
    limit,
    year: String(year),
  });
  const url = `${ACLED_BASE}?${params.toString()}`;

  try {
    const out = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = (await out.json()) as {
      success?: boolean;
      data?: ACLEDRow[];
      count?: number;
      messages?: string[];
      error_description?: string;
      message?: string;
    };

    if (!out.ok) {
      return res.status(200).json({
        events: [],
        count: 0,
        error:
          json?.error_description ??
          json?.message ??
          `HTTP ${out.status}`,
      });
    }

    if (json.success !== true || !Array.isArray(json.data)) {
      return res.status(200).json({
        events: [],
        count: 0,
        error: json?.messages?.[0] ?? "Invalid response",
      });
    }

    const events = json.data.map(normalizeRow);
    res.json({
      events,
      count: json.count ?? events.length,
      error: null,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    res.status(200).json({ events: [], count: 0, error: message });
  }
});

app.listen(PORT, () => {
  console.log(`ACLED proxy: http://localhost:${PORT}`);
});
