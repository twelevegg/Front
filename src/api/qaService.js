
import { apiFetchFast } from './client';

export function qaReport(payload) {
    return apiFetchFast('/ai/api/v1/qa/report', {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}
