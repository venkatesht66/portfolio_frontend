import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const navLinks = (
    <>
      <Link to="/" onClick={() => setOpen(false)}>Home</Link>
      <Link to="/projects" onClick={() => setOpen(false)}>Projects</Link>
      <Link to="/experience" onClick={() => setOpen(false)}>Experience</Link>
      <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
      <Link to="/admin" onClick={() => setOpen(false)}>Admin</Link>
    </>
  );

  return (
    <header>
      <div className="container header-inner">
        <div className="brand">
          <div className="logo">VT</div>
          <div style={{display:'flex', flexDirection:'column'}}>
            <strong style={{fontSize:16}}>Venkatesh T.</strong>
            <small style={{color:'var(--muted)', marginTop:2}}>Full Stack Developer</small>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="nav" aria-label="Main navigation">
          {navLinks}
        </nav>

        {/* Hamburger (visible on small screens) */}
        <button
          className={`hamburger ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
        </button>
      </div>

      {/* Mobile overlay menu */}
      <div className={`mobile-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      <nav className={`mobile-nav ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="mobile-nav-inner">
          <div className="mobile-brand">
            <div className="logo">VT</div>
            <div style={{marginLeft:12}}>
              <strong>Venkatesh T.</strong>
              <div style={{color:'var(--muted)', fontSize:13}}>Full Stack Developer</div>
            </div>
          </div>

          <div className="mobile-links" onClick={(e) => e.stopPropagation()}>
            {navLinks}
          </div>

          <div style={{marginTop:20}}>
            <a className="link-btn" href="https://mail.google.com/mail/?view=cm&fs=1&to=tvenkatesh457146@gmail.com" target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>Email</a>
            <a className="link-btn" href="tel:8309108618" style={{marginLeft:8}} onClick={() => setOpen(false)}>Call</a>
          </div>
        </div>
      </nav>
    </header>
  );
}