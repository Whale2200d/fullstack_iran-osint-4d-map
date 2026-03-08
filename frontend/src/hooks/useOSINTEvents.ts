import { useState, useEffect, useCallback } from "react";
import { sampleEvents } from "../data/sampleEvents";
import { fetchACLEDEvents } from "../api/acled";
import type { OsintEvent } from "../types/osint";

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5분

export interface UseOSINTEventsResult {
  events: OsintEvent[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

/**
 * OSINT 이벤트 소스 통합 훅
 * - 백엔드 프록시(/api/acled/events) 호출 → 성공 시 ACLED 데이터, 실패/에러 시 sampleEvents
 * - 5분마다 재요청
 */
export function useOSINTEvents(): UseOSINTEventsResult {
  const [events, setEvents] = useState<OsintEvent[]>(sampleEvents);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { events: next, error: err } = await fetchACLEDEvents({
      country: "Iran",
      year: new Date().getFullYear(),
      limit: 150,
    });

    setLoading(false);
    if (err || !next?.length) {
      if (err) setError(err);
      setEvents(sampleEvents);
    } else {
      setError(null);
      setEvents(next);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const id = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [load]);

  return { events, loading, error, reload: load };
}
