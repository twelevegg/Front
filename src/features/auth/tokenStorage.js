const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

/**
 * Token storage.
 *
 * ✅ Backend 연동 시 변경 포인트
 * - access token만 저장(단순) vs refresh token까지 저장(권장: httpOnly cookie)
 * - 보안 정책에 따라 localStorage 대신 cookie/sessionStorage를 고려하세요.
 */
export const tokenStorage = {
  get() {
    return localStorage.getItem(ACCESS_KEY);
  },
  set(token) {
    localStorage.setItem(ACCESS_KEY, token);
  },
  getRefresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  setRefresh(token) {
    localStorage.setItem(REFRESH_KEY, token);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
};
