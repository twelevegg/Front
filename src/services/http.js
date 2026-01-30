import { tokenStorage } from '../features/auth/tokenStorage.js';

// ✅ Backend 연동 시: .env에 VITE_API_BASE_URL 또는 VITE_API_BASE 설정
const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || '';

/**
 * Small fetch wrapper.
 * - Authorization 헤더 자동 첨부
 * - 401이면 토큰 제거
 */
export async function request(path, { method = 'GET', body, headers } = {}) {
  const token = tokenStorage.get();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  // ✅ Backend 연동 시: 401 정책(리프레시 토큰 등)에 따라 로직을 조정하세요.
  if (res.status === 401) {
    tokenStorage.clear();
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message = (data && data.message) || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}
