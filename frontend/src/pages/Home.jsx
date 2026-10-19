import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const bars = [
  ['Logical', 230], ['Creative', 160], ['Scientific', 190],
  ['Linguistic', 120], ['Athletic', 100], ['Social', 145],
];

const features = [
  ['PSYCHOMETRIC', 'Smart Engine', 'Proprietary algorithms based on established child psychology frameworks.', false],
  ['VISUALIZATION', 'Aptitude Charts', 'Interactive radar and bar charts for multi-dimensional analysis.', true],
  ['DOCUMENTATION', 'PDF Reports', 'Professional reports designed for educational advocacy and planning.', false],
  ['SECURITY', 'Privacy First', 'Enterprise-grade encryption for all developmental records.', true],
  ['MANAGEMENT', 'Family Hub', 'Track multiple children and their progress over time.', false],
  ['INTELLIGENCE', 'LLM Powered', 'Context-aware question generation for deep cognitive probing.', true],
];

const dimensions = [
  ['Logical-Analytical', 'Mathematical reasoning, pattern recognition, and systematic problem solving.'],
  ['Creative-Artistic', 'Visual expression, spatial imagination, and original concept generation.'],
  ['Athletic-Kinesthetic', 'Physical coordination, motor skills, and spatial awareness.'],
  ['Linguistic-Verbal', 'Narrative construction, vocabulary depth, and communicative clarity.'],
  ['Scientific-Investigative', 'Empirical curiosity, naturalistic observation, and causal analysis.'],
  ['Social-Emotional', 'Interpersonal empathy, self-regulation, and collaborative leadership.'],
];

