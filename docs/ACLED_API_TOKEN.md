# ACLED API 토큰 받는 방법

회원가입·로그인까지 완료한 상태에서 **API용 토큰(OAuth access token)** 을 받는 방법입니다.

**중요:** 브라우저에서는 ACLED API를 직접 호출할 수 없습니다(CORS). 이 프로젝트는 **백엔드 프록시**를 통해 호출하므로, 토큰은 **반드시 `backend/.env`** 에만 두세요.

---

## 1. 터미널에서 토큰 발급

비밀번호에 `!`, `&` 등이 있으면 **`-d`를 파라미터마다 따로** 넣고, 비밀번호만 작은따옴표로 감싸세요.

```bash
curl -X POST "https://acleddata.com/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=본인이메일@example.com" \
  -d 'password=본인비밀번호' \
  -d "grant_type=password" \
  -d "client_id=acled"
```

응답 JSON에서 **`access_token`** 값 전체를 복사합니다.

---

## 2. 백엔드에 토큰 설정 (CORS 대응)

1. **`backend`** 폴더에 `.env` 파일을 만듭니다.
2. 다음 한 줄을 추가하고, `발급받은_access_token` 자리에 복사한 토큰을 붙여넣습니다.

```env
ACLED_API_TOKEN=발급받은_access_token
```

3. **백엔드를 먼저 실행**합니다 (별도 터미널):

```bash
cd backend
pnpm install
pnpm start
```

4. **프론트엔드**를 실행합니다:

```bash
cd frontend
pnpm start
```

프론트는 `http://localhost:3000`에서 `/api/acled/events`를 호출하고, CRA proxy가 이를 `http://localhost:5001` 백엔드로 넘깁니다. (macOS에서 5000은 AirPlay 등이 쓸 수 있어 5001 사용) 백엔드가 ACLED API를 호출해 데이터를 돌려줍니다.

---

## 3. 유의사항

- **토큰 위치**: 토큰은 **`backend/.env`의 `ACLED_API_TOKEN`** 에만 두세요. `frontend/.env`에는 넣지 마세요.
- **유효기간**: access_token은 **약 24시간** 유효합니다. 만료되면 1번의 `curl`을 다시 실행해 새 토큰을 받고 `backend/.env`를 갱신한 뒤 백엔드를 재시작하세요.
- **공식 문서**: [ACLED API – Getting started](https://acleddata.com/api-documentation/getting-started) / [API authentication](https://acleddata.com/api-authentication)

---

## 4. "Access denied" / "denied the request" 가 나올 때

토큰을 넣었는데 **Access denied** 또는 **The resource owner or authorization server denied the request** 가 나오면, ACLED **계정 권한** 문제일 수 있습니다.

- **이메일 인증**  
  가입 시 보낸 메일에서 인증 링크를 눌렀는지 확인하세요.
- **이용약관 동의**  
  [acleddata.com](https://acleddata.com)에 로그인한 뒤, API/데이터 이용약관·정책에 동의했는지 확인하세요.
- **API 접근 승인**  
  일부 계정은 API 접근이 수동 승인된 뒤에만 됩니다.  
  [ACLED Access Portal](https://developer.acleddata.com/) 또는 [이메일 문의](mailto:access@acleddata.com)로 API 접근 요청이 필요할 수 있습니다.

위를 확인해도 해결되지 않으면 **샘플 데이터**로 계속 개발하시고, ACLED는 나중에 권한이 열리면 다시 시도하시면 됩니다.

---

## 5. 토큰 없이 / 백엔드 없이 쓰기

- `backend/.env`에 `ACLED_API_TOKEN`을 넣지 않거나, 백엔드를 실행하지 않으면 프론트는 **샘플 이벤트 데이터**만 사용합니다.
- 지도·타임라인·재생은 그대로 동작합니다.
