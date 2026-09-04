import { NavLink } from 'react-router-dom';

const items = [
  { to: '/hr', label: 'Dashboard', end: true },
  { to: '/hr/post-job', label: 'Post a role' },
  { to: '/hr/schedule', label: 'Interview schedule' },
];

export default function HrSidebar() {
  return (
    <aside style={{
      width: 220, flexShrink: 0, background: 'var(--white)', borderRight: '1px solid var(--ink-100)',
      minHeight: '100vh', padding: '28px 18px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, padding: '0 8px' }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, background: 'var(--ink-950)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'var(--ink-100)', fontFamily: 'var(--font-display)', fontSize: 15 }}>H</span>
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Hirelune</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            style={({ isActive }) => ({
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14,
              fontWeight: isActive ? 500 : 400,
              background: isActive ? 'var(--ink-100)' : 'transparent',
              color: 'var(--ink-950)',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 40, padding: '0 8px' }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Signed in as</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>BT</div>
          <span style={{ fontSize: 13 }}>Bhanu Tekwani</span>
        </div>
      </div>
    </aside>
  );
}
