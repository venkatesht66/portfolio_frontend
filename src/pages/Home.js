import React, { useEffect, useState } from 'react';
import { fetchProjects, getAdminProfile, fetchExperiences, fetchCertifications } from '../api/api';
import ProjectCard from '../components/ProjectCard';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    setLoading(true);

    fetchProjects()
      .then(projRes => {
        setProjects(projRes.data || []);
        setError('');
      })
      .catch(err => {
        console.error('Home load error:', err);
        setError('Could not load projects or profile.');
      })
      .finally(() => {
        setLoading(false);
      });

    getAdminProfile()
      .then(profileRes => {
        setProfile(profileRes.data || null);
        setError('');
      })
      .catch(err => {
        console.warn("Public home cannot load profile");
        setProfile(null);
      })
      .finally(() => {
        setLoading(false);
      });

    fetchExperiences()
      .then(expRes => {
        setExperiences(expRes.data || null);
        setError('')
      })
      .catch(err => {
        console.error('Home load error:', err);
        setError('Could not load Experience');
      })
      .finally(() => {
        setLoading(false);
      });

    fetchCertifications()
      .then(certRes => {
        setCerts(certRes.data || null);
        setError('')
      })
      .catch(err => {
        console.error('Home load error:', err);
        setError('Could not load Certificates');
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  const name = profile?.name || 'Venkatesh';
  const bio = profile?.bio || 'Full Stack Developer • React • Node.js • MongoDB • AWS';
  const featured = profile?.featuredTechs?.length ? profile.featuredTechs : ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript'];

  return (
    <div>
      <div className="bg-shape bg-shape-1" aria-hidden></div>
      <div className="bg-shape bg-shape-2" aria-hidden></div>

      <div className="hero container">
        <div className="hero-card">
          <div className="kicker">Hello — I build web apps</div>
          <h1>Hi, I'm <span style={{ color: 'var(--accent)' }}>{name}</span>.<br />Full-Stack Developer focusing on scalable web systems.</h1>
          <p className="lead">{bio}</p>

          <div className="cta">
            <a className="btn" href="/projects">See Projects</a>
            <a className="btn secondary" href="/contact">Contact me</a>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {featured.map(t => <div key={t} className="small badge">{t}</div>)}
          </div>
        </div>

        <aside className="profile">
          <div className="avatar">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Avatar" />
            ) : (
              <span className="avatar-fallback">VT</span>
            )}
          </div>

          <h3>{name}</h3>
          <p style={{ color: 'var(--muted)' }}>{bio}</p>

          <div style={{ marginTop: 12 }}>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, justifyContent: 'center' }}>
              <a className="link-btn" href="https://mail.google.com/mail/?view=cm&fs=1&to=tvenkatesh457146@gmail.com" target="_blank" rel="noreferrer">Email</a>
              <a className="link-btn" href="https://github.com/venkatesht66" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </div>
        </aside>
      </div>

      <div className="container section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div className="kicker">Featured Work</div>
            <h2 style={{ margin: '6px 0' }}>Selected Projects</h2>
            <div className="lead-sm">A few projects demonstrating system design, full-stack skills and production readiness.</div>
          </div>
          <a className="btn small" href="/projects">View all</a>
        </div>

        {loading && <p style={{ marginTop: 18 }}>Loading projects…</p>}
        {error && <p style={{ color: 'salmon', marginTop: 18 }}>{error}</p>}

        {!loading && !error && (
          <div style={{ marginTop: 18 }} className="project-grid">
            {projects.length === 0 ? (
              <div className="card">No projects yet — add some from admin.</div>
            ) : projects.slice(0, 6).map(p => <ProjectCard key={p._id} project={p} />)}
          </div>
        )}
      </div>

      <div className="container section" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="kicker">Experience</div>
            <h2 style={{ margin: '6px 0' }}>Recent Experience</h2>
            <div className="lead-sm">Latest roles & internships — full list on the Experience page.</div>
          </div>
          <a className="btn small" href="/experience">View all</a>
        </div>
        {/* Experience preview */}
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
          {experiences.slice(0, 3).map(e => (
            <div key={e._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <strong>{e.title}</strong>
                  <div style={{ color: 'var(--muted)' }}>{e.company} • {e.type === 'internship' ? 'Internship' : 'Full-time'}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--muted)' }}>
                  {e.startDate ? new Date(e.startDate).toLocaleString().split(',')[0] : ''} - {e.endDate ? new Date(e.endDate).toLocaleString().split(',')[0] : 'Present'}
                </div>
              </div>
              <div style={{ marginTop: 8, color: 'var(--soft)', whiteSpace: 'pre-wrap' }}>{e.description ? (e.description.length > 200 ? e.description.slice(0, 200) + '…' : e.description) : ''}</div>
            </div>
          ))}
          {experiences.length === 0 && <div className="card">No experience added yet.</div>}
        </div>
      </div>
      {/* Certifications preview */}
      <div className="container section" style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="kicker">Certifications</div>
            <h2 style={{ margin: '6px 0' }}>Certifications</h2>
            <div className="lead-sm">Verified certificates and badges.</div>
          </div>
          {/* <a className="btn small" href="/experience#certs">Manage</a> */}
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {certs.slice(0, 6).map(c => (
            <a key={c._id} className="badge" href={c.url || '#'} target="_blank" rel="noreferrer">{c.title}{c.issuer ? ` — ${c.issuer}` : ''}</a>
          ))}
          {certs.length === 0 && <div style={{ color: 'var(--muted)', marginTop: 8 }}>No certifications yet.</div>}
        </div>
      </div>


    </div>
  );
}