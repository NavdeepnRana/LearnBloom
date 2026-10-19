import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../lib/api';

export default function AssessmentQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/assessments/${id}`)
      .then(({ data }) => {
        const assessment = data.assessment || data;
        if (assessment.result_summary || assessment.completed) {
          navigate(`/assessments/${id}/results`, { replace: true });
          return;
        }
        setChild(data.child || assessment.child_id);
        const qs = assessment.questions || [];
        setQuestions(qs);
        setAnswers(Array(qs.length).fill(''));
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load assessment.'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((current + 1) / questions.length) * 100);
  }, [current, questions.length]);

  const selectAnswer = (option) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = option;
      return next;
    });
  };

  const submit = async () => {
    if (answers.some((a) => !a)) {
      setError('Please answer every question before submitting.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/assessments/${id}/submit`, { answers });
      navigate(`/assessments/${id}/results`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assessment and generate analysis.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: 44, height: 44, marginBottom: '1.5rem' }} />
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Preparing Assessment Questions...
          </p>
        </div>
      </>
    );
  }

  if (!questions.length) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
            <p style={{ color: 'var(--color-danger, #ef4444)', marginBottom: '1.5rem', fontWeight: 600 }}>
              {error || 'No questions available for this assessment.'}
            </p>
            <button onClick={() => navigate('/dashboard')} className="btn-dark">
              Return to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const q = questions[current];

  return (
    <>
      <Navbar />

      {/* Top progress indicator bar */}
      <div style={{ width: '100%', height: 4, background: 'var(--color-border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'var(--color-accent)',
            transition: 'width 0.4s ease-in-out',
          }}
        />
      </div>

      <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 70px)', padding: '3.5rem 0 6rem' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {/* Header section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="overline" style={{ display: 'block', marginBottom: '0.4rem' }}>
                Cognitive Aptitude Assessment
              </span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-dark)', margin: 0 }}>
                {child?.name ? `${child.name}'s Evaluation` : 'Child Assessment'}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="badge badge-accent">
                Question {current + 1} of {questions.length}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-muted)' }}>
                {progress}%
              </span>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem 1.25rem', borderRadius: 6, marginBottom: '2rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {/* Question Card */}
          <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Question {current + 1}
              </span>
              {q.correct_area && (
                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                  {q.correct_area}
                </span>
              )}
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', lineHeight: 1.4, color: 'var(--color-dark)', marginBottom: '2rem' }}>
              {q.question}
            </h2>

            {/* Answer Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(q.options || []).map((option, idx) => {
                const isSelected = answers[current] === option;
                return (
                  <div
                    key={idx}
                    onClick={() => selectAnswer(option)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.1rem 1.4rem',
                      borderRadius: 8,
                      border: isSelected ? '2px solid var(--color-dark)' : '1px solid var(--color-border)',
                      background: isSelected ? 'var(--color-dark)' : 'var(--color-card)',
                      color: isSelected ? '#ffffff' : 'var(--color-dark)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: isSelected ? 600 : 500,
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        border: isSelected ? '2px solid var(--color-accent)' : '2px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isSelected ? 'var(--color-accent)' : 'transparent',
                        color: isSelected ? '#fff' : 'var(--color-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: '1rem', lineHeight: 1.4 }}>{option}</span>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <button
                type="button"
                disabled={current === 0}
                onClick={() => setCurrent((c) => c - 1)}
                className="btn-outline"
                style={{ opacity: current === 0 ? 0.3 : 1, cursor: current === 0 ? 'not-allowed' : 'pointer' }}
              >
                ← Previous
              </button>

              {current < questions.length - 1 ? (
                <button
                  type="button"
                  disabled={!answers[current]}
                  onClick={() => setCurrent((c) => c + 1)}
                  className="btn-outline"
                  style={{
                    opacity: !answers[current] ? 0.35 : 1,
                    cursor: !answers[current] ? 'not-allowed' : 'pointer',
                    background: answers[current] ? 'var(--color-dark)' : 'transparent',
                    color: answers[current] ? '#ffffff' : 'var(--color-dark)',
                    borderColor: 'var(--color-dark)',
                  }}
                >
                  Next Question →
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!answers[current] || submitting}
                  onClick={submit}
                  className="btn-accent"
                  style={{ opacity: !answers[current] || submitting ? 0.5 : 1, cursor: submitting ? 'wait' : 'pointer', minWidth: 160 }}
                >
                  {submitting ? 'Generating AI Analysis...' : 'Complete Assessment ✓'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
