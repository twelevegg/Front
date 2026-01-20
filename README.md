# Front (CS-Navigator)

## Install
```bash
npm install
```

## Run (dev)
```bash
npm run dev
```

## Notes
- This project uses **Vite + React**.
- Tailwind v4 is wired via `@tailwindcss/vite` and `@import "tailwindcss"` in `src/styles/index.css`.
- Role-based sidebar:
  - role=admin: Admin Dashboard + Assistant Dashboard
  - role=assistant: Assistant Dashboard only
- `Training Center` shows a hover submenu: PPT 교육 / RolePlaying.
- CoPilot modal pops up on a simulated call event. Use the button on Call history page.

## Admin Features Verification (Update 2025.01)

최근 추가된 관리자 기능 및 알림 시스템 확인 방법입니다.

### 1. 로그인을 통한 관리자 권한 획득
- **방법**: 로그인 페이지에서 이메일 주소에 `admin`이라는 단어를 포함하여 로그인합니다. (예: `admin@company.com`)
- **결과**: 시스템이 자동으로 관리자(Admin) 권한을 부여하며 전용 대시보드로 이동합니다.

### 2. 주요 추가 기능
- **관리자 전용 분석 메뉴 (Sidebar)**: 
  - 좌측 메뉴에 `Admin Analysis` 섹션이 추가되었습니다.
  - **신규 상담사 이탈 예측**: 데이터 기반 이탈 위험군 목록 확인.
  - **번아웃 분석**: 팀별 스트레스 및 피로도 시각화 차트.
- **실시간 알림 시스템 (Topbar)**:
  - 우측 상단 사용자 프로필 옆에 **벨 아이콘**이 추가되었습니다.
  - 알림이 있을 시 **빨간 점(Badge)**이 표시됩니다.
  - 클릭 시 최근 알림 목록이 팝업으로 나타납니다.
  - 알림 항목을 클릭하면 **확장된 상세 뷰(600px)**로 이동하며, 상세 내용과 권장 조치를 확인할 수 있습니다.
  - 상세 뷰 상단의 **뒤로가기 화살표**를 통해 다시 목록으로 돌아갈 수 있습니다.

---
Replace the dev role switch in the topbar with your real login flow.

