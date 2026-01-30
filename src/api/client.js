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

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'API Error');
    }

    if (res.status === 204) {
        return null;
    }

    const text = await res.text();
    if (!text) {
        return null;
    }
    return JSON.parse(text);
}