export default function Home() {
  const { user } = useAuth();
  const [openDim, setOpenDim] = React.useState(null);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ background: 'var(--color-bg)', padding: '5rem 0 8rem', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ height: 2, width: 32, background: 'var(--color-accent)' }} />
                <span className="overline">Child Aptitude Assessment</span>
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: 'clamp(3rem, 5vw, 5rem)', lineHeight: 1.05, color: 'var(--color-dark)', marginBottom: '2.5rem' }}>
                Discover Your<br /><em style={{ fontStyle: 'italic', fontWeight: 700 }}>Child's Potential.</em>
              </h1>
              <div style={{ width: 40, height: 2, background: 'var(--color-accent)', marginBottom: '2rem' }} />
              <div style={{ marginBottom: '3rem' }}>
                {['PERSONALIZED QUESTIONS.', '6 APTITUDE AREAS.', 'INSTANT PDF REPORT.'].map(t => (
                  <p key={t} style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', letterSpacing: '0.12em', color: 'var(--color-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{t}</p>
                ))}
              </div>
              <Link to="/register" className="btn-outline" style={{ fontSize: '0.75rem', padding: '1rem 2rem' }}>
                START ASSESSMENT <span style={{ marginLeft: 8 }}>→</span>
              </Link>
            </div>

            {/* Hero card */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -16, background: 'rgba(232,98,42,0.05)', borderRadius: '50%', filter: 'blur(48px)' }} />
              <div style={{ position: 'relative', background: 'white', border: '1px solid var(--color-border)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.08)', transform: 'rotate(1.5deg)', transition: 'transform 0.7s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'rotate(0deg)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'rotate(1.5deg)'}>
                <svg viewBox="0 0 480 520" style={{ width: '100%', height: 'auto' }} fill="none">
                  <rect width="480" height="520" rx="16" fill="#ffffff" />
                  <path d="M0 16 C0 7.16344 7.16344 0 16 0 H464 C472.837 0 480 7.16344 480 16 V56 H0 V16 Z" fill="#1e293b" />
                  <text x="24" y="34" fill="#ffffff" fontFamily="DM Sans, sans-serif" fontSize="11" letterSpacing="3" fontWeight="500">APTITUDE REPORT</text>
                  <circle cx="456" cy="28" r="8" fill="#e8622a" />
                  <text x="24" y="90" fill="#8a8580" fontSize="10" letterSpacing="2.5" fontFamily="DM Sans, sans-serif" fontWeight="500">TOP APTITUDE AREA</text>
                  <text x="24" y="130" fill="#1e293b" fontFamily="Playfair Display, serif" fontSize="38" fontWeight="800" fontStyle="italic">Logical</text>
                  <text x="24" y="165" fill="#1e293b" fontFamily="Playfair Display, serif" fontSize="38" fontWeight="800" fontStyle="italic">Analytical</text>
                  <line x1="24" y1="185" x2="456" y2="185" stroke="#e0dbd2" strokeWidth="1" />
                  <text x="24" y="210" fill="#8a8580" fontSize="9" letterSpacing="2" fontFamily="DM Sans, sans-serif" fontWeight="500">APTITUDE BREAKDOWN</text>
                  {bars.map(([label, w], i) => {
                    const y = 235 + i * 28;
                    return (
                      <g key={label}>
                        <text x="24" y={y + 8} fill="#1e293b" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="500">{label}</text>
                        <rect x="160" y={y} width="270" height="8" rx="4" fill="#f0ece4" />
                        <rect x="160" y={y} width={w} height="8" rx="4" fill="#e8622a" />
                      </g>
                    );
                  })}
                  <line x1="24" y1="415" x2="456" y2="415" stroke="#e0dbd2" strokeWidth="1" />
                  <text x="24" y="445" fill="#8a8580" fontSize="9" letterSpacing="2" fontFamily="DM Sans, sans-serif" fontWeight="500">ASSESSMENT DATE</text>
                  <text x="24" y="465" fill="#1e293b" fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="500">May 2025</text>
                  <text x="260" y="445" fill="#8a8580" fontSize="9" letterSpacing="2" fontFamily="DM Sans, sans-serif" fontWeight="500">QUESTIONS</text>
                  <text x="260" y="465" fill="#1e293b" fontSize="13" fontFamily="DM Sans, sans-serif" fontWeight="500">10 Completed</text>
                  <rect x="170" y="490" width="140" height="22" rx="11" fill="#1e293b" />
                  <text x="240" y="505" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="DM Sans, sans-serif" letterSpacing="1">MindBloom Report</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section style={{ background: 'var(--color-dark)', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[['10', 'PERSONALIZED QUESTIONS'], ['6', 'APTITUDE DIMENSIONS'], ['PDF', 'INSTANT REPORT EXPORT']].map(([val, label], i) => (
              <div key={i} style={{ textAlign: 'center', padding: '2rem', borderRight: i < 2 ? '1px solid #2a2a2a' : 'none' }}>
                <div style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '4rem', fontStyle: 'italic' }}>{val}</div>
                <div style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.5rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: 'var(--color-bg)', padding: '8rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '5rem', alignItems: 'start' }}>
            <div>
              <span className="overline" style={{ display: 'block', marginBottom: '1rem' }}>METHODOLOGY</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '3.5rem', lineHeight: 1.1 }}>How It<br />Works.</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {[
                { n: '01', title: 'Create Profile', desc: 'Input basic developmental milestones and current interests.', dark: false },
                { n: '02', title: 'AI Assessment', desc: 'Engage with 10 dynamic questions generated by our LLM engine.', dark: true },
                { n: '03', title: 'Aptitude Report', desc: 'Receive a comprehensive PDF mapping your child\'s innate strengths.', dark: false },
              ].map(({ n, title, desc, dark }) => (
                <div key={n} style={{
                  background: dark ? 'var(--color-dark)' : 'white',
                  border: `1px solid ${dark ? 'var(--color-dark)' : 'var(--color-border)'}`,
                  borderRadius: 12, padding: '2.5rem', display: 'flex', alignItems: 'center', gap: '2.5rem',
                  transition: 'border-color 0.3s',
                }}
                  onMouseEnter={e => !dark && (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                  onMouseLeave={e => !dark && (e.currentTarget.style.borderColor = 'var(--color-border)')}>
                  <div style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-serif)', fontWeight: 900, fontSize: '3.5rem', fontStyle: 'italic', opacity: dark ? 1 : 0.5 }}>{n}</div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: dark ? 'white' : 'var(--color-dark)', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '0.75rem' }}>{title}</h3>
                    <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: 'white', padding: '8rem 0' }}>
        <div className="container">
          <div style={{ marginBottom: '5rem' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', display: 'block', marginBottom: '1rem' }}>CAPABILITIES</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '3.5rem', color: 'var(--color-dark)' }}>Engineered for Insight.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', border: '1px solid var(--color-border)', borderRight: 'none', borderBottom: 'none' }}>
            {features.map(([cat, title, desc, dark]) => (
              <div key={title} style={{
                background: dark ? 'var(--color-dark)' : 'white',
                padding: '3rem', borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)',
                transition: 'background 0.3s',
              }}
                onMouseEnter={e => !dark && (e.currentTarget.style.background = 'var(--color-warm)')}
                onMouseLeave={e => !dark && (e.currentTarget.style.background = 'white')}>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-accent)', display: 'block', marginBottom: '1.5rem' }}>{cat}</span>
                <h3 style={{ color: dark ? 'white' : 'var(--color-dark)', fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.4rem', marginBottom: '1rem' }}>{title}</h3>
                <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>{desc}</p>
                <a href="#" style={{ color: dark ? 'var(--color-accent)' : 'var(--color-dark)', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', textDecoration: 'none' }}>Learn more →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIMENSIONS */}
      <section style={{ background: 'var(--color-bg)', padding: '8rem 0' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <span className="overline" style={{ display: 'block', marginBottom: '1rem' }}>DIMENSIONS</span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '3.5rem', marginBottom: '4rem' }}>Measurement Index.</h2>
          <div style={{ borderTop: '1px solid var(--color-border)' }}>
            {dimensions.map(([name, desc]) => (
              <div key={name} style={{ borderBottom: '1px solid var(--color-border)', padding: '2rem 0', cursor: 'pointer' }} onClick={() => setOpenDim(openDim === name ? null : name)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.4rem', color: openDim === name ? 'var(--color-accent)' : 'var(--color-dark)', transition: 'color 0.2s' }}>{name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', display: 'none' }}>{desc}</p>
                    <span style={{ color: 'var(--color-accent)', fontSize: '1.5rem', transform: openDim === name ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', display: 'inline-block' }}>+</span>
                  </div>
                </div>
                {openDim === name && (
                  <p style={{ marginTop: '1rem', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 600 }}>{desc} — Additional detailed information about how we measure this specific aptitude area through our LLM-driven behavioral probing and pattern analysis.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--color-bg)', padding: '6rem 0' }}>
        <div className="container">
          <div style={{ background: 'var(--color-dark)', borderRadius: 16, padding: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '3rem', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="overline" style={{ display: 'block', marginBottom: '1.5rem' }}>THE NEXT CHAPTER</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '3.5rem', color: 'white', lineHeight: 1.1 }}>
                Start the Journey to<br /><em style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>Their Best Self.</em>
              </h2>
            </div>
            <Link to={user ? '/dashboard' : '/register'} className="btn-accent" style={{ fontSize: '0.75rem', padding: '1.25rem 2.5rem' }}>
              BEGIN ASSESSMENT
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
