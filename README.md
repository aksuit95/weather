[기획 명세서] 모던 지역 기반 날씨 정보 웹 서비스 (Atmosphere)1. 프로젝트 개요프로젝트명: Atmosphere (지역 기반 실시간 날씨 및 생활 기상 정보 웹 앱)목적: 사용자가 검색 및 지역 선택을 통해 직관적이고 시각화된 실시간 날씨, 예보, 생활 기상 지수를 확인 가능한 모던 웹 서비스 구축주요 타겟: 깔끔하고 직관적인 UI로 실시간 날씨 및 주간 예보를 빠르게 확인하고자 하는 일반 사용자 및 직장인핵심 기술 스택:Framework: React / Next.js (App Router)Styling: Tailwind CSSUI Component Library: shadcn/uiIcons: Lucide ReactData/API: OpenWeatherMap API 또는 기상청 단기예보 Open API2. 디자인 및 UI/UX 컨셉디자인 콘셉트: Glassmorphism & Neumorphism Mix (반투명 블러 효과 + 은은한 그라데이션)컬러 팔레트:Primary (주간/맑음): Sky Blue (#0ea5e9), Soft Indigo (#6366f1)Primary (야간/흐림): Deep Slate (#0f172a), Dark Navy (#1e1b4b)Background: dynamic gradient based on weather condition (날씨 및 주/야간 상태에 맞춰 동적 배경 변화)Card/Surface: bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20반응형 대응:Mobile First (360px ~)Tablet (768px ~)Desktop (1024px ~ 1440px+)3. 웹페이지 레이아웃 구조 (1-Page Dashboard)전체 UI는 싱글 페이지 레이아웃(Single Page Dashboard)으로 구성됩니다.+-----------------------------------------------------------------------+
| [Header] 로고 | 위치 자동 감지 버튼 | 지역 검색창(shadcn Command) | 테마 토글  |
+-----------------------------------------------------------------------+
| [Hero Area]                                                           |
|  - 현재 선택 지역 / 현재 시각                                          |
|  - 큰 날씨 아이콘 + 현재 기온 (℃)                                      |
|  - 날씨 상태 텍스트 (예: 체감 온도, 최저/최고 기온, 습도, 풍속)          |
+-----------------------------------------------------------------------+
| [Grid Section 1: 세부 기상 지수 카드 그룹]                              |
|  [ 미세먼지 / 초미세먼지 ]  [ 습도 / 이슬점 ]  [ UV 지수 ]  [ 일출 / 일몰 ]  |
+-----------------------------------------------------------------------+
| [Grid Section 2: 시간별 & 주간 예보]                                    |
|  - [Tabs] 시간별 예보 (24시간) | 7일간 주간 예보                         |
|  - 수평 스크롤 Carousel 카드로 온도 및 비 올 확률 표시                     |
+-----------------------------------------------------------------------+
| [Footer] 출처 및 업데이트 시각 정보                                       |
+-----------------------------------------------------------------------+
4. 컴포넌트별 상세 요구사항 및 shadcn/ui 매핑4.1. GNB / Header (Header.tsx)구성 요소:Logo: 브랜드 타이포그래피 + 애니메이션 날씨 아이콘 (SunMedium, CloudSun 등)Search Bar: shadcn/ui Command + Popover 활용한 자동완성 검색창한국 주요 시/군/구 및 해외 주요 도시 검색 가능최근 검색어 로컬스토리지 저장 기능GPS 버튼: Button (Icon: LocateFixed) 클릭 시 Browser Geolocation API를 통해 내 현재 위치 자동 조회Theme Toggle: Button 또는 DropdownMenu로 라이트/다크 모드 전환4.2. Main Weather Hero Section (WeatherHero.tsx)구성 요소:지역명 & 날짜: Card 상단에 큰 텍스트(Heading)로 현재 지역 표기 (Seoul, South Korea)현재 날씨 비주얼:Lucide 아이콘에 은은한 펄스/부유 애니메이션 적용 (motion 또는 CSS animation)메인 기온 표시 (text-6xl font-extrabold)핵심 상태 태그: shadcn/ui Badge 활용체감 온도: Feels like 22°최고/최저: H: 25°  L: 16°상태 설명: Partly Cloudy4.3. 상세 기상 지수 카드 Grid (WeatherMetricsGrid.tsx)구성 요소: shadcn Card 컴포넌트 4개를 2x2 (모바일) / 4x1 (데스크톱) 그리드로 배치공기질 지수 (AQI): 미세먼지(PM10) / 초미세먼지(PM2.5) 상태 표시 (Badge 색상 변화: 좋음/보통/나쁨)습도 & 바람: 습도(%) 및 풍속(m/s), 풍향 아이콘 표시자외선(UV) 지수: 자외선 단계 및 프로그레스 바 (Progress 컴포넌트 사용)일출 / 일몰: 일출 및 일몰 시간 + 시각적 타임라인4.4. 시간별 / 주간 예보 탭 (ForecastSection.tsx)구성 요소:Tab 스위처: shadcn/ui Tabs, TabsList, TabsTrigger ("24시간 예보" / "7일 예보")24시간 예보: 수평 스크롤 가능한 슬라이더 카드 형태 (Carousel 컴포넌트 활용)시간, 날씨 아이콘, 기온, 강수확률(%)7일 예보: 리스트 형태의 카드요일, 날씨 상태, 강수확률, 최소/최대 기온 범위 바(Progress Bar 형태)5. 데이터 처리 및 기능 요구사항 (Functional Requirements)기능 ID기능명상세 내용FN-01내 위치 기반 날씨 조회사용자가 접속 시 브라우저 위치 권한 승인 시 위도/경도 기반 날씨 데이터 연동FN-02지역 검색 및 자동완성도시 이름(한글/영문) 입력 시 검색 결과 노출 및 선택 시 해당 지역 날씨 로딩FN-03최근 검색 지역 저장LocalStorage에 최근 검색한 도시 최대 5개 저장 및 Quick Tag 클릭으로 바로가기 지원FN-04동적 배경 테마 적용날씨 상태(Sunny, Rainy, Snowy, Cloudy, Night)에 맞춰 배경 그라데이션 자동 변경FN-05단위 전환 (℃ / ℉)헤더에 섭씨/화씨 전환 Switch 추가하여 기온 단위 일괄 변경FN-06로딩 및 예외 처리API 호출 동안 shadcn Skeleton 컴포넌트로 스켈레톤 UI 제공, 에러 발생 시 Alert 메시지 출력6. 퍼포먼스 및 UX 디테일 가이드Skeleton Loading:데이터 로딩 중 레이아웃이 튀지 않도록 모든 Card 내부에 Skeleton 컴포넌트를 동일한 크기로 배치할 것.Glassmorphism styling:Tailwind CSS 클래스 패턴 예시:TypeScriptclassName="bg-white/30 dark:bg-slate-900/40 backdrop-blur-lg border border-white/20 dark:border-slate-800/50 shadow-xl rounded-3xl"
Micro-interactions:지역 변경 시 카드가 가볍게 Fade-in 되도록 Tailwind animate-in fade-in zoom-in-95 적용.버튼 클릭 시 active:scale-95 피드백 추가.7. 개발자 전달 및 제출용 인터페이스 요구 사항TypeScript// 주요 데이터 모델 규격 (Developer Reference)
interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  condition: 'Clear' | 'Clouds' | 'Rain' | 'Snow' | 'Thunderstorm';
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  aqi: {
    status: 'Good' | 'Moderate' | 'Unhealthy';
    pm10: number;
    pm25: number;
  };
  hourly: Array<{ time: string; temp: number; pop: number; condition: string }>;
  weekly: Array<{ day: string; tempMin: number; tempMax: number; condition: string }>;
}

