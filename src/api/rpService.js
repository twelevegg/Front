import { apiFetch } from './client';

export function sendRPMessage({ sessionId, message }) {
    return apiFetch('/api/v1/rp', {
        method: 'POST',
        body: JSON.stringify({
            session_id: sessionId,
            message,
        }),
    });
}
