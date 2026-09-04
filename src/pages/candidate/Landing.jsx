import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--ink-950)', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: 'var(--ink-100)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--ink-950)' }}>H</span>
          </div>
          <h1 style={{ color: 'var(--ink-50)', fontSize: 26 }}>Hirelune</h1>
          <p style={{ color: 'var(--ink-300)', marginTop: 8, fontSize: 14 }}>
            Agentic hiring, evaluated fairly and explained clearly.
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <div style={{ marginBottom: 16 }}>
            <label className="field-label">Email</label>
            <input className="input" placeholder="name@college.edu" defaultValue="vedika.t@vit.edu.in" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Password</label>
            <input className="input" type="password" placeholder="••••••••" defaultValue="password" />
          </div>
          <button className="btn btn-primary btn-block" onClick={() => navigate('/jobs')}>
            Sign in
          </button>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-500)', marginTop: 16 }}>
            New here? <span style={{ color: 'var(--ink-950)', fontWeight: 500 }}>Create an account</span>
          </p>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-500)', marginTop: 20 }}>
          Recruiting for a team? <span onClick={() => navigate('/hr')} style={{ color: 'var(--ink-100)', cursor: 'pointer', textDecoration: 'underline' }}>Go to the HR dashboard</span>
        </p>
      </div>
    </div>
  );
}