## [개발 구현 단계]

각 단계는 이전 단계가 브라우저에서 동작한 뒤에 진행합니다. 기술 기준은 `masocampus-cursor-web-prj-rules2.mdc`를 따릅니다.

### 1단계. 앱 골격

- Shadcn UI, Zod, `nuqs`를 설치합니다.
- `src/components/ui`, `src/components/weather`, `src/lib`, `src/types` 구조를 만듭니다.
- 루트 레이아웃을 한국어(`lang="ko"`)로 바꿉니다.
- 헤더와 본문 영역, `loading.tsx`, `error.tsx`를 둡니다.
- 완료 기준: 기본 안내 화면 대신 빈 날씨 앱 껍데기가 보입니다.

### 2단계. 날씨 데이터 계층

- 외부 예보 API는 서버에서만 호출합니다.
- 응답을 현재 날씨, 시간별, 일별 타입으로 정규화합니다.
- 실패 시 사용자에게 보여줄 오류와 서버 로그를 나눕니다.
- API 키가 필요하면 서버 환경 변수로만 두고, 기동 시 Zod로 검증합니다.

### 3단계. 위치 선택

- 도시 검색과 좌표 조회를 연결합니다.
- 선택한 위치는 `nuqs`로 URL 쿼리에 남겨, 새로고침과 공유가 되게 합니다.
- 검색어가 없을 때의 기본 위치(서울)와 검색 결과 없음 상태를 포함합니다.

### 4단계. 현재 날씨

- 서버 컴포넌트에서 현재 기온, 하늘 상태, 체감 온도, 습도, 바람, 강수 확률을 가져와 카드로 보여줍니다.
- 위치 검색처럼 입력이 필요한 부분만 작은 클라이언트 컴포넌트로 둡니다.

### 5단계. 예보

- 오늘 시간별 예보와 이후 수일 일별 예보를 추가합니다.
- 로딩 중에는 Suspense와 스켈레톤을 씁니다.
- 시간대는 한국 시간으로 표시합니다.

### 6단계. 상태와 접근성

- API 실패, 빈 검색, 느린 응답을 각각 처리합니다.
- 모바일 우선 레이아웃, 키보드 조작, 명도 대비, 다크 모드를 맞춥니다.

### 7단계. 검증

- 날씨 값 변환과 오류 분기는 단위 테스트로 확인합니다.
- 검색 후 현재 날씨·예보가 바뀌는 흐름은 브라우저에서 확인합니다.

`next-safe-action`은 즐겨찾기 저장처럼 서버에서 데이터를 바꾸는 기능이 생길 때 넣습니다. 조회만 하는 동안에는 서버 컴포넌트의 `fetch`로 충분합니다.

1단계를 진행하기 전에 정할 항목:

1. 데이터 출처: API 키가 필요 없는 Open-Meteo, 또는 기상청 API
2. 1차 화면 범위: 현재 날씨 + 시간별 + 7일 예보
