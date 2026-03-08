import React, { useRef, useEffect } from "react";
import { Timeline } from "vis-timeline";
import { DataSet } from "vis-data";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import "./TimelineSlider.css";
import type { OsintEvent } from "../types/osint";

/** 이란 공습 기간: 2026-02-28 00:00 ~ 24:00 (UTC) */
export const TIMELINE_MIN = new Date("2026-02-28T00:00:00Z");
export const TIMELINE_MAX = new Date("2026-02-28T23:59:59Z");

export interface TimelineSliderProps {
  events: OsintEvent[];
  onRangeChange: (start: Date, end: Date) => void;
  initialStart?: Date | string;
  initialEnd?: Date | string;
}

/**
 * 타임라인 슬라이더 (vis-timeline)
 * - 범위: 2026-02-28
 * - 슬라이더/줌 시 보이는 구간으로 엔티티 필터링용 콜백
 */
function TimelineSlider({
  events,
  onRangeChange,
  initialStart,
  initialEnd,
}: TimelineSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<Timeline | null>(null);
  const onRangeChangeRef = useRef(onRangeChange);
  onRangeChangeRef.current = onRangeChange;

  useEffect(() => {
    if (!containerRef.current || !events?.length) return;

    const items = new DataSet(
      events.map((evt) => ({
        id: evt.id,
        start: new Date(evt.time),
        content: evt.type,
        className: `vis-item-type-${evt.type}`,
      }))
    );

    const start = initialStart ? new Date(initialStart) : TIMELINE_MIN;
    const end = initialEnd ? new Date(initialEnd) : TIMELINE_MAX;

    const timeline = new Timeline(containerRef.current, items, {
      min: TIMELINE_MIN,
      max: TIMELINE_MAX,
      start,
      end,
      zoomMin: 60 * 1000,
      zoomMax: 24 * 60 * 60 * 1000,
      showCurrentTime: false,
      orientation: "top",
      margin: { item: 4 },
      stack: false,
    });

    const handleRangeChanged = (): void => {
      const win = timeline.getWindow();
      if (win && onRangeChangeRef.current) {
        onRangeChangeRef.current(win.start as Date, win.end as Date);
      }
    };

    timeline.on("rangechanged", handleRangeChanged);
    timeline.on("rangechange", handleRangeChanged);

    if (onRangeChangeRef.current) onRangeChangeRef.current(start, end);
    timelineRef.current = timeline;

    return () => {
      timeline.off("rangechanged", handleRangeChanged);
      timeline.off("rangechange", handleRangeChanged);
      timeline.destroy();
      timelineRef.current = null;
    };
  }, [events?.length]);

  return (
    <div className="timeline-slider-wrap">
      <div className="timeline-slider-label">타임라인 · 2026-02-28</div>
      <div ref={containerRef} className="timeline-slider" />
    </div>
  );
}

export default TimelineSlider;
