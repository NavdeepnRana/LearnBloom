import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/children')
      .then(({ data }) => setChildren(data.children))
      .catch(() => setError('Failed to load profiles.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        {/* Welcome band */}
        <div style={{ background: 'var(--color-dark)', padding: '4rem 0 5rem' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '1rem' }}>WELCOME BACK</span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', color: 'white' }}>
                <em>{user?.name}</em>
              </h1>
            </div>
            <Link to="/children/new" className="btn-accent" style={{ padding: '1.1rem 2.5rem' }}>NEW ASSESSMENT</Link>
          </div>
        </div>

        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '8rem' }}>
          {error && (
            <div className="alert-error" style={{ marginBottom: '2rem' }}>
              <svg width="20" height="20" fill="none" stroke="var(--color-accent)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              <span className="alert-text">{error}</span>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner" />
            </div>
          ) : children.length === 0 ? (
            <div style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 12, padding: '5rem', textAlign: 'center' }}>
              <div style={{ width: 96, height: 96, background: 'var(--color-bg)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', borderRadius: 0 }}>
                <svg width="40" height="40" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '2.2rem', color: 'var(--color-dark)', marginBottom: '1.25rem' }}>No Profiles Yet.</h3>
              <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 400, margin: '0 auto 3rem' }}>
                Your journey starts here. Create your first child profile to unlock personalized psychometric insights driven by AI.
              </p>
              <Link to="/children/new" className="btn-primary" style={{ padding: '1.1rem 3rem' }}>INITIALIZE FIRST PROFILE</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
              {children.map((child) => {
                const latestAssessment = child.assessments?.[0];
                return (
                  <div key={child._id} className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                      <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--color-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: 'white', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.25rem' }}>{child.name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--color-dark)', marginBottom: '0.25rem' }}>{child.name}</h3>
                        <p style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                          AGE {child.age} · {child.gender.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div style={{ flex: 1 }} />
                    <div style={{ borderTop: '1px solid var(--color-bg)', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <Link to={`/children/${child._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-dark)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-dark)'}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                          CHILD PROFILE
                        </span>
                        <span>→</span>
                      </Link>
                      {latestAssessment?.result_summary ? (
                        <Link to={`/assessments/${latestAssessment._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-dark)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-dark)'}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /></svg>
                            VIEW RESULTS
                          </span>
                          <span>→</span>
                        </Link>
                      ) : (
                        <Link to={`/children/${child._id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-accent)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            START ASSESSMENT
                          </span>
                          <span>→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
