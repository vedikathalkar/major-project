import HrSidebar from '../../components/HrSidebar';

const scheduled = [
  { name: 'Ananya Rao', role: 'Backend engineer, associate', date: '24 Jul', time: '11:00 AM', mode: 'Google Meet' },
  { name: 'Rohan Mehta', role: 'Backend engineer, associate', date: '24 Jul', time: '2:30 PM', mode: 'Google Meet' },
  { name: 'Kabir Sethi', role: 'Data analyst, associate', date: '25 Jul', time: '10:00 AM', mode: 'On-site' },
];

const slots = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '2:00', '2:30', '3:00', '3:30'];

export default function Schedule() {
  return (
    <div style={{ display: 'flex' }}>
      <HrSidebar />
      <main style={{ flex: 1, padding: '36px 44px', maxWidth: 900 }}>
        <p className="eyebrow">Scheduling agent</p>
        <h1 style={{ marginTop: 8, marginBottom: 28 }}>Interview schedule</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          <div className="card">
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--ink-100)' }}>
              <h3>Upcoming interviews</h3>
            </div>
            <div>
              {scheduled.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 22px', borderTop: i > 0 ? '1px solid var(--ink-100)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                      {s.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--ink-500)' }}>{s.role}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{s.date}, {s.time}</p>
                    <p style={{ fontSize: 12, color: 'var(--ink-500)' }}>{s.mode}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ marginBottom: 14 }}>Book a new slot</h3>
            <label className="field-label">Candidate</label>
            <select className="input" style={{ marginBottom: 14 }}>
              <option>Sara Khan</option>
              <option>Devansh Iyer</option>
            </select>

            <label className="field-label">Date</label>
            <input className="input" type="date" defaultValue="2026-07-26" style={{ marginBottom: 14 }} />

            <label className="field-label">Available slots</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, margin: '8px 0 18px' }}>
              {slots.map((slot, i) => (
                <button
                  key={slot}
                  className="btn"
                  style={{
                    padding: '8px 10px', fontSize: 13,
                    background: i === 4 ? 'var(--ink-950)' : 'transparent',
                    color: i === 4 ? 'var(--ink-50)' : 'var(--ink-950)',
                    border: `1px solid ${i === 4 ? 'var(--ink-950)' : 'var(--ink-300)'}`,
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>

            <button className="btn btn-primary btn-block">Confirm and notify</button>
          </div>
        </div>
      </main>
    </div>
  );
}
