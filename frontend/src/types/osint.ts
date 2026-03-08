/**
 * OSINT 이벤트 공통 타입 (ACLED / 샘플 데이터)
 */
export interface OsintEvent {
  id: string;
  lat: number;
  lon: number;
  time: string;
  type: string;
  desc: string;
}

export type EventTypeColorMap = Record<string, [number, number, number, number]>;
