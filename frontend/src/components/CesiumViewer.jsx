import React, { useRef, useEffect } from 'react';
import * as Cesium from 'cesium';
import './CesiumViewer.css';

// Cesium Ion 무료 토큰: https://cesium.com/ion/tokens 에서 발급 후 .env에 REACT_APP_CESIUM_ION_TOKEN 설정
const CESIUM_ION_TOKEN = process.env.REACT_APP_CESIUM_ION_TOKEN || '';

/**
 * Cesium 3D Globe 뷰어 컴포넌트
 * - 테헤란 중심 초기 카메라
 * - 다크/위성 베이스맵 (Cesium Ion)
 * - 기본 네비게이션·줌 컨트롤
 */
function CesiumViewer() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

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
      sceneModePicker: false, // scene3DOnly일 때는 사용 불가
      timeline: true,
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

    viewerRef.current = viewer;

    (async () => {
      try {
        if (CESIUM_ION_TOKEN) {
          viewer.terrainProvider = await Cesium.createWorldTerrainAsync();
          viewer.imageryLayers.removeAll();
          viewer.imageryLayers.addImageryProvider(
            await Cesium.IonImageryProvider.fromAssetId(2)
          );
        } else {
          viewer.imageryLayers.removeAll();
          viewer.imageryLayers.addImageryProvider(
            new Cesium.OpenStreetMapImageryProvider({ url: 'https://tile.openstreetmap.org/' })
          );
        }
      } catch (e) {
        console.warn('Cesium Ion/terrain failed:', e.message);
      }

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(51.42, 35.69, 1_500_000),
        duration: 1.5,
        orientation: {
          heading: 0,
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
      });
    })();

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="cesium-viewer-container" />;
}

export default CesiumViewer;
