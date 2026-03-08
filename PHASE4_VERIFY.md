# Phase 4 검증 가이드 (Commit 15~19)

OSINT(ACLED) API 연동 + 폴링 + 동적 엔티티 + 로딩/에러 UI까지 적용된 상태입니다.  
아래 순서로 확인한 뒤, 문제 없으면 **수동으로 commit** 하세요.

## 1. 토큰 없이 동작 확인 (기본)

```bash
cd frontend
pnpm start
```

- **ACLED 토큰을 설정하지 않으면** 샘플 이벤트 5개만 사용합니다.
- 로딩 스피너 없이 바로 지도·타임라인·재생이 동작해야 합니다.
- 기존과 동일하게 이벤트 마커 5개, 타임라인, 재생이 보이면 OK입니다.

## 2. ACLED API 토큰 설정 (선택)

1. [ACLED](https://acleddata.com) 가입 후 로그인.
2. OAuth 토큰 발급 (예: curl):
   ```bash
   curl -X POST "https://acleddata.com/oauth/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=YOUR_EMAIL&password=YOUR_PASSWORD&grant_type=password&client_id=acled"
   ```
   응답의 `access_token` 값을 복사합니다 (24시간 유효).
3. `frontend/.env` 생성 후 추가:
   ```
   REACT_APP_ACLED_API_TOKEN=발급받은_access_token
   ```
4. 개발 서버 재시작 후 새로고침.

- **토큰이 있으면** 앱 로딩 시 ACLED API를 호출합니다.
- 상단에 **"OSINT 데이터 불러오는 중…"** 스피너가 잠깐 보였다가 사라지고, **이란(Iran) 이벤트**가 지도·타임라인에 표시되면 성공입니다.
- **에러가 나면** 상단에 빨간 배너와 **"다시 시도"** 버튼이 보입니다. (토큰 만료·네트워크 오류 등)

## 3. 폴링 동작 (토큰 사용 시)

- ACLED 토큰을 넣은 상태에서 5분 이상 두면, **5분마다** 자동으로 다시 요청합니다.
- (실제 데이터가 자주 바뀌지 않을 수 있어, 화면 변화는 크지 않을 수 있습니다.)

## 4. 체크리스트 (Phase 4)

| 항목 | 확인 |
|------|------|
| 토큰 없을 때 샘플 이벤트만으로 지도·타임라인·재생 정상 동작 | ☑ |
| ACLED 토큰 설정 시 API 호출 후 이벤트가 지도에 표시됨 | ☑ |
| 로딩 중 스피너 표시, 에러 시 빨간 배너 + "다시 시도" 표시 | ☑ |
| `pnpm run build` 성공 | ☑ |

## 5. Commit 메시지 예시 (한글)

- `ACLED API fetch 서비스 및 env 토큰 설정 추가`
- `useOSINTEvents 폴링 훅 및 CesiumViewer 연동`
- `ACLED 데이터를 Cesium 엔티티로 렌더링, 로딩/에러 UI 추가`
- `Phase 4 검증 가이드 추가`

원하는 단위로 나눠서 commit 하시면 됩니다.

---

검토가 끝나면 commit 하시고, 다음 **Phase 5 (AI 에이전트·고급 기능)** 또는 배포·폴리싱으로 진행하시면 됩니다.
