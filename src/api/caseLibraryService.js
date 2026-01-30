import { apiFetch } from './client.js';

export function fetchCaseLibraryList() {
  return apiFetch('/api/v1/case-library');
}

export function fetchCaseLibraryById(id) {
  return apiFetch(`/api/v1/case-library/${id}`);
}

export function createCaseLibrary(payload) {
  return apiFetch('/api/v1/case-library', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateCaseLibrary(id, payload) {
  return apiFetch(`/api/v1/case-library/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteCaseLibrary(id) {
  return apiFetch(`/api/v1/case-library/${id}`, {
    method: 'DELETE',
  });
}
