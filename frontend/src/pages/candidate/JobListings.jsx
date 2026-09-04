import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateNav from '../../components/CandidateNav';
import { api } from '../../api';

export default function JobListings() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getJobs()
      .then(setJobs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <CandidateNav />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <p className="eyebrow">Open roles</p>
        <h1 style={{ marginTop: 8, marginBottom: 6 }}>Find a role worth applying to</h1>
        <p style={{ color: 'var(--ink-500)', marginBottom: 32 }}>
          Every application is screened by the same agent pipeline, so your resume gets read in full, not skimmed.
        </p>

        {loading && <p style={{ color: 'var(--ink-500)' }}>Loading roles...</p>}
        {error && (
          <p style={{ color: 'var(--danger)' }}>
            Couldn't reach the backend ({error}). Make sure it's running on localhost:8000.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.map((job) => (
            <div key={job.job_id} className="card" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <h3>{job.title}</h3>
                <p style={{ color: 'var(--ink-500)', fontSize: 13, marginTop: 6 }}>
                  {job.team} · {job.location} · {job.open_positions} open position{job.open_positions === 1 ? '' : 's'}
                </p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {(job.requirements || '').split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                    <span key={s} className="pill pill-neutral">{s}</span>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => navigate(`/apply/${job.job_id}`)}>
                Apply
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
