import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../lib/api';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const labels = ['logical', 'creative', 'athletic', 'linguistic', 'scientific', 'social'];

export default function AssessmentResults() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api
      .get(`/assessments/${id}/results`)
      .then(({ data: res }) => setData(res))
      .catch((err) => setError(err.response?.data?.message || 'Could not load results.'));
  }, [id]);

  const downloadReport = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('mb_token') || localStorage.getItem('token');
      const res = await fetch(`/api/assessments/${id}/report`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Could not download PDF');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aptitude-report-${data?.child?.name || 'child'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to generate report PDF: ' + e.message);
    } finally {
      setDownloading(false);
    }
  };

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
            <p style={{ color: 'var(--color-danger, #ef4444)', marginBottom: '1.5rem', fontWeight: 600 }}>{error}</p>
            <Link to="/dashboard" className="btn-dark">
              Return to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner" style={{ width: 44, height: 44, marginBottom: '1.5rem' }} />
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Analyzing Cognitive Profile...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const assessment = data.assessment || data;
  const child = data.child || assessment.child_id || {};
  const areas = assessment.aptitude_areas || {};
  const scores = labels.map((l) => areas[l] ?? 0);
  const topAptitude = assessment.top_aptitude || 'General Aptitude';
  const topScore = areas[topAptitude] ?? Math.max(...scores, 0);

  const barData = {
    labels: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [
      {
        label: 'Aptitude Score (%)',
        data: scores,
        backgroundColor: '#1a1f2c',
        borderRadius: 4,
      },
    ],
  };

  const radarData = {
    labels: labels.map((l) => l.charAt(0).toUpperCase() + l.slice(1)),
    datasets: [
      {
        label: 'Cognitive Profile',
        data: scores,
        backgroundColor: 'rgba(232, 98, 42, 0.25)',
        borderColor: '#e8622a',
        borderWidth: 2,
        pointBackgroundColor: '#e8622a',
        pointBorderColor: '#fff',
        pointRadius: 4,
      },
    ],
  };

  return (
    <>
      <Navbar />

      <div style={{ background: 'var(--color-bg)', minHeight: 'calc(100vh - 70px)', padding: '3.5rem 0 6rem' }}>
        <div className="container">
          {/* Back link */}
          <div style={{ marginBottom: '2rem' }}>
            <Link to={`/children/${child._id || child.id || ''}`} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ← Back to {child.name || 'Child Profile'}
            </Link>
          </div>

          {/* Hero Banner with Top Aptitude */}
          <div
            style={{
              background: 'var(--color-dark)',
              color: '#ffffff',
              borderRadius: 12,
              padding: '3rem 3.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '2rem',
              marginBottom: '3rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Primary Developmental Strength
              </span>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', color: '#ffffff', margin: '0.75rem 0', textTransform: 'capitalize', fontWeight: 900 }}>
                {topAptitude}
              </h1>
              {assessment.strength_sentence && (
                <p style={{ color: 'var(--color-border)', fontSize: '1.15rem', fontStyle: 'italic', maxWidth: 640, margin: '0.5rem 0 0', lineHeight: 1.5 }}>
                  &ldquo;{assessment.strength_sentence}&rdquo;
                </p>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(3.5rem, 5vw, 5rem)', fontWeight: 900, color: 'var(--color-accent)', lineHeight: 1 }}>
                {topScore}%
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Aptitude Index
              </span>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* Left Column: Summary, Charts, Career Hints */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {/* Comprehensive Summary Card */}
              <div className="card" style={{ padding: '2.5rem' }}>
                <span className="overline" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Psychometric Assessment
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-dark)', marginBottom: '1.25rem' }}>
                  Analysis Summary
                </h2>
                <p style={{ color: 'var(--color-dark)', opacity: 0.85, lineHeight: 1.8, fontSize: '1.05rem', margin: 0 }}>
                  {assessment.result_summary}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-accent">{child.name}</span>
                  <span className="badge badge-dark">Age: {child.age}</span>
                  {child.gender && <span className="badge badge-gold" style={{ textTransform: 'capitalize' }}>{child.gender}</span>}
                </div>
              </div>

              {/* Visual Analytics Charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--color-dark)' }}>
                    Aptitude Distribution
                  </h3>
                  <Bar
                    data={barData}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { max: 100, min: 0, ticks: { stepSize: 20 } },
                      },
                    }}
                  />
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--color-dark)' }}>
                    Radar Blueprint
                  </h3>
                  <Radar
                    data={radarData}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        r: { max: 100, min: 0, ticks: { stepSize: 25, display: false } },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Career Pathways & Recommendations */}
              {assessment.career_hints && assessment.career_hints.length > 0 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--color-dark)', marginBottom: '1.25rem' }}>
                    Recommended Growth Pathways
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {assessment.career_hints.map((hint, i) => (
                      <div
                        key={i}
                        className="card"
                        style={{
                          padding: '2rem',
                          background: i % 2 === 0 ? 'var(--color-card)' : '#1a1f2c',
                          color: i % 2 === 0 ? 'var(--color-dark)' : '#ffffff',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Pathway 0{i + 1}
                        </span>
                        <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: '0.5rem 0 0.75rem', color: i % 2 === 0 ? 'var(--color-dark)' : '#ffffff' }}>
                          {hint.title}
                        </h4>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.85, margin: 0 }}>
                          {hint.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Breakdown Sidebar & Actions */}
            <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="card" style={{ padding: '2rem' }}>
                <span className="overline" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  6 Dimension Scores
                </span>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--color-dark)' }}>
                  Aptitude Breakdown
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {Object.entries(areas).map(([area, score]) => (
                    <div key={area}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                        <span>{area}</span>
                        <span style={{ color: 'var(--color-accent)' }}>{score}%</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--color-bg)', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${score}%`,
                            background: area === topAptitude.toLowerCase() ? 'var(--color-accent)' : 'var(--color-dark)',
                            borderRadius: 3,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={downloadReport}
                    disabled={downloading}
                    className="btn-accent"
                    style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                  >
                    {downloading ? 'Generating PDF...' : 'Download Official PDF Report'}
                  </button>

                  <Link
                    to="/dashboard"
                    className="btn-outline"
                    style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
