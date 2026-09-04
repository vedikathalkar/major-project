import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HrSidebar from '../../components/HrSidebar';
import AgentTrail from '../../components/AgentTrail';
import { api } from '../../api';

const STATUS_TO_AGENTS = {
  submitted: {},
  parsed: { parse: 'done', skill: 'active' },
  in_review: { parse: 'done', skill: 'done', experience: 'done', bias: 'done', assess: 'active' },
  shortlisted: { parse: 'done', skill: 'done', experience: 'done', bias: 'done', assess: 'done', rank: 'done', explain: 'done' },
  scheduled: { parse: 'done', skill: 'done', experience: 'done', bias: 'done', assess: 'done', rank: 'done', explain: 'done', schedule: 'done' },
  rejected: { parse: 'done', skill: 'done', experience: 'done', bias: 'done', assess: 'done', rank: 'done', explain: 'done' },
};

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

export default function CandidateDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCandidate(id)
      .then(setCandidate)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <HrSidebar />
        <main style={{ flex: 1, padding: '36px 44px' }}>
          <p style={{ color: 'var(--ink-500)' }}>Loading candidate...</p>
        </main>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div style={{ display: 'flex' }}>
        <HrSidebar />
        <main style={{ flex: 1, padding: '36px 44px' }}>
          <p style={{ color: 'var(--danger)' }}>Couldn't load candidate ({error || 'not found'}).</p>
        </main>
      </div>
    );
  }

  const application = candidate.applications?.[0];
  const pill = statusPill(application?.status || 'submitted');
  const resume = candidate.resume;

  return (
    <div style={{ display: 'flex' }}>
      <HrSidebar />
      <main style={{ flex: 1, padding: '36px 44px', maxWidth: 780 }}>
        <button
          className="btn btn-secondary"
          style={{ marginBottom: 20, padding: '6px 14px', fontSize: 13 }}
          onClick={() => navigate('/hr')}
        >
          ← Back to pipeline
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div className="avatar" style={{ width: 50, height: 50, fontSize: 18 }}>
              {candidate.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h1 style={{ fontSize: 24 }}>{candidate.name}</h1>
              <p style={{ color: 'var(--ink-500)', fontSize: 13, marginTop: 4 }}>
                {application ? `Applied for ${application.job_title}` : 'No application on record'} · Candidate #{id}
              </p>
            </div>
          </div>
          <span className={`pill ${pill.cls}`}>{pill.text}</span>
        </div>

        <div className="card" style={{ padding: '22px 26px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 18 }}>Pipeline progress</p>
          <AgentTrail status={STATUS_TO_AGENTS[application?.status] || {}} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          {[
            { label: 'Skill score', value: application?.skill_score },
            { label: 'Experience score', value: application?.experience_score },
            { label: 'Test score', value: application?.test_score },
            { label: 'Final score', value: application?.final_score },
          ].map((m) => (
            <div key={m.label} className="card" style={{ padding: '16px 18px' }}>
              <p style={{ fontSize: 12, color: 'var(--ink-500)', marginBottom: 6 }}>{m.label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>{m.value ?? '—'}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '22px 26px' }}>
          <h3 style={{ marginBottom: 12 }}>Extracted profile</h3>
          {resume ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: 14 }}>
              <div>
                <p style={{ color: 'var(--ink-500)', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Skills</p>
                {resume.skills && resume.skills !== 'None detected' ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {resume.skills.split(',').map((s) => s.trim()).filter(Boolean).map((skill, i) => (
                      <span key={`${skill}-${i}`} className="pill pill-neutral">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: 'var(--ink-500)' }}>Not extracted yet</p>
                )}
              </div>
              <hr className="divider" />
              <div>
                <p style={{ color: 'var(--ink-500)', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Experience</p>
                <p style={{ lineHeight: 1.7 }}>{resume.experience || 'Not extracted yet'}</p>
              </div>
              <hr className="divider" />
              <div>
                <p style={{ color: 'var(--ink-500)', fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Education</p>
                <p style={{ lineHeight: 1.7 }}>{resume.education || 'Not extracted yet'}</p>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--ink-500)', fontSize: 14 }}>No resume uploaded for this candidate yet.</p>
          )}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button className="btn btn-primary" onClick={() => navigate('/hr/schedule')}>Schedule interview</button>
          <button className="btn btn-secondary">Reject with reason</button>
        </div>
      </main>
    </div>
  );
}
