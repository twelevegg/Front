# CS-Navigator (Customer Service AI Assistant Platform)

**CS-Navigator**는 현대적인 고객 센터를 위한 올인원 AI 어시스턴트 플랫폼입니다. 상담사를 위한 실시간 가이드(CoPilot)부터 관리자를 위한 이탈 예측 및 번아웃 분석, 그리고 신입 상담사를 위한 AI 트레이닝 센터까지, 상담 업무의 전 라이프사이클을 혁신합니다.

## 💎 Brand Identity & Symbolism

<div align="center">
  <img src="./src/assets/logo_custom.jpg" alt="AICC Navigator Logo" width="150" style="border-radius: 16px;" />
</div>

<br />

### 1. 상징 및 형태 (Symbol & Shape)
- **알파벳 'A'와 연결성**: 심볼은 **AI(인공지능)**, **Assistant(어시스턴트)**, **Answer(해답)**의 첫 글자인 **'A'**를 형상화했습니다. 유기적으로 연결된 라인은 사람(상담사)과 AI, 그리고 고객 간의 끊김 없는 소통(Seamless Communication)을 상징합니다.
- **상승하는 모멘텀**: 우상향하는 라인은 상담을 통해 상황이 개선되고(Resolve), 고객 만족도가 상승하는(Ascend) 긍정적인 결과를 시각화했습니다.
- **원형과 방패 (Circle & Shield)**: 둥근 테두리는 '보호'와 '보안'을 의미합니다. 상담 데이터의 안전한 처리와 고객이 안심할 수 있는 서비스 환경을 제공하겠다는 약속입니다.

### 2. 색상 (Color Philosophy)
- **네이비 블루 (Trust Navy)**: 전문성, 침착함, 무한한 신뢰를 상징합니다. AI의 정확한 분석과 상담사의 차분한 대응을 의미합니다.
- **골드 (Value Gold)**: 지혜와 품격을 상징합니다. 단순한 응대를 넘어 고객에게 가치 있는 솔루션을 제공한다는 프리미엄 서비스의 본질을 담았습니다.

---

## 🎨 Design System: "Ethereal Professionalism"

본 프로젝트는 **'무게감 있는 전문성'**과 **'공기처럼 가벼운 사용성'**의 공존을 목표로 하는 **"Ethereal Professionalism"** 디자인 언어를 채택했습니다.

### 1. Glassmorphism 2.0 Architecture
단순한 투명도 조절을 넘어, **Multi-Layered Depth** 전략을 통해 정보의 위계(Hierarchy)를 시각적으로 구분합니다.
- **Base Layer (App Background)**: `#f6f8fb` (Cool Grey) - 눈의 피로를 최소화하는 중립적 배경.
- **Content Layer (Cards/Panels)**: `bg-white` + `border-slate-100` + `shadow-soft` - 명확한 경계와 물리적 안정감.
- **Floating Layer (Overlays)**: `backdrop-blur-md` + `bg-white/70` - 하위 컨텐츠의 맥락을 유지하면서 포커스를 가져오는 반투명 레이어.
    - *Implementation Check*: `Sidebar`와 `Topbar`에 적용되어 스크롤 시 컨텐츠가 뒤로 부드럽게 흐르는 효과 구현.

### 2. Micro-Interaction Physics
사용자의 모든 행동(Action)에 대해 **물리 법칙에 기반한 자연스러운 피드백**을 제공하여, 디지털 인터페이스가 아닌 실제 도구를 다루는 듯한 경험을 선사합니다.
- **Spring Animation**: 모든 인터랙티브 요소(버튼, 카드)에 기계적인 Linear 모션 대신 Spring Physics(`stiffness: 300`, `damping: 20`)를 적용했습니다.
    - *Effect*: 사용자가 버튼을 누르거나 카드를 호버할 때, 요소가 탄력적으로 반응하여 시스템이 '살아있는' 느낌을 줍니다.
- **Interaction Feedback**: `active:scale-95` (Tailwind Utility)를 전역 버튼 스타일로 표준화하여 클릭감을 시각적으로 전달합니다.

---

## 🛡️ Brand Compliance & UI Guidelines

본 프로젝트는 다중 테넌트(KT, SKT, LG U+) 환경을 지원하며, 각 통신사의 **Corporate Identity (CI) 가이드라인을 엄격히 준수**하여 UI를 디자인했습니다.

