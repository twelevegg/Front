import { request } from '../../services/http.js';

/**
 * 회원가입 (PUBLIC)
 */

export async function loginApi({ tenantName, email, password }) {
  return request('/api/v1/auth/login', {
    method: 'POST',
    body: { tenantName, email, password }
  });
}

export async function signupApi({ tenantName, email, password, memberName, role }) {
  return request('/api/v1/auth/signup', {
    method: 'POST',
    body: { tenantName, email, password, memberName, role }
  });
}

/**
 * 내 정보 조회 (PROTECTED) - 토큰 붙이는 건 로그인 이후 단계에서 인터셉터로 처리하는게 일반적
 * 지금은 백엔드 미연결이면 실패할 수 있음(정상)
 */
export async function meApi() {
  return request('/api/v1/auth/me');
}

/**
 * 계정 탈퇴 (PROTECTED)
 * 백엔드 DELETE /api/v1/auth/withdraw
 * body에 { currentPassword: ... } 형태로 보냄
 */
export async function deleteAccountApi({ password }) {
  // DELETE 메소드에 body를 싣는 것은 표준이지만, fetch/axios 구현체에 따라 다를 수 있음.
  // 여기서는 request 유틸이 body를 지원한다고 가정.
  return request('/api/v1/auth/withdraw', {
    method: 'DELETE',
    body: { currentPassword: password }
  });
}
