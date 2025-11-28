import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onDocPointer(e) {
      const menuEl = menuRef.current;
      const btnEl = btnRef.current;
      if (menuEl && menuEl.contains(e.target)) return;
      if (btnEl && btnEl.contains(e.target)) return;
      setOpen(false);
    }

    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onDocPointer);
    document.addEventListener('touchstart', onDocPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocPointer);
      document.removeEventListener('touchstart', onDocPointer);
      document.removeEventListener('keydown', onKey);
    };
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

        <nav className="nav" aria-label="Main navigation">
          {navLinks}
        </nav>

        <button
          ref={btnRef}
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

      <div
        className={`mobile-overlay ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
      />

      <nav
        ref={menuRef}
        className={`mobile-nav ${open ? 'open' : ''}`}
        aria-hidden={!open}
      >
        <div className="mobile-nav-inner" onClick={(e) => e.stopPropagation()}>
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
            <a
              className="link-btn"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=tvenkatesh457146@gmail.com"
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >
              Email
            </a>
            <a
              className="link-btn"
              href="tel:8309108618"
              style={{marginLeft:8}}
              onClick={() => setOpen(false)}
            >
              Call
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}