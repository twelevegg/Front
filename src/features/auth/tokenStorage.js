const KEY = 'access_token';

/**
 * Token storage.
 *
 * ✅ Backend 연동 시 변경 포인트
 * - access token만 저장(단순) vs refresh token까지 저장(권장: httpOnly cookie)
 * - 보안 정책에 따라 localStorage 대신 cookie/sessionStorage를 고려하세요.
 */
export const tokenStorage = {
  get() {
    return localStorage.getItem(KEY);
  },
  set(token) {
    localStorage.setItem(KEY, token);
  },
  clear() {
    localStorage.removeItem(KEY);
  }
};
