import React, { useEffect, useState } from 'react';
import {
  login,
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  setAuthToken,
  getAdminProfile,
  updateAdminProfile,
  fetchContacts,
  deleteContact,
  updateContact,
  fetchExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  fetchCertifications,
  createCertification,
  updateCertification,
  deleteCertification
} from '../api/api';

/* ---------------- Message detail modal ---------------- */
function MessageDetailModal({ open, onClose, message }) {
  if (!open || !message) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(2,6,23,0.6)', padding: 20
    }}>
      <div style={{ width: 'min(900px,95%)', background: 'var(--card)', borderRadius: 12, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0 }}>{message.name || 'Anonymous'}</h3>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
              {message.email && <span>{message.email}</span>}
              {message.phone && <span>{message.email ? ' • ' : ''}{message.phone}</span>}
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(message.createdAt).toLocaleString()}</div>
            </div>
          </div>
          <div>
            <button className="btn secondary small" onClick={onClose}>Close</button>
          </div>
        </div>

        <hr style={{ margin: '12px 0', borderColor: 'rgba(255,255,255,0.03)' }} />
        <div style={{ whiteSpace: 'pre-wrap', color: 'var(--soft)', lineHeight: 1.6 }}>{message.message}</div>
      </div>
    </div>
  );
}

/* ---------------- Experience Editor component ---------------- */
function ExperienceEditor({ onSave, onCancel, initial = null }) {
  const blank = {
    type: 'full-time',
    company: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    link: ''
  };
  const [form, setForm] = useState(initial || blank);

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm(blank);
  }, [initial]);

  const submit = async (e) => {
    e && e.preventDefault();
    await onSave(form);
    setForm(blank);
  };

  return (
    <form onSubmit={submit} className="contact-form" style={{ marginTop: 8 }}>
      <label>Type</label>
      <div style={{ display: 'flex', gap: 8 }}>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="radio" checked={form.type === 'full-time'} onChange={() => setForm(prev => ({ ...prev, type: 'full-time' }))} /> Full-time
        </label>
        <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input type="radio" checked={form.type === 'internship'} onChange={() => setForm(prev => ({ ...prev, type: 'internship' }))} /> Internship
        </label>
      </div>

      <label>Company</label>
      <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />

      <label>Role / Title</label>
      <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label>Start date</label>
          <input type="month" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
        </div>
        <div style={{ flex: 1 }}>
          <label>End date</label>
          <input type="month" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
        </div>
      </div>

      <label>Description</label>
      <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

      <label>Link (optional)</label>
      <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="company page, project, or certificate" />

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="btn" type="submit">Save</button>
        <button type="button" className="btn secondary" onClick={() => { setForm(blank); onCancel?.(); }}>Cancel</button>
      </div>
    </form>
  );
}

const BLANK_CERT = {
  title: '',
  issuer: '',
  date: '',
  url: ''
};

/* ---------------- Certification Editor ---------------- */
function CertificationEditor({ onSave, onCancel, initial = null }) {
  const blank = {
    title: '',
    issuer: '',
    date: '',
    url: ''
  };
  const [form, setForm] = useState(initial || blank);

  useEffect(() => {
    setForm(initial || BLANK_CERT);
  }, [initial]);

  const submit = async (e) => {
    e && e.preventDefault();
    await onSave(form);
    setForm(blank);
  };

  return (
    <form onSubmit={submit} className="contact-form" style={{ marginTop: 8 }}>
      <label>Title</label>
      <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />

      <label>Issuer</label>
      <input value={form.issuer} onChange={e => setForm({ ...form, issuer: e.target.value })} />

      <label>Date</label>
      <input type="month" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />

      <label>URL</label>
      <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="btn" type="submit">Save</button>
        <button type="button" className="btn secondary" onClick={() => { setForm(blank); onCancel?.(); }}>Cancel</button>
      </div>
    </form>
  );
}

