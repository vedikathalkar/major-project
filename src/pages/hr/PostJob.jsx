import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HrSidebar from '../../components/HrSidebar';
import { api } from '../../api';

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', team: '', location: '', requirements: '', description: '',
    min_experience: 0, open_positions: 1,
    weight_skill: 40, weight_experience: 20, weight_test: 40,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const publish = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await api.createJob({
        ...form,
        min_experience: Number(form.min_experience),
        open_positions: Number(form.open_positions),
        weight_skill: Number(form.weight_skill),
        weight_experience: Number(form.weight_experience),
        weight_test: Number(form.weight_test),
      });
      navigate('/hr');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <HrSidebar />
      <main style={{ flex: 1, padding: '36px 44px', maxWidth: 680 }}>
        <p className="eyebrow">New role</p>
        <h1 style={{ marginTop: 8, marginBottom: 28 }}>Post a job requirement</h1>

        <div className="card" style={{ padding: 28 }}>
          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Role title</label>
            <input className="input" placeholder="e.g. Backend engineer, associate" value={form.title} onChange={set('title')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
            <div>
              <label className="field-label">Team</label>
              <input className="input" placeholder="e.g. Platform" value={form.team} onChange={set('team')} />
            </div>
            <div>
              <label className="field-label">Location</label>
              <input className="input" placeholder="e.g. Mumbai · Hybrid" value={form.location} onChange={set('location')} />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Required skills</label>
            <input className="input" placeholder="Comma separated, e.g. Python, FastAPI, PostgreSQL" value={form.requirements} onChange={set('requirements')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
            <div>
              <label className="field-label">Minimum experience (years)</label>
              <input className="input" type="number" value={form.min_experience} onChange={set('min_experience')} />
            </div>
            <div>
              <label className="field-label">Open positions</label>
              <input className="input" type="number" value={form.open_positions} onChange={set('open_positions')} />
            </div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <label className="field-label">Role description</label>
            <textarea className="input" rows={5} placeholder="What this person will own, and what success looks like in the first 6 months." value={form.description} onChange={set('description')} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="field-label">Scoring weights</label>
            <div style={{ display: 'flex', gap: 16 }}>
              {[['weight_skill', 'Skill'], ['weight_experience', 'Experience'], ['weight_test', 'Assessment']].map(([key, label]) => (
                <div key={key} style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 4 }}>{label}</p>
                  <input className="input" type="number" value={form[key]} onChange={set(key)} />
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
              Couldn't publish ({error}). Make sure the backend is running on localhost:8000.
            </p>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-primary" disabled={submitting} onClick={publish}>
              {submitting ? 'Publishing...' : 'Publish role'}
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/hr')}>Cancel</button>
          </div>
        </div>
      </main>
    </div>
  );
}
