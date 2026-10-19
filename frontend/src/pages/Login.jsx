import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const errs = {};
        data.errors.forEach(({ path, msg }) => { errs[path] = msg; });
        setErrors(errs);
      } else {
        setServerError(data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: 900, borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
        {/* Left dark panel */}
        <div style={{ width: '40%', background: 'var(--color-dark)', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '3rem' }}>
              <div style={{ width: 36, height: 36, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.25rem' }}>M</span>
              </div>
              <span style={{ color: 'white', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.25rem' }}>MindBloom</span>
            </Link>
            <h2 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              <em>Welcome<br />back.</em>
            </h2>
            <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Sign in to access your children's aptitude profiles and assessment history.
            </p>
          </div>
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem' }}>
            <p style={{ color: '#4a4a4a', fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase' }}>mindbloom.in</p>
          </div>
        </div>

        {/* Right form */}
        <div style={{ flex: 1, background: 'white', padding: '3rem 3.5rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)', display: 'block', marginBottom: '0.75rem' }}>SIGN IN</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '2.2rem', color: 'var(--color-dark)' }}>Log In.</h2>
          </div>

          {serverError && (
            <div className="alert-error">
              <svg width="20" height="20" fill="none" stroke="var(--color-accent)" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              <span className="alert-text">{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label className="input-label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required />
              {errors.email && <p className="input-error">{errors.email}</p>}
            </div>
            <div>
              <label className="input-label">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field" placeholder="••••••••" required />
              {errors.password && <p className="input-error">{errors.password}</p>}
            </div>
            <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-bg)' }}>
              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1.1rem', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Signing In...' : 'SIGN IN'}
                {!loading && <span style={{ marginLeft: 8 }}>→</span>}
              </button>
            </div>
          </form>

          <p style={{ marginTop: '2rem', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', color: 'var(--color-muted)', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-dark)', fontWeight: 700, textDecoration: 'none' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
