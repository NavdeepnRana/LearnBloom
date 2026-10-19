import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'var(--color-bg)',
      borderBottom: '1px solid var(--color-border)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, background: 'var(--color-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>M</span>
            </div>
            <span style={{ color: 'var(--color-dark)', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700 }}>MindBloom</span>
          </Link>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            <a href="/#how-it-works" style={{ color: 'var(--color-dark)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>How It Works</a>
            <a href="/#features" style={{ color: 'var(--color-dark)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Features</a>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>{user.name}</span>
              <Link to="/dashboard" className="btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.7rem' }}>Dashboard</Link>
              <Link to="/profile" style={{ color: 'var(--color-dark)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Profile</Link>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--color-dark)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Log In</Link>
              <Link to="/register" className="btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.7rem' }}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
