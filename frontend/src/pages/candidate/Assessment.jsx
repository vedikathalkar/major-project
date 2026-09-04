import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateNav from '../../components/CandidateNav';

const questions = [
  {
    q: 'Your API needs to return partial results when one of three downstream services times out. What do you reach for first?',
    type: 'mcq',
    options: [
      'Fail the whole request so the client always gets consistent data',
      'Return available data with a field noting which service timed out',
      'Retry the timed-out service indefinitely before responding',
      'Cache the last successful response and always serve that instead',
    ],
  },
  {
    q: 'Describe a project where you had to optimize something for performance. What was the bottleneck and how did you find it?',
    type: 'text',
  },
];

export default function Assessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const question = questions[step];
  const progress = ((step) / questions.length) * 100;

  const setAnswer = (val) => setAnswers((a) => ({ ...a, [step]: val }));

  const next = () => {
    if (step < questions.length - 1) setStep(step + 1);
    else navigate('/applications');
  };

  return (
    <div>
      <CandidateNav />
      <main style={{ maxWidth: 620, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p className="eyebrow">Question {step + 1} of {questions.length}</p>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-800)' }}>18:42 remaining</span>
        </div>
        <div style={{ height: 4, background: 'var(--ink-100)', borderRadius: 4, marginBottom: 32, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--ink-950)', transition: 'width 0.3s' }} />
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ marginBottom: 20, lineHeight: 1.5 }}>{question.q}</h3>

          {question.type === 'mcq' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {question.options.map((opt) => (
                <label
                  key={opt}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '12px 14px', borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${answers[step] === opt ? 'var(--ink-800)' : 'var(--ink-100)'}`,
                    background: answers[step] === opt ? 'var(--ink-50)' : 'transparent',
                    cursor: 'pointer', fontSize: 14,
                  }}
                >
                  <input
                    type="radio"
                    name={`q-${step}`}
                    checked={answers[step] === opt}
                    onChange={() => setAnswer(opt)}
                    style={{ marginTop: 3 }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ) : (
            <textarea
              className="input"
              rows={6}
              placeholder="Write your answer here..."
              value={answers[step] || ''}
              onChange={(e) => setAnswer(e.target.value)}
            />
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn btn-primary" onClick={next}>
            {step < questions.length - 1 ? 'Next question' : 'Submit assessment'}
          </button>
        </div>
      </main>
    </div>
  );
}
