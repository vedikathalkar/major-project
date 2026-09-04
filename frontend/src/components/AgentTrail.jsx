const AGENTS = [
  { key: 'parse', label: 'Parsing' },
  { key: 'skill', label: 'Skill' },
  { key: 'experience', label: 'Experience' },
  { key: 'bias', label: 'Bias check' },
  { key: 'assess', label: 'Assessment' },
  { key: 'rank', label: 'Ranking' },
  { key: 'explain', label: 'Explain' },
  { key: 'schedule', label: 'Scheduling' },
];

// status: 'done' | 'active' | 'pending' for each agent key
export default function AgentTrail({ status = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {AGENTS.map((agent, i) => {
        const state = status[agent.key] || 'pending';
        const isLast = i === AGENTS.length - 1;
        const dotColor =
          state === 'done' ? 'var(--ink-950)' :
          state === 'active' ? 'var(--ink-800)' : 'var(--ink-100)';
        const lineColor = state === 'done' ? 'var(--ink-950)' : 'var(--ink-100)';

        return (
          <div key={agent.key} style={{ display: 'flex', alignItems: 'center', flex: isLast ? '0 0 auto' : 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: dotColor,
                boxShadow: state === 'active' ? '0 0 0 4px var(--ink-100)' : 'none',
              }} />
              <span style={{
                fontSize: 10, fontFamily: 'var(--font-mono)', color: state === 'pending' ? 'var(--ink-500)' : 'var(--ink-950)',
                whiteSpace: 'nowrap', textAlign: 'center',
              }}>
                {agent.label}
              </span>
            </div>
            {!isLast && (
              <div style={{ flex: 1, height: 1, background: lineColor, marginBottom: 16 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
