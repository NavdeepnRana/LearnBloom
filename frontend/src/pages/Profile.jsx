import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      await api.patch('/auth/profile', payload);
      if (refreshUser) await refreshUser();
      setMessage('Profile settings saved successfully.');
      setForm((f) => ({ ...f, password: '', password_confirmation: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 70px)', padding: '4rem 0 6rem' }}>
        <div className="container" style={{ maxWidth: 580 }}>
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <span className="overline" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Account Settings
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-dark)', margin: 0 }}>
              Parent Profile
            </h1>
          </div>

          <div className="card" style={{ padding: '3rem', boxShadow: 'var(--shadow-lg)' }}>
            {message && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '1rem', borderRadius: 6, marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                {message}
              </div>
            )}
            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: 6, marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="label">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={onChange}
                  className="input"
                  placeholder="e.g. Sarah Jenkins"
                />
              </div>

              <div>
                <label className="label">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={onChange}
                  className="input"
                  placeholder="sarah@example.com"
                />
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                <span className="overline" style={{ display: 'block', marginBottom: '1rem' }}>
                  Change Password (Optional)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label className="label">New Password</label>
                    <input
                      name="password"
                      type="password"
                      minLength={8}
                      value={form.password}
                      onChange={onChange}
                      className="input"
                      placeholder="Leave blank to keep current password"
                    />
                  </div>
                  <div>
                    <label className="label">Confirm New Password</label>
                    <input
                      name="password_confirmation"
                      type="password"
                      value={form.password_confirmation}
                      onChange={onChange}
                      className="input"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
