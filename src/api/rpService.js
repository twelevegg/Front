import { apiFetchFast } from './client';

export function sendRPMessage({ sessionId, message }) {
    return apiFetchFast('/api/v1/rp', {
        method: 'POST',
        body: JSON.stringify({
            session_id: sessionId,
            message,
        }),
    });
}
