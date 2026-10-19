import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../lib/api';

export default function ChildShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    api.get(`/children/${id}`)
      .then(({ data }) => {
        setChild(data.child);
        setAssessments(data.assessments);
      })
      .catch(() => setError('Child not found.'));
  }, [id]);

  const startNew = async () => {
    setStarting(true);
    setError('');
    try {
      const { data } = await api.post(`/children/${id}/new-assessment`);
      navigate(`/assessments/${data.assessment._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start assessment.');
    } finally {
      setStarting(false);
    }
  };

  if (!child && !error) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem', background: 'var(--color-bg)', minHeight: '100vh' }}>
          <div className="spinner" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <div style={{ background: 'var(--color-dark)', padding: '4rem 0 5rem' }}>
          <div className="container">
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '1rem' }}>CHILD PROFILE</span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'white', marginBottom: '0.5rem' }}>
              <em>{child?.name}</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
              AGE {child?.age} · {child?.gender?.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
          {error && (
            <div className="alert-error" style={{ marginBottom: '2rem' }}>
              <span className="alert-text">{error}</span>
            </div>
          )}

          {child && (
            <>
              <div className="card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)', display: 'block', marginBottom: '1rem' }}>INTERESTS & CREATIVE OUTLETS</span>
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1rem', color: 'var(--color-dark)', lineHeight: 1.7 }}>{child.interests}</p>
                {child.additional_info && (
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-muted)', lineHeight: 1.6, marginTop: '1rem' }}>{child.additional_info}</p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '2rem', color: 'var(--color-dark)' }}>Assessment History</h2>
                <button type="button" onClick={startNew} disabled={starting} className="btn-primary" style={{ padding: '1rem 2rem', opacity: starting ? 0.7 : 1 }}>
                  {starting ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      GENERATING...
                    </span>
                  ) : 'NEW ASSESSMENT'}
                </button>
              </div>

              {assessments.length === 0 ? (
                <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>No assessments yet. Start a new one above.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {assessments.map((a) => (
                    <div key={a._id} className="card" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--color-dark)' }}>
                          {new Date(a.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        {a.top_aptitude && (
                          <span className="tag" style={{ marginLeft: '1rem' }}>{a.top_aptitude}</span>
                        )}
                      </div>
                      {a.result_summary ? (
                        <Link to={`/assessments/${a._id}/results`} style={{ color: 'var(--color-accent)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                          VIEW REPORT →
                        </Link>
                      ) : (
                        <Link to={`/assessments/${a._id}`} style={{ color: 'var(--color-dark)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                          CONTINUE →
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '3rem' }}>
                <Link to="/dashboard" style={{ color: 'var(--color-muted)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  ← BACK TO DASHBOARD
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
