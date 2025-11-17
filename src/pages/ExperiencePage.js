import React, { useEffect, useState } from 'react';
import { fetchExperiences, fetchCertifications } from '../api/api';

export default function ExperiencePage(){
  const [experiences, setExperiences] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(()=>{
    setLoading(true);
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
  },[]);

  const internships = experiences.filter(x => x.type === 'internship');
  const fulltime = experiences.filter(x => x.type === 'full-time');

  return (
    <div className="container" style={{paddingTop:24}}>
      <div className="kicker">Experience</div>
      <h1 style={{marginTop:6}}>Work & Internship Experience</h1>

      <section className="section" style={{marginTop:18}}>
        <h3>Full-time Roles</h3>
        {fulltime.length === 0 ? <div className="card">No full-time roles yet.</div> : (
          <div style={{display:'grid', gap:12}}>
            {fulltime.map(e => (
              <div className="card" key={e._id}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <div>
                    <strong>{e.title}</strong>
                    <div style={{color:'var(--muted)'}}>{e.company}</div>
                  </div>
                  <div style={{textAlign:'right', color:'var(--muted)', fontSize:13}}>
                    {e.startDate ? new Date(e.startDate).toLocaleDateString() : ''} - {e.endDate ? new Date(e.endDate).toLocaleDateString() : 'Present'}
                  </div>
                </div>
                <div style={{marginTop:8, whiteSpace:'pre-wrap', color:'var(--soft)'}}>{e.description}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section" style={{marginTop:18}}>
        <h3>Internships</h3>
        {internships.length === 0 ? <div className="card">No internships yet.</div> : (
          <div style={{display:'grid', gap:12}}>
            {internships.map(e => (
              <div className="card" key={e._id}>
                <div style={{display:'flex', justifyContent:'space-between'}}>
                  <div>
                    <strong>{e.title}</strong>
                    <div style={{color:'var(--muted)'}}>{e.company}</div>
                  </div>
                  <div style={{textAlign:'right', color:'var(--muted)', fontSize:13}}>
                    {e.startDate ? new Date(e.startDate).toLocaleDateString() : ''} - {e.endDate ? new Date(e.endDate).toLocaleDateString() : 'Present'}
                  </div>
                </div>
                <div style={{marginTop:8, whiteSpace:'pre-wrap', color:'var(--soft)'}}>{e.description}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section id="certs" className="section" style={{marginTop:18}}>
        <h3>Certifications</h3>
        {certs.length === 0 ? <div className="card">No certifications yet.</div> : (
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            {certs.map(c => (
              <a key={c._id} className="card" style={{padding:12, display:'inline-flex', flexDirection:'column'}} href={c.url || '#'} target="_blank" rel="noreferrer">
                <strong>{c.title}</strong>
                <div style={{color:'var(--muted)'}}>{c.issuer}</div>
                <div style={{fontSize:12, color:'var(--muted)', marginTop:6}}>{c.date ? new Date(c.date).toLocaleDateString() : ''}</div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}