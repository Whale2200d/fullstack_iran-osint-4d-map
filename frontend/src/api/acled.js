/**
 * ACLED 이벤트 조회 (백엔드 프록시 경유)
 * - 브라우저 CORS 회피: frontend는 /api/acled/events 호출 → backend(5000)가 acleddata.com 호출
 * - 토큰은 backend/.env의 ACLED_API_TOKEN에만 두세요.
 */

const API_BASE = ""; // CRA proxy가 http://localhost:5000 으로 보냄

/**
 * 백엔드 프록시를 통해 ACLED 이벤트 목록 요청
 * @param {Object} options - country, year, limit
 * @returns {Promise<{ events: Array, count: number, error?: string }>}
 */
export async function fetchACLEDEvents(options = {}) {
  const { country = "Iran", year, limit = 150 } = options;
  const params = new URLSearchParams({ country, limit: String(limit) });
  if (year != null) params.set("year", String(year));

  const url = `${API_BASE}/api/acled/events?${params.toString()}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const json = await res.json();

    if (!res.ok) {
      return { events: [], count: 0, error: json?.error || `HTTP ${res.status}` };
    }

    return {
      events: json.events || [],
      count: json.count ?? (json.events || []).length,
      error: json.error || null,
    };
  } catch (e) {
    return { events: [], count: 0, error: e.message || "Network error" };
  }
}
