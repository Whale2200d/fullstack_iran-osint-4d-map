# Phase 2 검증 가이드 (Commit 7~10)

샘플 이벤트 데이터 + 마커 + 타입별 색상 + 클릭 팝업까지 적용된 상태입니다.  
아래 순서로 확인한 뒤, 문제 없으면 **수동으로 commit** 하세요.

## 1. 개발 서버로 확인 (권장)

```bash
cd frontend
pnpm start
```

- **3D 지도** 위 테헤란 근처에 **마커(점) 5개**가 보여야 합니다.
- **색상 구분**
  - **빨간색**: airstrike (공습)
  - **노란색**: gps_jam (GPS 교란)
  - **파란색**: military_activity (군사 활동)
- 마커를 **클릭**하면 오른쪽 위 **InfoBox**에 이벤트 제목·설명·시간·타입이 표시됩니다.
- 지도 줌/이동으로 마커 위치가 테헤란 주변인지 확인합니다.

## 2. 데이터/코드 확인

- `frontend/src/data/sampleEvents.js`: `sampleEvents` 배열과 `eventTypeColor` 객체가 있어야 합니다.
- `frontend/src/components/CesiumViewer.jsx`: `sampleEvents`를 import해 `viewer.entities.add(...)`로 마커를 추가하고, 각 entity에 `name`, `description`이 설정되어 있어야 합니다.

## 3. 빌드 확인

```bash
cd frontend
pnpm run build
```

- 에러 없이 `build/`가 생성되는지 확인합니다.

## 4. 체크리스트 (Phase 2)

| 항목 | 확인 |
|------|------|
| 샘플 이벤트 5개가 지도에 마커(점)로 표시됨 | ☑ |
| airstrike=빨강, gps_jam=노랑, military_activity=파랑으로 구분됨 | ☑ |
| 마커 클릭 시 Cesium InfoBox에 제목·설명·시간·타입 표시됨 | ☑ |
| `pnpm run build` 성공 | ☑ |

## 5. Commit 메시지 예시 (한글)

- `하드코딩 샘플 이벤트 데이터 추가`
- `샘플 이벤트를 Cesium 엔티티로 표시, 타입별 색상 및 클릭 시 팝업 추가`
- `Phase 2 검증 가이드 추가`

---

검토가 끝나면 commit 하시고, 다음 **Phase 3 (타임라인 & 4D)** 로 진행하시면 됩니다.
