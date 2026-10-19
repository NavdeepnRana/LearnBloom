import React from 'react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-dark)', padding: '4rem 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: 36, height: 36, background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-serif)' }}>M</span>
              </div>
              <span style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700 }}>MindBloom</span>
            </div>
            <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 260 }}>
              AI-powered aptitude assessment for children aged 5–18. Discover potential, guide futures.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['How It Works', 'Features', 'Assessment Areas', 'PDF Reports'].map(item => (
                <a key={item} href="#" style={{ color: 'var(--color-muted)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--color-accent)'}
                  onMouseLeave={e => e.target.style.color = 'var(--color-muted)'}>
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Science</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {["Gardner's Framework", 'RIASEC Model', '6 Aptitude Dimensions', 'LLM Methodology'].map(item => (
                <a key={item} href="#" style={{ color: 'var(--color-muted)', textDecoration: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.875rem' }}>{item}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ color: 'white', fontFamily: 'var(--font-sans)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Aptitude Areas</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Logical-Analytical', 'Creative-Artistic', 'Athletic-Kinesthetic', 'Linguistic-Verbal', 'Scientific-Investigative', 'Social-Emotional'].map(item => (
                <span key={item} style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}>{item}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ color: '#4a4a4a', fontFamily: 'var(--font-sans)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase' }}>mindbloom.in</span>
          <span style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.75rem' }}>© {new Date().getFullYear()} MindBloom. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
