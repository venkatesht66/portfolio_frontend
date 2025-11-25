import React, { useEffect, useState } from 'react';
import { getAdminProfile } from '../api/api';

export default function Footer() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getAdminProfile()
      .then(res => setProfile(res.data || null))
      .catch(err => console.error('Footer profile load error:', err));
  }, []);

  const name = profile?.name || 'Venkatesh T';

  return (
    <footer>
      <div className="container footer-inner">
        <div>
          <strong style={{color:'var(--text)'}}>Venkatesh Tammisetty</strong>
          <div className="lead-sm">
            Full Stack Developer • React • Node • MongoDB • AWS
          </div>
        </div>

        <div style={{display:'flex', gap:12, alignItems:'center'}}>
          <a className="link-btn" href="https://mail.google.com/mail/?view=cm&fs=1&to=tvenkatesh457146@gmail.com" target="_blank" rel="noreferrer">Email</a>
          <a className="link-btn" href="https://github.com/venkatesht66" target="_blank" rel="noreferrer">GitHub</a>
          <a className="link-btn" href="https://www.linkedin.com/in/venkatesh-tammisetty-788233237/" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>

      <div style={{ padding: 18, textAlign: 'center', color: 'var(--muted)' }}>
        © {new Date().getFullYear()} • <span style={{color:'var(--accent)'}}>{name}</span> • Built with ❤️
      </div>
    </footer>
  );
}