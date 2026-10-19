import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';

export default function NewChild() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', gender: '', interests: '', additional_info: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');
    setLoading(true);
    try {
      const { data } = await api.post('/children', { ...form, age: parseInt(form.age) });
      // Redirect to assessment quiz
      navigate(`/assessments/${data.assessment._id}/take`);
    } catch (err) {
      const d = err.response?.data;
      if (d?.errors) {
        const errs = {};
        d.errors.forEach(({ path, msg }) => { errs[path] = msg; });
        setErrors(errs);
      } else {
        setServerError(d?.message || 'Failed to create profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh', padding: '4rem 0 8rem' }}>
        <div className="container">
          {serverError && (
            <div className="alert-error" style={{ maxWidth: 700, margin: '0 auto 2rem' }}>
              <svg width="20" height="20" fill="none" stroke="var(--color-accent)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              <span className="alert-text">{serverError}</span>
            </div>
          )}

          <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', maxWidth: 1100, margin: '0 auto' }}>
            {/* Left dark panel */}
            <div style={{ width: '40%', background: 'var(--color-dark)', padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)', display: 'block', marginBottom: '1.5rem' }}>METHODOLOGY</span>
                <h2 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: 'clamp(2rem, 3vw, 3rem)', lineHeight: 1.1, marginBottom: '3rem' }}>
                  <em>What happens<br />next.</em>
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  {[
                    ['01', 'Profile Setup', 'Enter the foundational details that will shape the AI\'s inquiry.'],
                    ['02', 'Contextual Analysis', 'Our LLM processes the interests to generate a unique 10-question quiz.'],
                    ['03', 'Deep Discovery', 'Final results are mapped against 6 core psychometric aptitude areas.'],
                  ].map(([n, t, d]) => (
                    <div key={n} style={{ display: 'flex', gap: '1.5rem' }}>
                      <span style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.25rem', minWidth: 28 }}>{n}</span>
                      <div>
                        <h4 style={{ color: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t}</h4>
                        <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', lineHeight: 1.6 }}>{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem' }}>
                <p style={{ color: '#4a4a4a', fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase' }}>mindbloom.in</p>
              </div>
            </div>

            {/* Right form */}
            <div style={{ flex: 1, background: 'white', padding: '3.5rem 4rem' }}>
              <div style={{ marginBottom: '3.5rem' }}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)', display: 'block', marginBottom: '0.75rem' }}>INITIALIZATION</span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '2.8rem', color: 'var(--color-dark)' }}>Child Profile.</h2>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Name */}
                <div>
                  <label className="input-label">Full Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange} className="input-field" placeholder="Enter the child's name" required />
                  {errors.name && <p className="input-error">{errors.name}</p>}
                </div>

                {/* Age + Gender */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div>
                    <label className="input-label">Age (5–18)</label>
                    <input name="age" type="number" min="5" max="18" value={form.age} onChange={handleChange} className="input-field" placeholder="e.g. 10" required />
                    {errors.age && <p className="input-error">{errors.age}</p>}
                  </div>
                  <div>
                    <label className="input-label">Gender</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {['male', 'female', 'other'].map((g) => (
                        <label key={g} style={{ flex: 1, cursor: 'pointer' }}>
                          <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={handleChange} style={{ display: 'none' }} required />
                          <div style={{
                            textAlign: 'center', border: `1px solid ${form.gender === g ? 'var(--color-dark)' : 'var(--color-dark)'}`,
                            borderRadius: 4, padding: '1rem 0.5rem', cursor: 'pointer', transition: 'all 0.2s',
                            background: form.gender === g ? 'var(--color-dark)' : 'white',
                            color: form.gender === g ? 'white' : 'var(--color-dark)',
                            fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                          }}>
                            {g}
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.gender && <p className="input-error">{errors.gender}</p>}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="input-label">Interests & Creative Outlets</label>
                  <textarea name="interests" rows="5" value={form.interests} onChange={handleChange} className="input-field" placeholder="e.g. Mathematics, oil painting, competitive swimming, piano performance..." required style={{ resize: 'vertical' }} />
                  {errors.interests && <p className="input-error">{errors.interests}</p>}
                </div>

                {/* Additional Info */}
                <div>
                  <label className="input-label">Additional Context <span style={{ opacity: 0.5, fontWeight: 400 }}>(optional)</span></label>
                  <textarea name="additional_info" rows="3" value={form.additional_info} onChange={handleChange} className="input-field" placeholder="Any additional information about the child..." style={{ resize: 'vertical' }} />
                </div>

                {/* Submit */}
                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-bg)' }}>
                  <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.25rem', fontSize: '0.75rem', letterSpacing: '0.25em', opacity: loading ? 0.7 : 1 }}>
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                        GENERATING AI QUESTIONS...
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        INITIALIZE ASSESSMENT FLOW
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
