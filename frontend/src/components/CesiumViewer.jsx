import React, { useRef, useEffect, useState, useCallback } from "react";
import * as Cesium from "cesium";
import { sampleEvents, eventTypeColor } from "../data/sampleEvents";
import TimelineSlider, { TIMELINE_MIN, TIMELINE_MAX } from "./TimelineSlider";
import "./CesiumViewer.css";

// Cesium Ion 무료 토큰: https://cesium.com/ion/tokens 에서 발급 후 .env에 REACT_APP_CESIUM_ION_TOKEN 설정
const CESIUM_ION_TOKEN = process.env.REACT_APP_CESIUM_ION_TOKEN || "";

const CLOCK_START = Cesium.JulianDate.fromDate(TIMELINE_MIN);
const CLOCK_END = Cesium.JulianDate.fromDate(TIMELINE_MAX);

function setEntitiesVisibilityByRange(viewer, events, start, end) {
  if (!viewer || viewer.isDestroyed()) return;
  const startMs = start.getTime();
  const endMs = end.getTime();
  events.forEach((evt) => {
    const entity = viewer.entities.getById(evt.id);
    if (entity) {
      const t = new Date(evt.time).getTime();
      entity.show = t >= startMs && t <= endMs;
    }
  });
}

function setEntitiesVisibilityByCurrentTime(viewer, events, currentTime) {
  if (!viewer || viewer.isDestroyed()) return;
  const currentMs = Cesium.JulianDate.toDate(currentTime).getTime();
  events.forEach((evt) => {
    const entity = viewer.entities.getById(evt.id);
    if (entity) {
      const t = new Date(evt.time).getTime();
      entity.show = t <= currentMs;
    }
  });
}

/**
 * Cesium 3D Globe 뷰어 + 타임라인 & 4D
 * - 테헤란 중심, 베이스맵, 네비게이션
 * - vis-timeline으로 시간 범위 필터, Cesium Clock 재생
 */
function CesiumViewer() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clockTime, setClockTime] = useState(TIMELINE_MIN.getTime());

  const onRangeChange = useCallback((start, end) => {
    const viewer = viewerRef.current;
    if (viewer && !viewer.isDestroyed()) {
      setEntitiesVisibilityByRange(viewer, sampleEvents, start, end);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    if (CESIUM_ION_TOKEN) {
      Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;
    }

    const viewer = new Cesium.Viewer(containerRef.current, {
      imageryProvider: false,
      baseLayerPicker: true,
      geocoder: true,
      homeButton: true,
      sceneModePicker: false,
      timeline: false,
      navigationHelpButton: true,
      fullscreenButton: true,
      animation: false,
      vrButton: false,
      useDefaultRenderLoop: true,
      requestRenderMode: false,
      skyBox: false,
      skyAtmosphere: false,
      scene3DOnly: true,
    });

    viewer.clock.startTime = CLOCK_START.clone();
    viewer.clock.stopTime = CLOCK_END.clone();
    viewer.clock.currentTime = CLOCK_START.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = 60;
    viewer.clock.shouldAnimate = false;

    viewerRef.current = viewer;

    sampleEvents.forEach((evt) => {
      const [r, g, b, a] = eventTypeColor[evt.type] || eventTypeColor.default;
      viewer.entities.add({
        id: evt.id,
        position: Cesium.Cartesian3.fromDegrees(evt.lon, evt.lat, 0),
        point: {
          pixelSize: 12,
          color: new Cesium.Color(r, g, b, a),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
        },
        name: `${evt.type} · ${evt.time.slice(0, 16).replace("T", " ")}Z`,
        description: `<p>${evt.desc}</p><p><small>${evt.time} | ${evt.type}</small></p>`,
      });
    });

    setEntitiesVisibilityByRange(viewer, sampleEvents, TIMELINE_MIN, TIMELINE_MAX);

    const onTick = () => {
      if (viewer.clock.shouldAnimate) {
        setEntitiesVisibilityByCurrentTime(viewer, sampleEvents, viewer.clock.currentTime);
      }
      setClockTime(Cesium.JulianDate.toDate(viewer.clock.currentTime).getTime());
    };
    const removeTick = viewer.scene.preRender.addEventListener(onTick);

    (async () => {
      try {
        if (CESIUM_ION_TOKEN) {
          viewer.terrainProvider = await Cesium.createWorldTerrainAsync();
          viewer.imageryLayers.removeAll();
          viewer.imageryLayers.addImageryProvider(await Cesium.IonImageryProvider.fromAssetId(2));
        } else {
          viewer.imageryLayers.removeAll();
          viewer.imageryLayers.addImageryProvider(
            new Cesium.OpenStreetMapImageryProvider({ url: "https://tile.openstreetmap.org/" }),
          );
        }
      } catch (e) {
        console.warn("Cesium Ion/terrain failed:", e.message);
      }

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(51.42, 35.69, 4_500_000),
        duration: 1.5,
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-80),
          roll: 0,
        },
      });
    })();

    return () => {
      removeTick();
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = () => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;
    viewer.clock.shouldAnimate = !viewer.clock.shouldAnimate;
    setIsPlaying(viewer.clock.shouldAnimate);
  };

  const handleReset = () => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;
    viewer.clock.shouldAnimate = false;
    viewer.clock.currentTime = CLOCK_START.clone();
    setIsPlaying(false);
    setEntitiesVisibilityByRange(viewer, sampleEvents, TIMELINE_MIN, TIMELINE_MAX);
  };

  const currentTimeLabel =
    clockTime != null ? new Date(clockTime).toISOString().slice(11, 19) : "00:00:00";

  return (
    <div className="cesium-viewer-wrap">
      <div ref={containerRef} className="cesium-viewer-container" />
      <div className="clock-controls">
        <button type="button" onClick={handlePlayPause} aria-label={isPlaying ? "일시정지" : "재생"}>
          {isPlaying ? "⏸ 일시정지" : "▶ 재생"}
        </button>
        <button type="button" onClick={handleReset} aria-label="처음으로">
          ⏹ 처음으로
        </button>
        <span className="clock-time">{currentTimeLabel} UTC</span>
      </div>
      <TimelineSlider events={sampleEvents} onRangeChange={onRangeChange} />
    </div>
  );
}

export default CesiumViewer;
