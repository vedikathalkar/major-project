import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CandidateNav from '../../components/CandidateNav';
import { api } from '../../api';

export default function Apply() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [name, setName] = useState('Vedika Thalkar');
  const [email, setEmail] = useState('vedika.t@vit.edu.in');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const application = await api.createCandidate({
        name, email, job_id: Number(jobId),
      });
      if (file) {
        await api.uploadResume(application.candidate_id, file);
      }
      navigate('/assessment');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <CandidateNav />
      <main style={{ maxWidth: 560, margin: '0 auto', padding: '48px 24px' }}>
        <p className="eyebrow">Application · Job #{jobId}</p>
        <h1 style={{ marginTop: 8, marginBottom: 6 }}>Apply for this role</h1>
        <p style={{ color: 'var(--ink-500)', marginBottom: 32 }}>
          Upload your resume to begin. The parsing agent extracts your skills, experience, and projects automatically.
        </p>

        <div className="card" style={{ padding: 28 }}>
          <label className="field-label">Resume</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: `1.5px dashed ${dragOver ? 'var(--ink-800)' : 'var(--ink-300)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '32px 20px',
              textAlign: 'center',
              background: dragOver ? 'var(--ink-50)' : 'transparent',
              marginBottom: 20,
            }}
          >
            {file ? (
              <>
                <p style={{ fontWeight: 500, marginBottom: 4 }}>{file.name}</p>
                <p style={{ fontSize: 12, color: 'var(--ink-500)' }}>Ready to submit</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 13, color: 'var(--ink-500)', marginBottom: 12 }}>
                  Drag your resume here, or browse from your device
                </p>
                <label className="btn btn-secondary" style={{ display: 'inline-flex' }}>
                  Browse files
                  <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
                </label>
                <p style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 12 }}>PDF or DOCX, up to 5 MB</p>
              </>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="field-label">Full name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Contact email</label>
            <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
              Couldn't submit ({error}). Make sure the backend is running on localhost:8000.
            </p>
          )}

          <button
            className="btn btn-primary btn-block"
            disabled={!file || submitting}
            style={{ opacity: file && !submitting ? 1 : 0.5 }}
            onClick={submit}
          >
            {submitting ? 'Submitting...' : 'Submit application'}
          </button>
        </div>
      </main>
    </div>
  );
}