### 1. Logo Integrity & Safety Space
- **Originality**: 모든 워드마크(Logos)는 각 사가 제공한 **규정 원본 파일(SVG/PNG)**을 사용하며, 임의의 왜곡(비율 변경, 기울기 등)을 가하지 않았습니다.
- **Isolation (최소 공간 규정)**: 로고 주변에는 CI의 가시성 확보를 위한 충분한 **보호 공간(Clear Space)**을 확보했습니다. 좁은 UI 요소 내에서도 로고가 숨쉬는 공간을 유지합니다.

### 2. Brand Color Accuracy & Tenant-Adaptive System
각 테넌트의 공식 브랜드 컬러 규정을 준수하며, **Runtime Theme Injection** 아키텍처를 통해 사용자가 브랜드 아이덴티티를 명확히 인지할 수 있도록 구현했습니다.
- **KT**: `KT Red` (#ED1C24 / Pantone 1795C)
- **SKT**: `SKT Red` (#3617CE / Pantone 2126C)
- **LG U+**: `Magenta` (#EB008B / R235 G0 B139)
- **Brand Variables**: CSS Variables(`--color-kt`, `--color-skt`)를 기반으로 컴포넌트 레벨에서 동적으로 브랜드 컬러를 참조합니다.

### 3. Background Contrast & Visibility
- **Background Control**: 로고는 원칙적으로 White 또는 명확히 대비되는 배경 위에서 표현됩니다.
- **Mix-Blend Strategy**: 밝은 카드 UI 내에서 로고의 흰색 배경(Bounding Box)이 시각적으로 방해되지 않도록 `mix-blend-multiply` 등의 기법을 적용하여 로고 본연의 형태만 자연스럽게 부각되도록 처리했습니다.

---

## ⚡ UX Engineering & Technical Architecture

### 1. Navigation Rail & Spatial Layout
기존의 수직적(Top-down) 탐색 구조를 탈피하고, **Z-Pattern** 시선 흐름에 최적화된 **Left Navigation Rail** 구조를 채택했습니다.
- **Smart Collapsible Menus**: 'Training Center'와 같이 하위 메뉴가 많은 항목은 아코디언(Accordion) UI로 구현하되, 펼침 동작 시 `scrollIntoView` API를 활용하여 메뉴가 화면 밖으로 잘리지 않도록 **자동 스크롤 보정(Auto-Correction)** 로직이 내장되어 있습니다.
- **Sticky Context**: `Topbar`와 `Sidebar`는 스크롤과 무관하게 항상 접근 가능하도록 `sticky` 포지셔닝(`top-6`)을 적용하여 사용성을 극대화했습니다.

### 2. Headless UI + Compound Component Pattern
기능과 스타일을 분리하는 **Headless UI** 철학을 바탕으로, `Radix UI`의 접근성(Accessibility) 프리미티브 위에 `Tailwind CSS`로 커스텀 디자인을 입혔습니다.
- **Modal Architecture**: `Dialog.Portal`을 사용하여 모달을 DOM Tree의 최상위(`body`)로 렌더링(Portal)함으로써, 부모 요소의 `overflow: hidden`이나 `z-index` 제약으로부터 완전히 자유로운 오버레이를 구현했습니다.
    - **Z-Index Strategy**:
        - `CoPilot Modal`: **z-[100]** (최상위 긴급 업무)
        - `Notifications`: **z-50** (시스템 알림)
        - `Sticky Headers`: **z-40** (컨텐츠 헤더)

### 3. Real-time CoPilot Engine
상담의 핵심인 **CoPilot**은 단순한 UI가 아닌, 복잡한 상태를 관리하는 독립적인 애플리케이션처럼 설계되었습니다.
- **Context-Driven State**: `CoPilotProvider`를 통해 상담 세션, STT 로그, 추천(Recommendation), 고객 정보 등 방대한 상태를 전역적으로 관리하며 불필요한 Prop Drilling을 방지했습니다.
- **Ref-based Auto Scroll**: 실시간으로 쏟아지는 STT 로그의 가독성을 위해 `useRef`와 `LayoutEffect`를 결합하여, 새로운 대화가 추가될 때마다 스크롤을 부드럽게 최하단으로 이동시키는 로직이 최적화되어 있습니다.

---

## 🚀 Core Features & Business Modules

### 1. 🤖 AICC CoPilot (Real-time Assistant)
상담사가 고객과 통화하는 동안 실시간으로 AI가 보조하는 지능형 인터페이스입니다.
- **Layout Modes**: 상담사의 모니터 환경에 맞춰 `Compact Mode`(우측 사이드)와 `Expanded Mode`(전체 화면)를 즉시 전환할 수 있습니다.
- **Dual-Stream Processing**:
    - **Left Stream (STT)**: 고객과 상담사의 대화를 실시간 텍스트로 변환하여 표시.
    - **Right Stream (Intelligence)**: 대화 맥락을 분석하여 **'멘트 추천'**과 **'마케팅 상품 제안'**을 실시간 카드로 푸시(Push).

### 2. 📚 Case Library (Knowledge Base)
상담 조직의 집단 지성을 자산화하는 지식 공유 플랫폼입니다.
- **Intelligent Search**: 제목, 본문뿐만 아니라 `#태그` 기반의 필터링을 지원하여 유사 사례를 즉시 검색 가능합니다.
- **Visual Editing**: 직관적인 태그 관리와 텍스트 에디터를 통해 상담사가 손쉽게 우수 사례를 등록하고 수정할 수 있습니다(CRUD).

### 3. 🎓 AI Training Center
신입 상담사 교육을 위한 자동화된 트레이닝 파이프라인입니다.
- **Role Playing Simulation**:
    - **Persona Engine**: '악성 민원 고객', 'VIP', '고령 고객' 등 다양한 성향의 AI 페르소나와 채팅으로 실전 상담 연습.
    - **AI Coaching Report**: 롤플레잉 종료 즉시 AI가 대화 내용을 분석하여 '잘한 점', '고칠 점(개선된 답변 제안)', '성장 포인트'를 리포트로 생성.
- **PPT Training**: 교육 자료(PPT)를 업로드하면 AI가 핵심 내용을 추출하여 교육용 영상과 퀴즈를 자동 생성하는 콘텐츠 저작 도구.

### 4. 📊 Dashboard & Analytics
- **Assistant Dashboard**: 개인의 성과(KPI), 감정 노동 강도(Burnout Index), 최근 통화 이력을 한눈에 파악.
- **Admin Dashboard**: 팀 전체의 상담 현황, 리스크(이탈 위험 상담사) 감지, 실시간 이슈 모니터링 지원.

---

## 🛠 Tech Stack & Decision Matrix

본 프로젝트는 유행을 따르기보다 **"Real-time Internal Console"**이라는 비즈니스 요구사항에 최적화된 기술을 신중하게 선정했습니다.

### 1. Core Stack Selection
| Category | Technology | Selection Rationale (Why?) |
| :--- | :--- | :--- |
| **Build Tool** | **Vite** | Webpack 대비 10배 빠른 HMR 속도로 개발 효율 극대화. |
| **Styling** | **Tailwind CSS v4** | 런타임 오버헤드 없는(Zero-runtime) 고성능 스타일링 엔진. |
| **Animation** | **Framer Motion** | 자연스러운 물리 효과(Spring Physics) 구현을 위한 필수 선택. |
| **UI Base** | **Radix UI** | 접근성(A11y)은 보장하되 디자인 제약이 없는 Headless 컴포넌트. |

### 2. Architectural Decisions (Why NOT others?)

#### 🏗 Framework: Vite (SPA) vs Next.js (SSR)
우리는 **Next.js** 대신 **Vite + React SPA** 아키텍처를 선택했습니다.
- **Reason 1 (Nature of App)**: 본 서비스는 로그인 후 사용하는 폐쇄형 시스템으로, **SEO(검색 엔진 최적화)**가 불필요합니다. 따라서 SSR의 복잡성을 제거하고 클라이언트 사이드 렌더링(CSR)에 집중했습니다.
- **Reason 2 (Seamless UX)**: 상담 중 페이지 이동 시에도 **WebSocket 연결**과 **통화 맥락(Context)**이 끊기지 않아야 하므로, Full Page Reload가 없는 SPA 구조가 **State Persistence** 구현에 압도적으로 유리합니다.
- **Reason 3 (Infrastructure)**: 정적 빌드 파일을 S3/CDN에 배포하는 **Serverless Architecture**를 채택하여, 별도의 Node.js 서버 운영 비용과 유지보수 부담을 제거했습니다.

#### 🎨 Styling: Tailwind vs CSS-in-JS (Styled-components)
- **Performance First**: 대시보드 특성상 한 화면에 수천 개의 DOM 요소가 렌더링될 수 있습니다. 런타임에 스타일을 생성하는 CSS-in-JS 방식보다, 빌드 타임에 CSS를 생성하는 Tailwind가 렌더링 성능(FCP/LCP) 면에서 월등합니다.
- **Consistency**: 유틸리티 클래스 기반의 스타일링은 디자인 시스템의 토큰을 강제하기 쉬워, 장기적인 유지보수와 협업에 유리합니다.

---

## 📂 Project Architecture (Feature-Sliced Idea)

유지보수성과 확장성을 고려하여 기능(Feature) 단위로 응집도를 높인 폴더 구조를 채택했습니다.

```text
src/
├── app/                 # 앱 전역 설정 (Router, Constants)
├── components/          # 공용 UI 컴포넌트 (Design System Implementation)
│   ├── common/          # Toast, Modal, Loader 등 범용 유틸리티
│   └── ...              # Card, Button, Input 등 원자단위 컴포넌트
├── features/            # 비즈니스 도메인별 기능 모듈 (핵심 로직)
│   ├── auth/            # 인증 및 권한 관리
│   ├── calls/           # 통화 이력 및 상세 분석
│   ├── copilot/         # 실시간 코파일럿 엔진
│   ├── rpCopilot/       # 롤플레잉 시뮬레이션 엔진
│   └── training/        # 트레이닝 센터 로직
├── layouts/             # 페이지 레이아웃 구조 (AppLayout, AuthLayout)
├── pages/               # 라우팅 페이지 (View Layer)
│   ├── CallHistoryPage.jsx
│   ├── CaseLibraryPage.jsx
│   ├── training/        # 트레이닝 관련 페이지 그룹
│   └── ...
└── styles/              # Global Styles & Tailwind Configuration
```

---

## Privacy & Security Updates (Update 2026.02)

추가/변경된 개인정보/보안 관련 기능입니다.

### 1. 회원가입 개인정보 수집·이용 동의(필수)
- 회원가입(Sign Up) 시 **개인정보 수집 및 이용 동의 체크(필수)** 추가.
- 동의하지 않으면 회원가입이 진행되지 않습니다.
#### 📁 관련 파일:
`SignUpPage.jsx`

### 2. 비밀번호 규칙 안내(UX)
- 회원가입 시 비밀번호 강도(Strength) 안내
- 운영 환경에서는 프론트 검증 외에도 백엔드에서도 동일 정책 검증 필요.
#### 📁 관련 파일:
`SignUpPage.jsx`

### 3. 개인정보 표시 제한(마스킹)
- 통화기록 / 코파일럿 화면에서 인명 정보가 그대로 노출되지 않도록 마스킹 표시를 적용.
- 예: 김지민 → 김지*
- *주의: 프론트 마스킹은 “화면 표시”만 가립니다. 운영에서는 백엔드 응답 필드 제한/권한별 마스킹 정책도 함께 적용 필요.*
#### 📁 관련 파일:
`CallHistoryPage.jsx` / `CoPilotModal.jsx` / `mask.js`

### 4. 개인정보처리방침 링크/페이지 제공
- 로그인 페이지 하단에 개인정보처리방침 링크를 추가하여 개인정보처리방침 페이지에서 내용을 확인 가능.
- 처리방침 콘텐츠는 통신사 특성을 반영해 구성.
#### 📁 관련 파일:
`LoginPage.jsx` / `PrivacyPolicyPage.jsx` / `PrivacyPolicyContent.jsx`

---

## 🛠️ Troubleshooting & History

### 최근 해결된 이슈 (v2.1)
- **White Screen Issue**: `dashboardService.js` 내의 잘못된 import 구문(`default import` vs `named import`)으로 인한 런타임 에러 수정 완료.
- **Scroll Rendering**: 사이드바 및 모달 내 긴 컨텐츠 스크롤 시 발생하는 레이아웃 깨짐 현상을 `flex-1 min-h-0` 패턴과 `custom-scrollbar` 유틸리티로 해결.

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Recommended Account for Testing
-   **Admin**: `admin@test.com` (모든 대시보드 및 분석 기능 접근 가능)
-   **Assistant**: `user@test.com` (본인 대시보드 및 상담 이력만 접근 가능)
