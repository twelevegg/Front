import { tokenStorage } from '../features/auth/tokenStorage.js';

const SPRING_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const FAST_API_BASE_URL = import.meta.env.VITE_FAST_API_BASE_URL;

export function getSpringApiBaseUrl() {
    return SPRING_API_BASE_URL;
}

export function getFastApiBaseUrl() {
    return FAST_API_BASE_URL;
}

export async function apiFetch(path, options = {}) {
    return requestJson(SPRING_API_BASE_URL, path, options);
}

export async function apiFetchFast(path, options = {}) {
    return requestJson(FAST_API_BASE_URL, path, options);
}

async function requestJson(baseUrl, path, options) {
    if (!baseUrl) {
        throw new Error('API base URL is not configured');
    }

    const res = await fetchWithAuth(baseUrl, path, options);

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'API Error');
    }

    if (res.status === 204) {
        return null;
    }

    const text = await res.text();
    // console.log("API Response Text:", text); // Debug log
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("JSON Parse Error:", e, "Raw Text:", text);
        throw new Error("Invalid JSON response");
    }
}

async function fetchWithAuth(baseUrl, path, options, retried = false) {
    const token = tokenStorage.get();
    const res = await fetch(`${baseUrl}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        credentials: 'include', // 🔑 인증 대비
        ...options,
    });

    if (res.status !== 401 || retried || path === '/api/v1/auth/refresh') {
        return res;
    }

    const refreshed = await refreshAccessToken();
    if (!refreshed) {
        tokenStorage.clear();
        return res;
    }

    return fetchWithAuth(baseUrl, path, options, true);
}

async function refreshAccessToken() {
    if (!SPRING_API_BASE_URL) return null;
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${SPRING_API_BASE_URL}/api/v1/auth/refresh`, {
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
