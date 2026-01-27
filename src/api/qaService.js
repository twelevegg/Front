
import { apiFetch } from './client';

export function qaReport(payload) {
    return apiFetch('/api/v1/qa/report', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
