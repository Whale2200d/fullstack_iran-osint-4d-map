# Reference

- @Bilawal Sidhu(@bilawal.ai)의 WorldView 프로젝트(실시간 OSINT 기반 4D 지리공간 재현 프로젝트)를 참고
- 그는 전 Google 3D Maps/AR PM 출신이라 기반이 좋았지만, 실제로 3일 만에 프로토타입을 만들었고 AI(LLM)를 대거 활용했기 때문에 **개인 개발자도 충분히 따라할 수 있는 수준**이다.

## 중점 학습 및 실습 영역

| 우선순위 | 영역                                            | 왜 중요한가?                                                                                                                      | 학습 난이도    | 추천 학습 순서 & 자료                                                                                                                                  |
| -------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1        | **AI 에이전트 / LLM 활용 (코드 생성 & 자동화)** | Bilawal의 핵심: AI swarm으로 OSINT 자동 수집·처리·코드 작성. Claude 4.6 + Gemini 3.1 Pro를 써서 아키텍처 설계와 코드 대부분 생성. | ★★☆☆☆ (초중급) | 1순위. LangChain / LlamaIndex / AutoGen / CrewAI 배우기. Claude / Gemini / Grok API 실습. → 1~2주 집중.                                                |
| 2        | **Geospatial 데이터 처리 & 3D/4D 지도 렌더링**  | 3D 지구본 + 시간 축(4D) 구현. Google 3D Tiles, Cesium, Mapbox GL JS 기반.                                                         | ★★★☆☆ (중상급) | Cesium.js (무료, 강력) 또는 Mapbox GL JS + Timeline 라이브러리. Three.js 보조. → Bilawal이 Google 3D Tiles 썼을 가능성 높음.                           |
| 3        | **OSINT 데이터 소스 & API 통합**                | 공개 데이터(항공, 위성, GPS jamming, AIS 선박, CCTV 등) 자동 fetch.                                                               | ★★☆☆☆          | Flightradar24 ADS-B, MarineTraffic AIS, GPSJam, Sentinel Hub(위성), ACLED, Liveuamap 등 API/웹훅. Web scraping (BeautifulSoup/Selenium + AI로 자동화). |
| 4        | **시간 동기화 & 4D 재구성**                     | 분 단위 타임라인 슬라이더 + 이벤트 재생. 데이터에 timestamp 붙여 필터링/애니메이션.                                               | ★★★☆☆          | vis-timeline, D3.js timeline, 또는 Cesium의 Clock & Entity timeline 기능.                                                                              |
| 5        | **백엔드 & 실시간 아키텍처**                    | 데이터 저장·업데이트·푸시. AI 에이전트 swarm 병렬 실행.                                                                           | ★★★☆☆          | Node.js / Python(FastAPI) + WebSocket(Socket.io) 또는 Supabase/Firebase. Cron job + LangChain으로 자동화.                                              |
| 6        | **컴퓨터 그래픽스 & 시각화 효과**               | CRT, night vision, FLIR 필터 등 스타일링.                                                                                         | ★★★★☆ (옵션)   | Three.js post-processing, ShaderMaterial. Bilawal이 "retro-futuristic" 스타일 강조.                                                                    |

### 현실적인 학습·구현 로드맵 (서울 시간 기준, 1~3개월 목표)

1. **1~2주: AI 에이전트 기본 잡기** (가장 중요!)
   - Claude.ai / Gemini / Grok 무료로 써서 "이란 OSINT 데이터 fetch 스크립트 만들어줘" 프롬프트 연습.
   - LangChain 튜토리얼 (공식 docs + YouTube) → Tools + Agents 만들기.
   - 목표: 3~5개 API 동시에 호출하는 swarm 스크립트 완성.

2. **2~4주: 3D 지도 베이스라인 만들기**
   - Cesium Sandcastle (https://sandcastle.cesium.com/)에서 기본 3D globe + entity 추가 실습.
   - Mapbox GL JS + timestamp 필터링 예제 (이전 대화 코드 업그레이드).
   - 시간 슬라이더 붙이기 → vis-timeline + Cesium Clock 연동.

3. **4~6주: OSINT + AI 통합**
   - AI가 "Flightradar24 Tehran no-fly zone detect" 같은 쿼리로 데이터 pull → JSON으로 저장.
   - 백엔드 API 만들어 프론트에 실시간 푸시.
   - 캐시 사라짐 방지: 데이터를 즉시 DB(MongoDB or SQLite)에 dump.

4. **6주 이후: 4D 재현 & 폴리싱**
   - Timeline slider로 "2026-02-28 14:00 ~ 15:00" 스크럽 → 해당 시간대 이벤트만 표시.
   - 마커 색상/아이콘으로 이벤트 타입 구분 (공습=red, GPS jam=yellow 등).
   - Bilawal처럼 비디오 export 기능 추가 (Three.js → canvas 녹화).

### 현실적 난이도 & 팁

- **총 난이도**: 중상\~상 (코딩 경험이 있으면 1\~2개월, 없으면 3\~4개월).
- **비용**: 거의 무료 (API 무료 티어 + Cesium/Mapbox 무료 플랜 + LLM API $10~50/월).
- **가장 큰 도움**: **AI에게 코드 대부분 맡기기**. Bilawal처럼 "Claude야, Cesium에 Flightradar24 데이터를 overlay하는 React 컴포넌트 만들어줘" 식으로.
- **주의**: OSINT 스크래핑 시 robots.txt 준수, rate limit 지키기. 군사 민감 데이터라 "교육/연구용" 명시.
- **시작점**: GitHub에 "osint-geospatial" "cesium-osint" 검색 → 비슷한 오픈소스 fork해서 시작.

당신이 지금 어느 정도 코딩 수준인지(예: JS/Python 기본 아는지, API 써본 적 있는지) 알려주시면 더 구체적인 다음 스텝(특정 튜토리얼 링크, 코드 템플릿) 드릴게요.  
Bilawal처럼 "just vibe-coded" 해보는 재미가 쏠쏠할 거예요! 🚀
