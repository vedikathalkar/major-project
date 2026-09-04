import { NavLink } from 'react-router-dom';

export default function CandidateNav() {
  const linkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--ink-950)' : 'var(--ink-500)',
    fontWeight: isActive ? 500 : 400,
    borderBottom: isActive ? '2px solid var(--ink-950)' : '2px solid transparent',
    paddingBottom: 4,
  });

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 40px', background: 'var(--white)', borderBottom: '1px solid var(--ink-100)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, background: 'var(--ink-950)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'var(--ink-100)', fontFamily: 'var(--font-display)', fontSize: 15 }}>H</span>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>Hirelune</span>
      </div>

      <nav style={{ display: 'flex', gap: 32, fontSize: 14 }}>
        <NavLink to="/jobs" style={linkStyle}>Job roles</NavLink>
        <NavLink to="/applications" style={linkStyle}>My applications</NavLink>
      </nav>

      <div className="avatar">VT</div>
    </header>
  );
}
