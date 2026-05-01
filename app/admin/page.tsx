'use client';

import { useState, useEffect } from 'react';

type Tab = 'focus' | 'updates' | 'projects' | 'blog' | 'quotes' | 'suggestions' | 'collaborators' | 'settings' | 'credentials';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('focus');
  
  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');

  // Data
  const [projects, setProjects] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [focus, setFocus] = useState({ problem: '', status: 'Noticing & Researching' });
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  // Project form
  const [editingProject, setEditingProject] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [links, setLinks] = useState('');

  // Quote form
  const [quoteText, setQuoteText] = useState('');
  const [quoteDesignation, setQuoteDesignation] = useState('');

  // Credentials form
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Blog form
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');

  // Update form
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateExcerpt, setUpdateExcerpt] = useState('');
  const [updateCategory, setUpdateCategory] = useState('Update');
  const [updateProjectId, setUpdateProjectId] = useState('');

  // Messages
  const [msg, setMsg] = useState<Record<string, string>>({});
  const flash = (key: string, text: string) => {
    setMsg(m => ({ ...m, [key]: text }));
    setTimeout(() => setMsg(m => ({ ...m, [key]: '' })), 3000);
  };

  // --- Data fetchers ---
  const fetchAll = () => {
    fetch('/api/projects').then(r => r.json()).then(setProjects).catch(console.error);
    fetch('/api/suggestions').then(r => r.json()).then(setSuggestions).catch(console.error);
    fetch('/api/quotes').then(r => r.json()).then(setQuotes).catch(console.error);
    fetch('/api/collaborators').then(r => r.json()).then(setCollaborators).catch(console.error);
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error);
    fetch('/api/blog').then(r => r.json()).then(setBlogPosts).catch(console.error);
    fetch('/api/updates').then(r => r.json()).then(setUpdates).catch(console.error);
    fetch('/api/focus').then(r => r.json()).then(d => {
      if (d && d.problem && d.problem !== 'No problem set yet.') {
        setFocus({ problem: d.problem, status: d.status || 'Noticing & Researching' });
      }
    }).catch(console.error);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = sessionStorage.getItem('whizzyx_admin_logged_in') === 'true';
      const savedUser = sessionStorage.getItem('whizzyx_admin_username') || '';
      if (loggedIn) { setIsLoggedIn(true); setCurrentUsername(savedUser); fetchAll(); }
    }
  }, []);

  // --- Auth ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUsername, password: loginPassword }),
    });
    if (res.ok) {
      sessionStorage.setItem('whizzyx_admin_logged_in', 'true');
      sessionStorage.setItem('whizzyx_admin_username', loginUsername);
      setCurrentUsername(loginUsername);
      setIsLoggedIn(true);
      fetchAll();
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => { sessionStorage.clear(); setIsLoggedIn(false); };

  const handleCredentialsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/reset', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUsername, newPassword }),
    });
    if (res.ok) {
      // Also update username via login seed upsert trick
      if (newUsername && newUsername !== currentUsername) {
        // We just update session, backend stores new pw only for now
        sessionStorage.setItem('whizzyx_admin_username', newUsername);
        setCurrentUsername(newUsername);
      }
      setNewPassword(''); setNewUsername('');
      flash('creds', '✓ Credentials updated!');
    } else {
      flash('creds', '✗ Failed to update.');
    }
  };

  // --- Focus ---
  const handleFocusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/focus', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(focus),
    });
    flash('focus', res.ok ? '✓ Focus updated & live!' : '✗ Failed to update.');
  };

  // --- Projects ---
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
    const method = editingProject ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, videoUrl, links }),
    });

    if (res.ok) {
      setTitle(''); setDescription(''); setVideoUrl(''); setLinks('');
      setEditingProject(null);
      fetchAll(); flash('projects', editingProject ? '✓ Project updated!' : '✓ Project added!');
    } else flash('projects', '✗ Failed.');
  };

  const handleEditProject = (p: any) => {
    setEditingProject(p);
    setTitle(p.title);
    setDescription(p.description);
    setVideoUrl(p.videoUrl || '');
    setLinks(p.links || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setTitle(''); setDescription(''); setVideoUrl(''); setLinks('');
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) fetchAll();
  };

  // --- Quotes ---
  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/quotes', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: quoteText, designation: quoteDesignation }),
    });
    if (res.ok) { setQuoteText(''); setQuoteDesignation(''); fetchAll(); flash('quotes', '✓ Quote added to marquee!'); }
    else flash('quotes', '✗ Failed.');
  };

  const handleDeleteQuote = async (id: number) => {
    await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  // --- Suggestions ---
  const handleFeature = async (id: number, current: boolean) => {
    await fetch(`/api/suggestions/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !current }),
    });
    fetchAll();
  };

  // --- Settings ---
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    flash('settings', res.ok ? '✓ Website content updated!' : '✗ Failed.');
  };

  // --- Blog ---
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/blog', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: blogTitle, content: blogContent, excerpt: blogExcerpt }),
    });
    if (res.ok) {
      setBlogTitle(''); setBlogContent(''); setBlogExcerpt('');
      fetchAll(); flash('blog', '✓ Blog post published!');
    } else flash('blog', '✗ Failed.');
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Delete this blog post?')) return;
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    if (res.ok) fetchAll();
  };

  // --- Build Updates ---
  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/updates', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: updateTitle, content: updateContent, excerpt: updateExcerpt, category: updateCategory, projectId: updateProjectId }),
    });
    if (res.ok) {
      setUpdateTitle(''); setUpdateContent(''); setUpdateExcerpt(''); setUpdateCategory('Update'); setUpdateProjectId('');
      fetchAll(); flash('updates', '✓ Build update posted!');
    } else flash('updates', '✗ Failed.');
  };

  const handleDeleteUpdate = async (id: number) => {
    if (!confirm('Delete this update?')) return;
    const res = await fetch(`/api/updates/${id}`, { method: 'DELETE' });
    if (res.ok) fetchAll();
  };

  // ==================== LOGIN SCREEN ====================
  if (!isLoggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#030305', position: 'relative', overflow: 'hidden' }}>
        <div className="bg-grid" style={{ position: 'absolute', inset: 0, zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>
        <div className="glass-card" style={{ maxWidth: '420px', width: '100%', zIndex: 1, position: 'relative', border: '1px solid rgba(139,92,246,0.4)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="logo" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>WhizzyX.</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Admin Dashboard Access</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" className="form-control" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required placeholder="Username" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Enter Dashboard</button>
            {loginError && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>{loginError}</p>}
          </form>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD ====================
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'focus', label: 'Live Focus', icon: '🎯' },
    { id: 'updates', label: 'Build Updates', icon: '🛠️' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'blog', label: 'Blog', icon: '✍️' },
    { id: 'quotes', label: 'Quotes', icon: '💬' },
    { id: 'suggestions', label: 'Suggestions', icon: '💡' },
    { id: 'collaborators', label: 'Join Applications', icon: '🤝' },
    { id: 'settings', label: 'Site Content', icon: '✏️' },
    { id: 'credentials', label: 'Credentials', icon: '🔐' },
  ];

  return (
    <div style={{ background: '#030305', minHeight: '100vh', position: 'relative' }}>
      <div className="bg-grid" style={{ position: 'fixed', inset: 0, zIndex: 0 }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top Bar */}
        <div style={{ borderBottom: '1px solid var(--glass-border)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(3,3,5,0.8)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div className="logo" style={{ fontSize: '1.6rem' }}>WhizzyX. <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)', fontFamily: 'Inter' }}>Admin</span></div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Logged in as <strong style={{ color: '#fff' }}>{currentUsername}</strong></span>
            <a href="/" className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)' }}>← Live Site</a>
            <button onClick={handleLogout} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid #ef4444' }}>Logout</button>
          </div>
        </div>

        <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>
          {/* Sidebar */}
          <aside style={{ width: '220px', borderRight: '1px solid var(--glass-border)', padding: '1.5rem 1rem', background: 'rgba(255,255,255,0.01)', flexShrink: 0 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                borderRadius: '10px', border: 'none', cursor: 'pointer', marginBottom: '0.4rem', fontSize: '0.95rem',
                background: activeTab === t.id ? 'rgba(59,130,246,0.15)' : 'transparent',
                color: activeTab === t.id ? '#fff' : 'var(--text-secondary)',
                borderLeft: activeTab === t.id ? '3px solid var(--accent)' : '3px solid transparent',
                transition: 'all 0.2s',
              }}>
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>

            {/* FOCUS TAB */}
            {activeTab === 'focus' && (
              <div>
                <h2 style={{ marginBottom: '0.5rem' }}>🎯 Live Focus</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>This broadcasts live to the homepage, showing what you're currently working on.</p>
                <div className="glass-card" style={{ maxWidth: '700px' }}>
                  <form onSubmit={handleFocusUpdate}>
                    <div className="form-group">
                      <label>Current problem / focus</label>
                      <textarea className="form-control" style={{ minHeight: '100px' }} value={focus.problem} onChange={e => setFocus({ ...focus, problem: e.target.value })} required placeholder="e.g. Automated expense tracking is too slow..." />
                    </div>
                    <div className="form-group">
                      <label>Status Tag</label>
                      <select className="form-control" value={focus.status} onChange={e => setFocus({ ...focus, status: e.target.value })} style={{ appearance: 'none', background: 'rgba(0,0,0,0.4)' }}>
                        <option>Noticing & Researching</option>
                        <option>Prototyping Ideas</option>
                        <option>Building Alpha</option>
                        <option>Polishing Beta</option>
                        <option>Shipped</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Set Live</button>
                    {msg.focus && <span style={{ marginLeft: '1rem', color: 'var(--accent)' }}>{msg.focus}</span>}
                  </form>
                </div>
              </div>
            )}

            {/* UPDATES TAB */}
            {activeTab === 'updates' && (
              <div>
                <h2 style={{ marginBottom: '0.5rem' }}>🛠️ Build Updates (Roadmap)</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Log what you did, what you learned, or what you improved. These appear in the Roadmap timeline.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Post New Update</h3>
                    <form onSubmit={handleAddUpdate}>
                      <div className="form-group">
                        <label>Title (Optional)</label>
                        <input type="text" className="form-control" value={updateTitle} onChange={e => setUpdateTitle(e.target.value)} placeholder="A name for this milestone..." />
                      </div>
                      <div className="form-group">
                        <label>Excerpt (Short summary)</label>
                        <input type="text" className="form-control" value={updateExcerpt} onChange={e => setUpdateExcerpt(e.target.value)} placeholder="Quick overview..." />
                      </div>
                      <div className="form-group">
                        <label>Content (Markdown supported)</label>
                        <textarea className="form-control" value={updateContent} onChange={e => setUpdateContent(e.target.value)} required style={{ minHeight: '120px' }} placeholder="What did you achieve or learn?" />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select className="form-control" value={updateCategory} onChange={e => setUpdateCategory(e.target.value)} style={{ appearance: 'none', background: 'rgba(0,0,0,0.4)' }}>
                          <option>Update</option>
                          <option>Learning</option>
                          <option>Improvement</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Link to Project (Optional)</label>
                        <select className="form-control" value={updateProjectId} onChange={e => setUpdateProjectId(e.target.value)} style={{ appearance: 'none', background: 'rgba(0,0,0,0.4)' }}>
                          <option value="">None</option>
                          {projects.map((p: any) => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary">Post Update</button>
                      {msg.updates && <span style={{ marginLeft: '1rem', color: 'var(--accent)' }}>{msg.updates}</span>}
                    </form>
                  </div>
                  <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Updates ({updates.length})</h3>
                    {updates.map((u: any) => (
                      <div key={u.id} className="admin-item-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span className={`category-tag category-${u.category.toLowerCase()}`} style={{ marginBottom: '0.25rem' }}>{u.category}</span>
                            <p style={{ color: '#fff', fontSize: '0.95rem' }}>{u.content.substring(0, 100)}...</p>
                          </div>
                          <button className="btn-delete" onClick={() => handleDeleteUpdate(u.id)}>Delete</button>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span>{new Date(u.date).toLocaleDateString()}</span>
                          {u.project && <span>Project: {u.project.title}</span>}
                        </div>
                      </div>
                    ))}
                    {updates.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No updates logged yet.</p>}
                  </div>
                </div>
              </div>
            )}


            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div>
                <h2 style={{ marginBottom: '0.5rem' }}>🚀 Projects</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Add and manage your featured projects shown on the homepage.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                    <form onSubmit={handleAddProject}>
                      <div className="form-group"><label>Title</label><input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required /></div>
                      <div className="form-group"><label>Description</label><textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required style={{ minHeight: '80px' }} /></div>
                      <div className="form-group"><label>YouTube URL (optional)</label><input type="url" className="form-control" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." /></div>
                      <div className="form-group"><label>Project Link (optional)</label><input type="url" className="form-control" value={links} onChange={e => setLinks(e.target.value)} placeholder="https://github.com/..." /></div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button type="submit" className="btn btn-primary">{editingProject ? 'Update Project' : 'Publish'}</button>
                        {editingProject && <button type="button" onClick={handleCancelEdit} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>Cancel</button>}
                        {msg.projects && <span style={{ color: 'var(--accent)' }}>{msg.projects}</span>}
                      </div>
                    </form>
                  </div>
                  <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Existing Projects ({projects.length})</h3>
                    {projects.map((p: any) => (
                      <div key={p.id} className="admin-item-card">
                        <div style={{ flex: 1 }}>
                          <h4 style={{ color: '#fff', marginBottom: '0.25rem' }}>{p.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.description.substring(0, 70)}...</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid #3b82f6' }} onClick={() => handleEditProject(p)}>Edit</button>
                          <button className="btn-delete" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleDeleteProject(p.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No projects yet.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* QUOTES TAB */}
            {activeTab === 'quotes' && (
              <div>
                <h2 style={{ marginBottom: '0.5rem' }}>💬 Marquee Quotes</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>These appear in the animated scrolling banner on the homepage. Add your own thoughts and designations.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Add New Quote</h3>
                    <form onSubmit={handleAddQuote}>
                      <div className="form-group"><label>Quote / Thought</label><textarea className="form-control" value={quoteText} onChange={e => setQuoteText(e.target.value)} required placeholder="e.g. You don't need to know everything to start. Just build." style={{ minHeight: '80px' }} /></div>
                      <div className="form-group"><label>Designation / Attribution (Optional)</label><input type="text" className="form-control" value={quoteDesignation} onChange={e => setQuoteDesignation(e.target.value)} placeholder="e.g. — Manas, Builder" /></div>
                      <button type="submit" className="btn btn-primary">Add to Marquee</button>
                      {msg.quotes && <span style={{ marginLeft: '1rem', color: 'var(--accent)' }}>{msg.quotes}</span>}
                    </form>
                  </div>
                  <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Current Quotes ({quotes.length})</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>If empty, default quotes are shown.</p>
                    {quotes.map((q: any) => (
                      <div key={q.id} className="admin-item-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <p style={{ color: '#fff', fontSize: '0.95rem' }}>"{q.text}"</p>
                        {q.designation && <p style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{q.designation}</p>}
                        <button className="btn-delete" onClick={() => handleDeleteQuote(q.id)} style={{ marginTop: '0.5rem' }}>Remove</button>
                      </div>
                    ))}
                    {quotes.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No custom quotes added yet. Default quotes are active.</p>}
                  </div>
                </div>
              </div>
            )}

            {/* SUGGESTIONS TAB */}
            {activeTab === 'suggestions' && (
              <div>
                <h2 style={{ marginBottom: '0.5rem' }}>💡 User Suggestions</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Review community submissions. Feature the best ones to the public Community Wall.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                  {suggestions.map((s: any) => (
                    <div key={s.id} className="glass-card" style={{ border: s.isFeatured ? '1px solid rgba(16,185,129,0.5)' : undefined }}>
                      {s.isFeatured && <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '50px', border: '1px solid rgba(16,185,129,0.3)' }}>★ Featured</span>}
                      <p style={{ color: '#fff', margin: '1rem 0 0.5rem', fontWeight: 500 }}>{s.problem}</p>
                      {s.solution && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic' }}>Idea: {s.solution}</p>}
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <span className="community-author" style={{ fontSize: '1.1rem' }}>{s.userName || 'Anonymous'}</span>
                          <br />{new Date(s.createdAt).toLocaleDateString()}
                        </span>
                        <button onClick={() => handleFeature(s.id, s.isFeatured)} className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: s.isFeatured ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', color: s.isFeatured ? '#ef4444' : '#10b981', border: `1px solid ${s.isFeatured ? '#ef4444' : '#10b981'}` }}>
                          {s.isFeatured ? 'Unfeature' : 'Feature to Wall'}
                        </button>
                      </div>
                    </div>
                  ))}
                  {suggestions.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No suggestions yet.</p>}
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div>
                <h2 style={{ marginBottom: '0.5rem' }}>✏️ Site Content</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Edit every text section shown on the homepage through this GUI.</p>
                <div className="glass-card" style={{ maxWidth: '700px' }}>
                  <form onSubmit={handleSettingsSave}>
                    {[
                      { key: 'heroTitle', label: 'Hero Title', placeholder: 'Self-Initiated Startup Idea & Creative Systems' },
                      { key: 'heroSubtitle', label: 'Hero Subtitle', placeholder: 'Identifying and solving real-world inefficiencies...' },
                      { key: 'heroTagline', label: 'Hero Tagline (handwritten)', placeholder: '— Welcome to my workshop! 🛠️' },
                      { key: 'sectionProjectsTitle', label: 'Projects Section Title', placeholder: 'Featured Projects' },
                      { key: 'sectionCommunityTitle', label: 'Community Section Title', placeholder: 'Community Wall' },
                      { key: 'sectionSuggestTitle', label: 'Suggestions Section Title', placeholder: 'Got a Problem to Solve?' },
                    ].map(field => (
                      <div className="form-group" key={field.key}>
                        <label>{field.label}</label>
                        <input type="text" className="form-control" value={settings[field.key] || ''} onChange={e => setSettings({ ...settings, [field.key]: e.target.value })} placeholder={field.placeholder} />
                      </div>
                    ))}
                    <button type="submit" className="btn btn-primary">Save All Changes</button>
                    {msg.settings && <span style={{ marginLeft: '1rem', color: 'var(--accent)' }}>{msg.settings}</span>}
                  </form>
                </div>
              </div>
            )}

            {/* COLLABORATORS TAB */}
            {activeTab === 'collaborators' && (
              <div>
                <h2 style={{ marginBottom: '0.5rem' }}>🤝 Join Applications</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  People who applied to collaborate on WhizzyX. This is private — only you can see it.
                </p>
                {collaborators.length === 0 && (
                  <p style={{ color: 'var(--text-secondary)' }}>No applications yet.</p>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                  {collaborators.map((c: any) => (
                    <div key={c.id} className="glass-card" style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <span className="community-author" style={{ fontSize: '1.4rem' }}>{c.name}</span>
                          <p style={{ color: 'var(--accent)', fontSize: '0.85rem', marginTop: '0.2rem' }}>{c.email}</p>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Skills</p>
                        <p style={{ color: '#fff', fontSize: '0.95rem' }}>{c.skills}</p>
                      </div>
                      <div style={{ marginBottom: '0.75rem' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Why WhizzyX?</p>
                        <p style={{ color: '#fff', fontSize: '0.95rem' }}>{c.why}</p>
                      </div>
                      {c.portfolio && (
                        <a href={c.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>🔗 {c.portfolio}</a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CREDENTIALS TAB */}
            {activeTab === 'credentials' && (

              <div>
                <h2 style={{ marginBottom: '0.5rem' }}>🔐 Admin Credentials</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Update your admin login username and password.</p>
                <div className="glass-card" style={{ maxWidth: '500px' }}>
                  <form onSubmit={handleCredentialsUpdate}>
                    <div className="form-group">
                      <label>New Username (leave blank to keep current)</label>
                      <input type="text" className="form-control" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder={currentUsername} />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="Enter new password" />
                    </div>
                    <button type="submit" className="btn btn-primary">Update Credentials</button>
                    {msg.creds && <span style={{ marginLeft: '1rem', color: 'var(--accent)' }}>{msg.creds}</span>}
                  </form>
                </div>
              </div>
            )}

            {/* BLOG TAB */}
            {activeTab === 'blog' && (
              <div>
                <h2 style={{ marginBottom: '0.5rem' }}>✍️ Blog Writing</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Share your thoughts, updates, and deep dives with your community.</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
                  <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Write New Post</h3>
                    <form onSubmit={handleAddBlog}>
                      <div className="form-group"><label>Title</label><input type="text" className="form-control" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} required placeholder="The Future of Inefficiency..." /></div>
                      <div className="form-group"><label>Excerpt (Short summary)</label><input type="text" className="form-control" value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} placeholder="A quick look at why I built this..." /></div>
                      <div className="form-group"><label>Content (Markdown supported)</label><textarea className="form-control" value={blogContent} onChange={e => setBlogContent(e.target.value)} required style={{ minHeight: '300px', fontFamily: 'monospace' }} placeholder="Write your post here..." /></div>
                      <button type="submit" className="btn btn-primary">Publish Post</button>
                      {msg.blog && <span style={{ marginLeft: '1rem', color: 'var(--accent)' }}>{msg.blog}</span>}
                    </form>
                  </div>
                  <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Manage Posts ({blogPosts.length})</h3>
                    {blogPosts.map((p: any) => (
                      <div key={p.id} className="admin-item-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ color: '#fff' }}>{p.title}</h4>
                          <button className="btn-delete" onClick={() => handleDeleteBlog(p.id)}>Delete</button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(p.createdAt).toLocaleDateString()}</p>
                        {p.excerpt && <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>{p.excerpt}</p>}
                      </div>
                    ))}
                    {blogPosts.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No blog posts yet.</p>}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
