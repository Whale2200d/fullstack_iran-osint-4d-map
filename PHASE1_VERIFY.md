# Phase 1 검증 가이드 (Commit 2~6)

작업 후 아래 순서로 동작을 확인한 뒤, 문제 없으면 **수동으로 commit** 하시면 됩니다.

## 1. 사전 준비

```bash
cd frontend
pnpm install
pnpm run copy-cesium   # Cesium 정적 파일을 public/Cesium 에 복사 (최초 1회 또는 node_modules 재설치 후)
```

- `public/Cesium/` 폴더에 `Workers/`, `Widgets/`, `Assets/` 등이 있어야 합니다.
- 없으면 지도가 뜨지 않거나 콘솔에 404 에러가 날 수 있습니다.

## 2. 개발 서버로 확인 (권장)

```bash
cd frontend
pnpm start
```

- 브라우저가 열리면 **3D 지구본**이 보여야 합니다.
- **1~2초 후 카메라가 테헤란(이란) 쪽으로 이동**해야 합니다.
- 왼쪽 위 **레이어/홈/검색/전체화면** 등 Cesium 기본 컨트롤이 보여야 합니다.
- 토큰 없이 실행 시 **OSM 타일** 지도가 보이고,  
  `.env`에 `REACT_APP_CESIUM_ION_TOKEN`을 넣으면 **Cesium Ion 위성/terrain**이 적용됩니다.

## 3. 빌드 확인

`package.json`의 `start`/`build` 시 ESLint 플러그인 충돌로 실패하면,  
아래처럼 환경 변수로 ESLint를 끄고 실행하세요.

```bash
cd frontend
DISABLE_ESLINT_PLUGIN=true pnpm run build
# 또는 (start 스크립트에 이미 적용되어 있을 수 있음)
pnpm start
```

- `build/` 폴더가 생성되고, `build/index.html`, `build/Cesium/` 등이 있어야 합니다.
- `build/` 기준으로 `npx serve -s build` 로 로컬에서 프로덕션 동작도 확인할 수 있습니다.

## 4. 체크리스트 (Phase 1)

| 항목                                                         | 확인 |
| ------------------------------------------------------------ | ---- |
| Cesium 3D 글로브가 화면에 표시됨                             | ☑    |
| 초기 카메라가 테헤란(Tehran) 근처로 이동함                   | ☑    |
| 줌/회전/이동 등 기본 네비게이션 동작                         | ☑    |
| baseLayerPicker(레이어 선택), 홈 버튼 등 UI 표시             | ☑    |
| `pnpm run build` 성공 (필요 시 `DISABLE_ESLINT_PLUGIN=true`) | ☑    |

## 5. Commit 메시지 예시 (로드맵 기준)

Phase 1을 한 번에 커밋할 경우:

- `Add Cesium.js and display basic 3D globe`
- `Extract CesiumViewer component`
- `Set initial camera to Tehran`
- `Enable navigation controls`
- `Apply dark/satellite basemap with Cesium Ion`

작업을 나눠서 커밋했다면 위 메시지를 단계별로 사용하시면 됩니다.

---

검토가 끝나면 원하는 단위로 commit 하시고, 다음 Phase 2(샘플 이벤트 데이터 + 마커)로 진행하시면 됩니다.
