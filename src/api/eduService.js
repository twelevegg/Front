import { getFastApiBaseUrl, getSpringApiBaseUrl } from './client.js';
import { tokenStorage } from '../features/auth/tokenStorage.js';

function buildUrl(path) {
  const baseUrl = getFastApiBaseUrl();
  if (!baseUrl) {
    throw new Error('FAST API base URL is not configured');
  }
  return `${baseUrl}${path}`;
}

async function assertOk(res) {
  if (res.ok) return;
  const text = await res.text().catch(() => '');
  throw new Error(text || `API Error (${res.status})`);
}

// POST /api/v1/edu/jobs (multipart)
export async function createEduJob(file) {
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(buildUrl('/api/v1/edu/jobs'), {
    method: 'POST',
    body: form,
    credentials: 'include',
  });

  await assertOk(res);
  return res.json();
}

// POST /api/education/materials/secure-upload (Spring Boot)
export async function uploadToSpringSecurely(file) {
  const baseUrl = getSpringApiBaseUrl();
  const token = tokenStorage.get();
  const form = new FormData();
  form.append('file', file);

  const res = await fetch(`${baseUrl}/api/education/materials/secure-upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: form,
  });

  await assertOk(res);
  return res.json();
}


// GET /api/v1/edu/jobs/{job_id}
export async function getEduJob(jobId) {
  const res = await fetch(buildUrl(`/api/v1/edu/jobs/${jobId}`), {
    credentials: 'include',
  });
  await assertOk(res);
  return res.json();
}

// GET /api/v1/edu/jobs/{job_id}/video -> blob
export async function fetchEduVideoBlob(jobId) {
  const res = await fetch(buildUrl(`/api/v1/edu/jobs/${jobId}/video`), {
    credentials: 'include',
  });
  await assertOk(res);
  return res.blob();
}

// POST /api/v1/edu/jobs/{job_id}/grade
export async function gradeEduJob(jobId, userAnswers) {
  const res = await fetch(buildUrl(`/api/v1/edu/jobs/${jobId}/grade`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_answers: userAnswers }),
    credentials: 'include',
  });
  await assertOk(res);
  return res.json();
}

// POST /api/v1/edu/jobs/{job_id}/next
export async function nextEduRound(jobId) {
  const res = await fetch(buildUrl(`/api/v1/edu/jobs/${jobId}/next`), {
    method: 'POST',
    credentials: 'include',
  });
  await assertOk(res);
  return res.json();
}
