import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HrSidebar from '../../components/HrSidebar';
import { api } from '../../api';

const statusPill = (status) => {
  const map = {
    submitted: { text: 'Submitted', cls: 'pill-neutral' },
    parsed: { text: 'Parsed', cls: 'pill-neutral' },
    in_review: { text: 'In review', cls: 'pill-warn' },
    shortlisted: { text: 'Shortlisted', cls: 'pill-ok' },
    scheduled: { text: 'Scheduled', cls: 'pill-ok' },
    rejected: { text: 'Not selected', cls: 'pill-danger' },
  };
  return map[status] || { text: status, cls: 'pill-neutral' };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [jobId, setJobId] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getJobs().then((data) => {
      setJobs(data);
      if (data.length) setJobId(data[0].job_id);
    }).catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (jobId == null) return;
    setLoading(true);
    api.getCandidates(jobId)
      .then((data) => data.sort((a, b) => (b.final_score || 0) - (a.final_score || 0)))
      .then(setCandidates)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [jobId]);

  const currentJob = jobs.find((j) => j.job_id === jobId);
  const metrics = [
    { label: 'Applicants', value: candidates.length },
    { label: 'Assessed', value: candidates.filter((c) => c.final_score != null).length },
    { label: 'Shortlisted', value: candidates.filter((c) => c.status === 'shortlisted').length },
    { label: 'Scheduled', value: candidates.filter((c) => c.status === 'scheduled').length },
  ];

  return (
    <div style={{ display: 'flex' }}>
      <HrSidebar />
      <main style={{ flex: 1, padding: '36px 44px', maxWidth: 980 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <p className="eyebrow">
              {currentJob ? currentJob.title : 'Loading...'}
            </p>
            <h1 style={{ marginTop: 8 }}>Candidate pipeline</h1>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {jobs.length > 1 && (
              <select className="input" style={{ width: 220 }} value={jobId || ''} onChange={(e) => setJobId(Number(e.target.value))}>
                {jobs.map((j) => <option key={j.job_id} value={j.job_id}>{j.title}</option>)}
              </select>
            )}
            <button className="btn btn-primary" onClick={() => navigate('/hr/post-job')}>Post a role</button>
          </div>
        </div>

        {error && (
          <p style={{ color: 'var(--danger)', marginBottom: 20 }}>
            Couldn't reach the backend ({error}). Make sure it's running on localhost:8000.
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
          {metrics.map((m) => (
            <div key={m.label} className="card" style={{ padding: '18px 20px' }}>
              <p style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 6 }}>{m.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>{m.value}</p>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--ink-100)' }}>
            <h3>Ranked candidates</h3>
          </div>
          {loading ? (
            <p style={{ padding: 22, color: 'var(--ink-500)' }}>Loading candidates...</p>
          ) : candidates.length === 0 ? (
            <p style={{ padding: 22, color: 'var(--ink-500)' }}>No applicants yet for this role.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', color: 'var(--ink-500)', fontSize: 12 }}>
                  <th style={{ padding: '10px 22px', fontWeight: 500 }}>Candidate</th>
                  <th style={{ padding: '10px 12px', fontWeight: 500 }}>Skill</th>
                  <th style={{ padding: '10px 12px', fontWeight: 500 }}>Experience</th>
                  <th style={{ padding: '10px 12px', fontWeight: 500 }}>Test</th>
                  <th style={{ padding: '10px 12px', fontWeight: 500 }}>Final</th>
                  <th style={{ padding: '10px 22px', fontWeight: 500 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => {
                  const pill = statusPill(c.status);
                  return (
                    <tr
                      key={c.application_id}
                      onClick={() => navigate(`/hr/candidate/${c.candidate_id}`)}
                      style={{ borderTop: '1px solid var(--ink-100)', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '14px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                          {c.candidate_name?.split(' ').map((n) => n[0]).join('') || '?'}
                        </div>
                        {c.candidate_name}
                      </td>
                      <td style={{ padding: '14px 12px' }}>{c.skill_score ?? '—'}</td>
                      <td style={{ padding: '14px 12px' }}>{c.experience_score ?? '—'}</td>
                      <td style={{ padding: '14px 12px' }}>{c.test_score ?? '—'}</td>
                      <td style={{ padding: '14px 12px', fontWeight: 500 }}>{c.final_score ?? '—'}</td>
                      <td style={{ padding: '14px 22px' }}>
                        <span className={`pill ${pill.cls}`}>{pill.text}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
