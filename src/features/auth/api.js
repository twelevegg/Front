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
