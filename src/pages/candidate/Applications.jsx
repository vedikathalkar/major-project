import CandidateNav from '../../components/CandidateNav';
import AgentTrail from '../../components/AgentTrail';

const applications = [
  {
    id: 1,
    title: 'Backend engineer, associate',
    applied: 'Today',
    status: 'active',
    pill: { text: 'In review', cls: 'pill-warn' },
    agents: { parse: 'done', skill: 'done', experience: 'done', bias: 'done', assess: 'active' },
  },
  {
    id: 2,
    title: 'Data analyst, associate',
    applied: '1 week ago',
    status: 'scheduled',
    pill: { text: 'Interview scheduled', cls: 'pill-ok' },
    agents: { parse: 'done', skill: 'done', experience: 'done', bias: 'done', assess: 'done', rank: 'done', explain: 'done', schedule: 'done' },
  },
  {
    id: 3,
    title: 'ML engineer, associate',
    applied: '3 weeks ago',
    status: 'closed',
    pill: { text: 'Not selected', cls: 'pill-danger' },
    agents: { parse: 'done', skill: 'done', experience: 'done', bias: 'done', assess: 'done', rank: 'done', explain: 'done' },
  },
];

export default function Applications() {
  return (
    <div>
      <CandidateNav />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
        <p className="eyebrow">Status</p>
        <h1 style={{ marginTop: 8, marginBottom: 32 }}>Your applications</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {applications.map((app) => (
            <div key={app.id} className="card" style={{ padding: '22px 26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h3>{app.title}</h3>
                  <p style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 4 }}>Applied {app.applied}</p>
                </div>
                <span className={`pill ${app.pill.cls}`}>{app.pill.text}</span>
              </div>
              <AgentTrail status={app.agents} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
