import type { OsintEvent, EventTypeColorMap } from "../types/osint";

/**
 * 샘플 OSINT 이벤트 데이터 (이란/테헤란 지역)
 * Phase 2: 하드코딩 데이터 → 이후 API/DB 연동으로 대체
 */
export const sampleEvents: OsintEvent[] = [
  {
    id: "evt-1",
    lat: 35.6892,
    lon: 51.389,
    time: "2026-02-28T14:30:00Z",
    type: "airstrike",
    desc: "Reported airstrike near Tehran. Multiple sources.",
  },
  {
    id: "evt-2",
    lat: 35.7123,
    lon: 51.4234,
    time: "2026-02-28T15:00:00Z",
    type: "gps_jam",
    desc: "GPS jamming detected in sector. Flightradar24 anomaly.",
  },
  {
    id: "evt-3",
    lat: 35.6011,
    lon: 51.4233,
    time: "2026-02-28T14:45:00Z",
    type: "military_activity",
    desc: "Military movement observed. OSINT cross-ref.",
  },
  {
    id: "evt-4",
    lat: 35.75,
    lon: 51.35,
    time: "2026-02-28T16:00:00Z",
    type: "airstrike",
    desc: "Secondary strike. Social media verification pending.",
  },
  {
    id: "evt-5",
    lat: 35.65,
    lon: 51.48,
    time: "2026-02-28T15:30:00Z",
    type: "gps_jam",
    desc: "Intermittent GPS disruption. Duration ~20 min.",
  },
];

/** 이벤트 타입별 Cesium 색상 (RGBA 0–1) */
export const eventTypeColor: EventTypeColorMap = {
  airstrike: [1, 0.2, 0.2, 1],
  gps_jam: [1, 0.9, 0.2, 1],
  military_activity: [0.3, 0.5, 1, 1],
  default: [0.7, 0.7, 0.7, 1],
};
