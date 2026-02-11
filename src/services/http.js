import { tokenStorage } from '../features/auth/tokenStorage.js';

// ✅ Backend 연동 시: .env에 VITE_API_BASE_URL 또는 VITE_API_BASE 설정
const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || '';

/**
 * Small fetch wrapper.
 * - Authorization 헤더 자동 첨부
 * - 401이면 토큰 제거
 */
export async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetchWithAuth(path, { method, body, headers });

  // ✅ Backend 연동 시: 401 정책(리프레시 토큰 등)에 따라 로직을 조정하세요.
  if (res.status === 401) {
    tokenStorage.clear();
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);
  console.log(data);

  if (!res.ok) {
    const message = (data && data.message) || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

async function fetchWithAuth(path, { method = 'GET', body, headers } = {}, retried = false) {
  const token = tokenStorage.get();

  // DEBUG: 계정 탈퇴 요청 시 토큰 로그 확인
  if (path === '/api/v1/auth/withdraw') {
    console.log(`[DEBUG] Requesting /withdraw with method: ${method}`);
    console.log(`[DEBUG] Token present: ${!!token}`);
    if (token) console.log(`[DEBUG] Token starts with: ${token.substring(0, 10)}...`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status !== 401 || retried || path === '/api/v1/auth/refresh') {
    return res;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    tokenStorage.clear();
    return res;
  }

  return fetchWithAuth(path, { method, body, headers }, true);
}

async function refreshAccessToken() {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });

    if (!res.ok) return null;

    const data = await res.json().catch(() => null);
    if (!data?.accessToken) return null;

    tokenStorage.set(data.accessToken);
    if (data.refreshToken) {
      tokenStorage.setRefresh(data.refreshToken);
    }
    return data.accessToken;
  } catch {
    return null;
  }
}
