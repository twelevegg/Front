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

## Admin Features Verification (Update 2026.01)

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


## Privacy & Security Updates (Update 2026.02)

추가/변경된 개인정보/보안 관련 기능입니다.

### 1. 회원가입 개인정보 수집·이용 동의(필수)

회원가입(Sign Up) 시 **개인정보 수집 및 이용 동의 체크(필수)** 추가.

동의하지 않으면 회원가입이 진행 x.


#### 📁 관련 파일:

SignUpPage.jsx

### 2. 비밀번호 규칙 안내(UX)

회원가입 시 비밀번호 강도(Strength) 안내

운영 환경에서는 프론트 검증 외에도 백엔드에서도 동일 정책 검증 필요.

#### 📁 관련 파일:

SignUpPage.jsx

### 3. 개인정보 표시 제한(마스킹)

통화기록 / 코파일럿 화면에서 인명 정보가 그대로 노출되지 않도록 마스킹 표시를 적용.

예: 김지민 → 김지*

주의: 프론트 마스킹은 “화면 표시”만 가립니다. 운영에서는 백엔드 응답 필드 제한/권한별 마스킹 정책도 함께 적용 필요.

#### 📁 관련 파일:

 CallHistoryPage.jsx / CoPilotModal.jsx / mask.js

### 4. 개인정보처리방침 링크/페이지 제공

로그인 페이지 하단에 개인정보처리방침 링크를 추가하여 개인정보처리방침 페이지에서 내용을 확인 가능.

처리방침 콘텐츠는 통신사 특성을 반영해 구성.

#### 📁 관련 파일:

LoginPage.jsx / PrivacyPolicyPage.jsx / PrivacyPolicyContent.jsx
