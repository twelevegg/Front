import { apiFetchFast } from './client';

export function sendRPMessage({ sessionId, message, persona, start }) {
    return apiFetchFast('/ai/api/v1/rp', {
        method: 'POST',
        body: JSON.stringify({
            session_id: sessionId,
            message,
            persona,
            start,
        }),
    });
}
