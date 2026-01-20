import { request } from '../../services/http.js';

/**
 * Auth APIs.
 *
 * ✅ Backend 연동 시 변경 포인트
 * - 아래 mock 구현을 실제 엔드포인트로 교체하세요.
 * - 권장 응답 형태:
 *   - POST /auth/login  -> { accessToken, user: { id, name, email, role } }
 *   - POST /auth/signup -> { ok: true }
 *   - GET  /auth/me     -> { id, name, email, role }
 */

export async function loginApi({ email, password }) {
  // ✅ Backend 연동 시(예시)
  // return request('/auth/login', { method: 'POST', body: { email, password } });

  // ----- MOCK (삭제 예정) -----
  await new Promise((r) => setTimeout(r, 450));
  const role = email.toLowerCase().includes('admin') ? 'admin' : 'assistant';
  return {
    accessToken: 'demo-token',
    user: { id: 'u1', name: email.split('@')[0] || 'user', email, role }
  };
}

export async function signupApi({ name, email, password }) {
  // ✅ Backend 연동 시(예시)
  // return request('/auth/signup', { method: 'POST', body: { name, email, password } });

  // ----- MOCK (삭제 예정) -----
  await new Promise((r) => setTimeout(r, 450));
  return { ok: true };
}

export async function meApi() {
  // ✅ Backend 연동 시(예시)
  // return request('/auth/me');

  // ----- MOCK (삭제 예정) -----
  // token이 있다면 로그인 상태라고 가정
  return { id: 'u1', name: 'demo', email: 'demo@company.com', role: 'assistant' };
}
