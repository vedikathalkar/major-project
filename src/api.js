const BASE_URL = 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`${res.status}: ${detail}`);
  }
  return res.json();
}

export const api = {
  getJobs: () => request('/jobs'),
  getJob: (jobId) => request(`/jobs/${jobId}`),
  createJob: (data) => request('/jobs', { method: 'POST', body: JSON.stringify(data) }),

  getCandidates: (jobId) => request(jobId ? `/candidates?job_id=${jobId}` : '/candidates'),
  getCandidate: (candidateId) => request(`/candidates/${candidateId}`),
  createCandidate: (data) => request('/candidates', { method: 'POST', body: JSON.stringify(data) }),
  updateApplicationStatus: (applicationId, status) =>
    request(`/candidates/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  uploadResume: (candidateId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request(`/resumes/${candidateId}`, { method: 'POST', body: formData });
  },
};