/* ---------------- Main Admin page ---------------- */
export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const blankForm = { title: '', shortDescription: '', description: '', techStack: [], techInput: '', repoUrl: '', liveUrl: '', imageUrl: '' };
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [showProjectForm, setShowProjectForm] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [editingExperience, setEditingExperience] = useState(null); // object or null
  const [showExpForm, setShowExpForm] = useState(false);
  const [editingCertification, setEditingCertification] = useState(null);
  const [showCertForm, setShowCertForm] = useState(false);

  const loadData = async () => {
    setLoading(true); setStatus(null);
    try {
      const [projRes, profRes, contactsRes, exRes, certRes] = await Promise.all([
        fetchProjects(),
        getAdminProfile(),
        fetchContacts(),
        fetchExperiences(),
        fetchCertifications()
      ]);
      setProjects(projRes.data || []);
      setProfile(profRes.data || null);
      setContacts(contactsRes.data || []);
      setExperiences(exRes.data || []);
      setCertifications(certRes.data || []);
    } catch (err) {
      console.error('loadData error', err?.response?.status, err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Could not load admin data' });

      try { const r = await fetchProjects(); setProjects(r.data || []); } catch (e) { console.warn('proj fallback', e?.message); }
      try { const r = await getAdminProfile(); setProfile(r.data || null); } catch (e) { console.warn('profile fallback', e?.message); }
      try { const r = await fetchContacts(); setContacts(r.data || []); } catch (e) { console.warn('contacts fallback', e?.message); }
      try { const r = await fetchExperiences(); setExperiences(r.data || []); } catch (e) { console.warn('experiences fallback', e?.message); }
      try { const r = await fetchCertifications(); setCertifications(r.data || []); } catch (e) { console.warn('certs fallback', e?.message); }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadData();
    }
  }, [token]);

  const doLogin = async (e) => {
    e.preventDefault(); setStatus(null);
    try {
      const r = await login(email, password);
      const t = r.data.token;
      localStorage.setItem('token', t);
      setAuthToken(t);
      setToken(t);
      setStatus({ type: 'success', msg: 'Welcome back!' });
    } catch (err) {
      console.error('login failed', err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Login failed — check credentials' });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setToken('');
    setProjects([]);
    setProfile(null);
    setContacts([]);
    setExperiences([]);
    setCertifications([]);
    setEmail('');
    setPassword('');
    setStatus({ type: 'success', msg: 'Logged out' });
  };

  /* ---------- Projects ---------- */
  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || '',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      techStack: p.techStack || [],
      techInput: '',
      repoUrl: p.repoUrl || '',
      liveUrl: p.liveUrl || '',
      imageUrl: p.imageUrl || ''
    });
    setShowProjectForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addTech = (v) => {
    if (!v) return;
    if (!form.techStack.includes(v)) setForm(prev => ({ ...prev, techStack: [...prev.techStack, v], techInput: '' }));
  };

  const removeTech = (t) => setForm(prev => ({ ...prev, techStack: prev.techStack.filter(x => x !== t) }));

  const submitProject = async (e) => {
    e.preventDefault();
    setSaving(true); setStatus(null);
    if (!form.title || !form.shortDescription || !form.description) {
      setStatus({ type: 'error', msg: 'Title, short description and description are required' });
      setSaving(false); return;
    }
    const payload = {
      title: form.title, shortDescription: form.shortDescription, description: form.description,
      techStack: form.techStack, repoUrl: form.repoUrl, liveUrl: form.liveUrl, imageUrl: form.imageUrl
    };
    try {
      if (editingId) {
        const r = await updateProject(editingId, payload);
        setProjects(prev => prev.map(p => p._id === editingId ? r.data : p));
        setStatus({ type: 'success', msg: 'Project updated' });
      } else {
        const r = await createProject(payload);
        setProjects(prev => [r.data, ...prev]);
        setStatus({ type: 'success', msg: 'Project created' });
      }
      setForm(blankForm);
      setEditingId(null);
      setShowProjectForm(false);
    } catch (err) {
      console.error('submitProject err', err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Save failed' });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
      setStatus({ type: 'success', msg: 'Project deleted' });
    } catch (err) {
      console.error('delete err', err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Delete failed' });
    }
  };

  /* ---------- Profile (admin) ---------- */
  const updateProfile = async (updates) => {
    setStatus(null);
    try {
      const r = await updateAdminProfile(updates);
      setProfile(r.data);
      setStatus({ type: 'success', msg: 'Profile updated' });
    } catch (err) {
      console.error('updateProfile err', err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Profile update failed' });
    }
  };

  /* ---------- Contacts (messages) ---------- */
  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteContact(id);
      setContacts(prev => prev.filter(c => c._id !== id));
      setStatus({ type: 'success', msg: 'Message deleted' });
    } catch (err) {
      console.error('deleteContact err', err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Delete failed' });
    }
  };

  const toggleKeepContact = async (id, currentSaved) => {
    try {
      const r = await updateContact(id, { saved: !currentSaved });
      setContacts(prev => prev.map(c => c._id === id ? r.data : c));
      setStatus({ type: 'success', msg: !currentSaved ? 'Message kept' : 'Message unmarked' });
    } catch (err) {
      console.error('toggleKeepContact err', err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Update failed' });
    }
  };

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    setModalOpen(true);
  };

  /* ---------- Experiences ---------- */
  const onSaveExperience = async (data) => {
    setStatus(null);
    try {
      if (editingExperience && editingExperience._id) {
        const r = await updateExperience(editingExperience._id, data);
        setExperiences(prev => prev.map(x => x._id === editingExperience._id ? r.data : x));
        setStatus({ type: 'success', msg: 'Experience updated' });
      } else {
        const r = await createExperience(data);
        setExperiences(prev => [r.data, ...prev]);
        setStatus({ type: 'success', msg: 'Experience added' });
      }
      setEditingExperience(null);
      setShowExpForm(false);
    } catch (err) {
      console.error('experience save err', err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Save failed' });
    }
  };

  const onEditExperience = (exp) => {
    setEditingExperience(exp);
    setShowExpForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDeleteExperience = async (id) => {
    if (!window.confirm('Delete this experience?')) return;
    try {
      await deleteExperience(id);
      setExperiences(prev => prev.filter(x => x._id !== id));
      setStatus({ type: 'success', msg: 'Experience deleted' });
    } catch (err) {
      console.error('delete experience err', err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Delete failed' });
    }
  };

  /* ---------- Certifications ---------- */
  const onSaveCertification = async (data) => {
    setStatus(null);
    try {
      if (editingCertification && editingCertification._id) {
        const r = await updateCertification(editingCertification._id, data);
        setCertifications(prev => prev.map(x => x._id === editingCertification._id ? r.data : x));
        setStatus({ type: 'success', msg: 'Certification updated' });
      } else {
        const r = await createCertification(data);
        setCertifications(prev => [r.data, ...prev]);
        setStatus({ type: 'success', msg: 'Certification added' });
      }
      setEditingCertification(null);
      setShowCertForm(false);
    } catch (err) {
      console.error('cert save err', err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Save failed' });
    }
  };

  const onEditCertification = (c) => {
    setEditingCertification(c);
    setShowCertForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDeleteCertification = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await deleteCertification(id);
      setCertifications(prev => prev.filter(x => x._id !== id));
      setStatus({ type: 'success', msg: 'Certification deleted' });
    } catch (err) {
      console.error('delete cert err', err?.response?.data || err?.message);
      setStatus({ type: 'error', msg: 'Delete failed' });
    }
  };

  if (!token) {
    return (
      <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="login-grid">
          <div>
            <div className="card" style={{ padding: 28, borderRadius: 16 }}>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <div style={{
                  width: 84, height: 84, borderRadius: 20, background: 'linear-gradient(135deg,#4f46e5,#06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 30, fontWeight: 800
                }}>🔒</div>

                <div>
                  <h2 style={{ margin: 0 }}>Admin access required</h2>
                  <p style={{ marginTop: 8, color: 'var(--muted)' }}>
                    Only the administrator can sign in to manage content.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                <button className="btn" onClick={() => { setShowLogin(true); setTimeout(() => window.scrollTo({ top: window.scrollY + 420, behavior: 'smooth' }), 80); }}>Sign in</button>
                <button className="btn secondary" onClick={() => { navigator.clipboard?.writeText('tvenkatesh457146@gmail.com'); alert('Admin email copied'); }}>Contact Admin</button>
              </div>

              <div style={{ marginTop: 18, color: 'var(--muted)' }}>
                <small>Tip: Use your admin credentials. If you don't have access, contact the admin.</small>
              </div>
            </div>

            <div style={{ marginTop: 18, maxWidth: 480 }}>
              <div className={`card login-reveal ${showLogin ? 'reveal' : 'hidden'}`} style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ marginTop: 0 }}>Admin Login</h3>
                  {showLogin && <button className="btn secondary small" onClick={() => setShowLogin(false)}>Cancel</button>}
                </div>

                <form onSubmit={doLogin} className="contact-form">
                  <label>Admin Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="enter email" required />
                  <label>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="enter password" required />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="btn">Sign in</button>
                    <button type="button" className="btn secondary" onClick={() => { setEmail(''); setPassword(''); setShowLogin(false); }}>Cancel</button>
                  </div>
                  {status && <p style={{ marginTop: 10, color: status.type === 'error' ? 'salmon' : 'lightgreen' }}>{status.msg}</p>}
                </form>
              </div>
            </div>
          </div>

          <aside>
            <div className="card" style={{ padding: 18, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>Admin Profile</div>
              <p style={{ color: 'var(--muted)' }}>Visible after login.</p>
              <div style={{ marginTop: 12 }}>
                <img src={`https://picsum.photos/seed/admin/200/200`} alt="avatar" style={{ width: 140, height: 140, borderRadius: 14, display: 'block', margin: '8px auto', objectFit: 'cover' }} />
                <div style={{ marginTop: 8 }}><strong>—</strong><div style={{ color: 'var(--muted)' }}>—</div></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="kicker">Admin</div>
          <h1 style={{ margin: '6px 0' }}>Manage Projects, Profile & Content</h1>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {/* <button className="btn small" onClick={()=>{ setForm(blankForm); setEditingId(null); setShowProjectForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>New Project</button> */}
          <button className="btn secondary small" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="admin-grid" style={{ marginTop: 18 }}>
        {/* LEFT COLUMN: Profile + Messages (Messages moved here) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Your Profile</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
              <img src={profile?.avatarUrl || `https://picsum.photos/seed/admin/160/160`} alt="avatar"
                   style={{ width: 86, height: 86, borderRadius: 12, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block' }}>{profile?.name}</strong>
                <div style={{ color: 'var(--muted)' }}>{profile?.email}</div>
                <div style={{ marginTop: 8 }} className="lead-sm">{profile?.bio}</div>
              </div>
            </div>

            <hr style={{ margin: '14px 0', borderColor: 'rgba(255,255,255,0.03)' }} />
            <ProfileEditor profile={profile} setProfile={setProfile} onSave={updateProfile} />
          </div>

          {/* MOVED: Messages card — exact same styles & markup as before */}
          <div style={{ marginTop: 12 }} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ marginTop: 0 }}>Messages <small style={{ color: 'var(--muted)' }}>({contacts.length})</small></h4>
            </div>

            {loading ? (
              <div style={{ color: 'var(--muted)', padding: '8px 0' }}>Loading…</div>
            ) : contacts.length === 0 ? (
              <div style={{ color: 'var(--muted)', padding: '8px 0' }}>No messages yet.</div>
            ) : (
              <div style={{ display: 'grid', gap: 10, marginTop: 8 }}>
                {contacts.map(msg => (
                  <div key={msg._id} style={{ padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div>
                        <div style={{ fontWeight: 700 }}>{msg.name || (msg.email || msg.phone) || 'Anonymous'}</div>
                        <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                          {msg.email ? msg.email : ''}{msg.phone ? ` • ${msg.phone}` : ''}
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{new Date(msg.createdAt).toLocaleString()}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button className="btn small" onClick={() => toggleKeepContact(msg._id, !!msg.saved)}>{msg.saved ? 'Unkeep' : 'Keep'}</button>
                        <button className="btn small" onClick={() => openMessage(msg)}>View</button>
                        <button className="btn secondary small" onClick={() => handleDeleteContact(msg._id)}>Delete</button>
                      </div>
                    </div>

                    <div style={{ marginTop: 8, color: 'var(--soft)' }}>{msg.message.length > 160 ? msg.message.slice(0, 160) + '…' : msg.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Projects, Experiences, Certifications, Security (unchanged) */}
        <aside>
          <div>
            {showProjectForm && (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>{editingId ? 'Edit Project' : 'Create Project'}</h3>
                  <div className="lead-sm" style={{ color: 'var(--muted)' }}>{saving ? 'Saving...' : 'Draft'}</div>
                </div>

                <form onSubmit={submitProject} className="contact-form" style={{ marginTop: 12 }}>
                  <label>Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project title" />

                  <label>Short description *</label>
                  <input value={form.shortDescription} onChange={e => setForm({ ...form, shortDescription: e.target.value })} placeholder="One-liner" />

                  <label>Full description *</label>
                  <textarea rows="6" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

                  <label>Tech stack (type + Enter)</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <input placeholder="e.g. React" value={form.techInput} onChange={e => setForm({ ...form, techInput: e.target.value })}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(form.techInput.trim()); } }} />
                    <button type="button" className="btn small" onClick={() => addTech(form.techInput.trim())}>Add</button>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    {form.techStack.map(t => (
                      <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ fontWeight: 700 }}>{t}</span>
                        <button type="button" onClick={() => removeTech(t)} style={{ background: 'transparent', border: 'none', color: 'salmon', cursor: 'pointer' }}>✕</button>
                      </div>
                    ))}
                  </div>

                  <label>Repository URL</label>
                  <input value={form.repoUrl} onChange={e => setForm({ ...form, repoUrl: e.target.value })} />

                  <label>Live URL</label>
                  <input value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} />

                  <label>Image URL (preview)</label>
                  <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
                  <div style={{ marginTop: 10 }}>
                    {form.imageUrl ? (
                      <div style={{ width: 240, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <img src={form.imageUrl} alt="preview" style={{ width: '100%', display: 'block' }} onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${Date.now()}/800/400`; }} />
                      </div>
                    ) : (
                      <div style={{ width: 240, height: 120, borderRadius: 8, background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>No image</div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button className="btn" type="submit" disabled={saving}>{editingId ? 'Update Project' : 'Create Project'}</button>
                    <button type="button" className="btn secondary" onClick={() => { setShowProjectForm(false); }}>{editingId ? 'Cancel' : 'Close'}</button>
                    <button type="button" className="btn secondary small" onClick={() => { setForm(blankForm); setEditingId(null); }}>Clear</button>
                  </div>

                  {status && <p style={{ marginTop: 10, color: status.type === 'error' ? 'salmon' : 'lightgreen' }}>{status.msg}</p>}
                </form>
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ marginTop: 0 }}>Your Projects</h3>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className="btn small" onClick={() => { setForm(blankForm); setEditingId(null); setShowProjectForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Add</button>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                  {loading ? (
                    <div>Loading…</div>
                  ) : projects.length === 0 ? (
                    <div className="card">No projects yet.</div>
                  ) : (
                    projects.map(p => (
                      <div key={p._id} className="card admin-list-row">
                        <img
                          src={p.imageUrl || `https://picsum.photos/seed/${p._id}/200/120`}
                          alt={p.title}
                          className="admin-row-image"
                        />

                        <div className="admin-row-body">
                          <strong style={{ display: 'block' }}>{p.title}</strong>
                          <div className="muted small-text" style={{ marginTop: 6 }}>{p.shortDescription}</div>
                        </div>

                        <div className="admin-row-actions">
                          <button className="btn small" onClick={() => startEdit(p)}>Edit</button>
                          <button className="btn secondary small" onClick={() => handleDelete(p._id)}>Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Experience Manager */}
          <div style={{ marginTop: 12 }} className="card">
            {/* ... experiences markup unchanged ... */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ marginTop: 0 }}>Experiences <small style={{ color: 'var(--muted)' }}>({experiences.length})</small></h4>
              <div>
                <button className="btn small" onClick={() => { setEditingExperience(null); setShowExpForm(s => !s); setShowCertForm(false); }}>{showExpForm ? 'Close' : 'Add'}</button>
              </div>
            </div>

            {/* rest of experiences list unchanged */}
            {loading ? (
              <div style={{ color: 'var(--muted)', padding: '8px 0' }}>Loading…</div>
            ) : (
              <>
                {showExpForm && (
                  <ExperienceEditor
                    initial={editingExperience}
                    onSave={onSaveExperience}
                    onCancel={() => { setShowExpForm(false); setEditingExperience(null); }}
                  />
                )}

                <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
                  {experiences.length === 0 && <div style={{ color: 'var(--muted)' }}>No experiences yet.</div>}
                  {experiences.map(exp => (
                    <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ flex: 1 }}>
                        <strong>{exp.role} @ {exp.company}</strong>
                        <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                          {exp.type === 'internship' ? 'Internship' : 'Full-time'}
                          {exp.startDate ? ` • ${exp.startDate}` : ''}{exp.endDate ? ` — ${exp.endDate}` : ''}
                        </div>
                        <div style={{ marginTop: 6, fontSize: 13, color: 'var(--soft)' }}>{exp.description ? (exp.description.length > 140 ? exp.description.slice(0, 140) + '…' : exp.description) : ''}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button className="btn small" onClick={() => onEditExperience(exp)}>Edit</button>
                        <button className="btn secondary small" onClick={() => onDeleteExperience(exp._id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Certifications Manager */}
          <div style={{ marginTop: 12 }} className="card">
            {/* ... certifications markup unchanged ... */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ marginTop: 0 }}>Certifications <small style={{ color: 'var(--muted)' }}>({certifications.length})</small></h4>
              <div>
                <button className="btn small" onClick={() => { setEditingCertification(null); setShowCertForm(s => !s); setShowExpForm(false); }}>{showCertForm ? 'Close' : 'Add'}</button>
              </div>
            </div>

            {loading ? (
              <div style={{ color: 'var(--muted)', padding: '8px 0' }}>Loading…</div>
            ) : (
              <>
                {showCertForm && (
                  <CertificationEditor
                    initial={editingCertification}
                    onSave={onSaveCertification}
                    onCancel={() => { setShowCertForm(false); setEditingCertification(null); }}
                  />
                )}

                <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
                  {certifications.length === 0 && <div style={{ color: 'var(--muted)' }}>No certifications yet.</div>}
                  {certifications.map(c => (
                    <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', padding: 8, borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)' }}>
                      <div style={{ flex: 1 }}>
                        <strong>{c.title}</strong>
                        <div style={{ color: 'var(--muted)', fontSize: 13 }}>{c.issuer}{c.date ? ` • ${c.date}` : ''}</div>
                        {c.url && <div style={{ marginTop: 6 }}><a className="link-btn" href={c.url} target="_blank" rel="noreferrer">Open cert</a></div>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button className="btn small" onClick={() => onEditCertification(c)}>Edit</button>
                        <button className="btn secondary small" onClick={() => onDeleteCertification(c._id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ marginTop: 12 }} className="card">
            <h4 style={{ marginTop: 0 }}>Security</h4>
            <p style={{ color: 'var(--muted)' }}>Admin area is protected. Keep your token/credentials safe.</p>
            <button className="btn secondary small" onClick={logout}>Logout</button>
          </div>
        </aside>
      </div>

      <MessageDetailModal open={modalOpen} onClose={() => { setModalOpen(false); setSelectedMessage(null); }} message={selectedMessage} />
    </div>
  );
}

function ProfileEditor({ profile, setProfile, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', bio: '', avatarUrl: '', featuredTechs: [], techInput: ''
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatarUrl: profile.avatarUrl || '',
        featuredTechs: profile.featuredTechs ? [...profile.featuredTechs] : ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript'],
        techInput: ''
      });
    }
  }, [profile]);

  const submit = async (e) => {
    e.preventDefault();
    const updates = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
      avatarUrl: form.avatarUrl,
      featuredTechs: form.featuredTechs
    };
    await onSave(updates);
    setEditing(false);
  };

  const addTechFromInput = () => {
    const v = (form.techInput || '').trim();
    if (!v) return setForm(prev => ({ ...prev, techInput: '' }));
    if (!form.featuredTechs.includes(v)) {
      setForm(prev => ({ ...prev, featuredTechs: [...prev.featuredTechs, v], techInput: '' }));
    } else {
      setForm(prev => ({ ...prev, techInput: '' }));
    }
  };

  const handleTechKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechFromInput();
    }
    if (e.key === 'Escape') {
      setForm(prev => ({ ...prev, techInput: '' }));
    }
  };

  const removeTech = (t) => setForm(prev => ({ ...prev, featuredTechs: prev.featuredTechs.filter(x => x !== t) }));

  if (!editing) {
    return <div style={{ marginTop: 8 }}>
      <button className="btn" onClick={() => setEditing(true)}>Edit profile</button>
    </div>;
  }

  return (
    <form onSubmit={submit} className="contact-form" style={{ marginTop: 8 }}>
      <label>Name</label>
      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

      <label>Email</label>
      <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

      <label>Phone</label>
      <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />

      <label>Bio</label>
      <textarea rows="3" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />

      <label>Avatar URL</label>
      <input value={form.avatarUrl} onChange={e => setForm({ ...form, avatarUrl: e.target.value })} />

      <label style={{ marginTop: 6 }}>Featured badges (type + Enter)</label>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input placeholder="e.g. GraphQL" value={form.techInput} onChange={e => setForm({ ...form, techInput: e.target.value })} onKeyDown={handleTechKey} />
        <button type="button" className="btn small" onClick={addTechFromInput}>Add</button>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
        {form.featuredTechs.map(t => (
          <div key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.03)' }}>
            <span style={{ fontWeight: 700 }}>{t}</span>
            <button type="button" onClick={() => removeTech(t)} style={{ background: 'transparent', border: 'none', color: 'salmon', cursor: 'pointer' }}>✕</button>
          </div>
        ))}
        {form.featuredTechs.length === 0 && <div style={{ color: 'var(--muted)' }}>No featured techs yet.</div>}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="btn" type="submit">Save</button>
        <button type="button" className="btn secondary" onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </form>
  );
}