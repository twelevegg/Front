# CS-Navigator (Customer Service AI Assistant Platform)

**CS-Navigator**는 현대적인 고객 센터를 위한 올인원 AI 어시스턴트 플랫폼입니다. 상담사를 위한 실시간 가이드(CoPilot)부터 관리자를 위한 이탈 예측 및 번아웃 분석까지, 상담 업무의 모든 단계를 혁신합니다.

## 🎨 UI/UX Design Philosophy & Composition

본 프로젝트는 단순한 관리 도구가 아닌, 사용자가 **'몰입'**할 수 있는 프리미엄 경험을 제공하는 것을 목표로 설계되었습니다.

### 1. Glassmorphism & Modern Aesthetic
-   **Visual Hierarchy**: `bg-white/70`, `backdrop-blur` 등을 활용하여 레이어 간의 깊이감을 표현했습니다. 이는 사용자의 시선이 중요한 콘텐츠(활성 카드, 알림)에 자연스럽게 머물게 합니다.
-   **Soft Shadows & Rounded Corners**: `rounded-3xl`와 `shadow-soft`를 전반적으로 적용하여 딱딱한 시스템 느낌을 배제하고, 부드럽고 친근한 인터페이스를 구축했습니다.

### 2. Navigation Rail (Sidebar-First Layout)
기존의 상단 바(Topbar) 중심 레이아웃에서 **사이드바 중심의 Navigation Rail** 구조로 개편했습니다.
-   **Global Context Footer**: 로그아웃, 알림, 프로필 등 **전역 기능**을 사이드바 하단에 고정 배치했습니다.
    -   *Why?* 긴 페이지(Call History 등)를 스크롤할 때도 사용자가 언제든 중요 기능에 접근할 수 있도록 접근성을 극대화했습니다.
-   **Collapsible Menus (공간 최적화)**: 'Admin Analysis'와 'Training Center' 등 하위 메뉴가 많은 항목은 **드롭다운(Dropdown)** 형태로 구현하여, 사이드바 스크롤 없이 **한눈에 모든 메뉴를 파악**할 수 있도록 했습니다.

### 3. Smart Interaction (Overlay & Z-Index)
-   **Non-Intrusive Notifications**: 알림 모달은 사이드바 하단에서 **위쪽**(`bottom-full`)과 **오른쪽**(`left-14`)으로 펼쳐지도록 설계했습니다.
    -   *Reason*: 사이드바 메뉴를 가리지 않으면서도, 사용자의 작업 흐름을 방해하지 않는 'Floating Overlay' 경험을 제공합니다.
-   **Stacking Context Management**: Sidebar에 최상위 레이어(`z-50`)를 부여하여, 알림 창이 메인 콘텐츠의 Sticky Header나 리스트 위로 명확하게 떠오르도록 구현했습니다.

---

## 🛠 Technical Architecture

이 프로젝트는 확장성과 유지보수성을 고려하여 **Feature-Based Architecture**를 채택했습니다.

### Tech Stack
-   **Framework**: React 18 + Vite (Fast Build Speed)
-   **Styling**: Tailwind CSS v4 (Utility-First, Rapid UI Development)
-   **Animation**: Framer Motion (Natural Transitions & Micro-interactions)
-   **Components**: Radix UI (Accessible Primitives for Dialogs/Modals)
-   **Icons**: Lucide React (Clean & Consistent Iconography)

### Core Features & Implementation Details

#### 1. Authentication & Security
-   **Role-Based Access Control (RBAC)**: `AuthProvider`를 통해 사용자 권한(`admin` vs `assistant`)을 전역 관리합니다.
-   **Privacy Masking**: `maskName` 유틸리티를 활용하여 고객 이름 등 민감 정보를 UI 레벨에서 자동 마스킹처리합니다.

#### 2. Call History & Analysis
-   **Advanced Filtering**: 다양한 검색 조건과 감정(Sentiment) 필터를 통해 상담 이력을 쉽게 탐색합니다.
-   **Deep Dive Modal**: 상담 상세 분석 시, 내부 스크롤(`overflow-y-auto`)과 외부 컨테이너(`overflow-hidden`)를 분리하여 모달의 둥근 모서리 디자인을 유지하면서도 긴 콘텐츠를 표시합니다.

#### 3. Real-time CoPilot
-   **Event-Driven Architecture**: `window.dispatchEvent` 기반의 커스텀 이벤트를 사용하여, 상담 시작 시 어디서든 CoPilot 모달을 호출할 수 있습니다.
-   **Global Z-Index**: CoPilot 모달을 최상위(`z-[100]`)로 설정하여 모든 UI 요소 위에 오버레이되도록 보장합니다.

---

## 📂 Folder Structure Analysis

```text
src/
├── app/                 # 앱 전역 설정 (Routes, Constants)
├── components/          # 재사용 가능한 UI 컴포넌트 (Button, Card, Sidebar...)
├── features/            # 비즈니스 로직 단위 모듈 (Auth, Calls, CoPilot...)
├── layouts/             # 페이지 레이아웃 (AppLayout, AuthLayout)
├── pages/               # 라우트 페이지 컴포넌트
└── styles/              # Global Styling (Tailwind imports)
```

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
