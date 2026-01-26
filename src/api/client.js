const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include', // 🔑 인증 대비
        ...options,
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error || 'API Error');
    }

    return res.json();
}
