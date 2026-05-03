'use client';

import React, { useState, useEffect, useRef } from 'react';

type Tab = 'focus' | 'updates' | 'projects' | 'blog' | 'quotes' | 'suggestions' | 'collaborators' | 'settings' | 'credentials';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('focus');
  
  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Data
  const [projects, setProjects] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [hibernatedMissions, setHibernatedMissions] = useState<any[]>([]);
  const [focus, setFocus] = useState({ id: null, problem: '', description: '', blurb: '', status: 'Noticing & Researching', projectId: '', milestone: '', finalDestination: '' });
  const [settings, setSettings] = useState<Record<string, string>>({
    sectionProjectsTitle: 'Featured Projects',
    sectionCommunityTitle: 'Community Wall',
    sectionSuggestTitle: 'Got a Problem to Solve?',
    donateQrUrl: '',
    contactEmail: 'contact@whizzyx.corp',
  });
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);

  // Project form
  const [editingProject, setEditingProject] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [links, setLinks] = useState('');
  const [projectMilestone, setProjectMilestone] = useState('');
  const [finalDestination, setFinalDestination] = useState('');

  // Quote form
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [quoteText, setQuoteText] = useState('');
  const [quoteDesignation, setQuoteDesignation] = useState('');

  // Blog form
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');

  // Update form
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [updateExcerpt, setUpdateExcerpt] = useState('');
  const [updateCategory, setUpdateCategory] = useState('Update');
  const [updateProjectId, setUpdateProjectId] = useState('');

  // Full-Screen Editor State
  const [isFSOpen, setIsFSOpen] = useState(false);
  const [fsContent, setFSContent] = useState('');
  const [fsTarget, setFSTarget] = useState<'focus' | 'project' | 'blog' | 'update' | 'settings_subtitle' | 'homeHeroTitle' | 'founderBio' | 'quote' | 'focus_milestone' | 'focus_blurb' | null>(null);
  const [fsFontSize, setFSFontSize] = useState(18);
  const fsTextareaRef = useRef<HTMLTextAreaElement>(null);

  const openFS = (content: string, target: any) => {
    setFSContent(content);
    setFSTarget(target);
    setIsFSOpen(true);
  };

  const saveFS = () => {
    if (fsTarget === 'focus') setFocus(prev => ({ ...prev, description: fsContent }));
    if (fsTarget === 'project') setDescription(fsContent);
    if (fsTarget === 'blog') setBlogContent(fsContent);
    if (fsTarget === 'update') setUpdateContent(fsContent);
    if (fsTarget === 'settings_subtitle') setSettings(prev => ({ ...prev, heroSubtitle: fsContent }));
    if (fsTarget === 'homeHeroTitle') setSettings(prev => ({ ...prev, homeHeroTitle: fsContent }));
    if (fsTarget === 'founderBio') setSettings(prev => ({ ...prev, founderBio: fsContent }));
    if (fsTarget === 'quote') setQuoteText(fsContent);
    if (fsTarget === 'focus_milestone') setFocus(prev => ({ ...prev, milestone: fsContent }));
    if (fsTarget === 'focus_blurb') setFocus(prev => ({ ...prev, blurb: fsContent }));
    setIsFSOpen(false);
  };

  const insertTag = (before: string, after: string = '') => {
    const el = fsTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = fsContent;
    const selected = val.substring(start, end);

    let newVal;
    let newStart, newEnd;

    // Check if the selection is already wrapped (Toggle OFF)
    if (before && after && selected.startsWith(before) && selected.endsWith(after)) {
      const stripped = selected.substring(before.length, selected.length - after.length);
      newVal = val.substring(0, start) + stripped + val.substring(end);
      newStart = start;
      newEnd = start + stripped.length;
    } else {
      // Apply tags (Toggle ON)
      newVal = val.substring(0, start) + before + selected + after + val.substring(end);
      newStart = start;
      newEnd = start + before.length + selected.length + after.length;
    }

    setFSContent(newVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(newStart, newEnd);
    }, 10);
  };

  const togglePrefix = (prefix: string) => {
    const el = fsTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = fsContent;
    const selected = val.substring(start, end);
    const lines = selected.split('\n');

    const allHavePrefix = lines.every(line => line.startsWith(prefix));
    let newLines;

    if (allHavePrefix) {
      newLines = lines.map(line => line.substring(prefix.length));
    } else {
      newLines = lines.map(line => prefix + line);
    }

    const newText = newLines.join('\n');
    const newVal = val.substring(0, start) + newText + val.substring(end);
    
    setFSContent(newVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start, start + newText.length);
    }, 10);
  };

  const updateFontSize = (newSize: number) => {
    const el = fsTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    if (start === end) {
      setFSFontSize(newSize);
      return;
    }

    const val = fsContent;
    const selected = val.substring(start, end);
    let newVal;

    // Regex to detect existing font-size span around selection
    const fontSpanRegex = /^<span style="font-size:(\d+)px">(.*)<\/span>$/;
    const match = selected.match(fontSpanRegex);

    if (newSize === 18) {
      // Revert to default: Remove tags if they exist
      if (match) {
        newVal = val.substring(0, start) + match[2] + val.substring(end);
      } else {
        newVal = val;
      }
    } else {
      // Apply or Update
      const content = match ? match[2] : selected;
      const tag = `<span style="font-size:${newSize}px">`;
      newVal = val.substring(0, start) + tag + content + '</span>' + val.substring(end);
    }

    setFSContent(newVal);
    setFSFontSize(newSize);
    
    // Maintain selection
    setTimeout(() => {
      el.focus();
      const tagLen = newSize === 18 ? 0 : `<span style="font-size:${newSize}px">`.length;
      const contentLen = match ? match[2].length : selected.length;
      el.setSelectionRange(start, start + tagLen + contentLen + (newSize === 18 ? 0 : 7));
    }, 10);
  };

  const renderPreview = (content: string) => {
    if (!content) return '';
    let processed = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/^### (.*)$/gm, '<h3 style="font-size: 22px; fontWeight: 800; margin: 24px 0 12px;">$1</h3>')
      .replace(/^[\s]*[-*]\s+(.*)$/gm, '<li>$1</li>');
      
    processed = processed.replace(/(<li>.*?<\/li>(\n| )*)+/g, (match) => `<ul style="margin-bottom: 20px; padding-left: 20px; list-style-type: disc;">${match}</ul>`);
    
    // 2. Wrap allowed HTML tags so they don't get escaped
    processed = processed.replace(/<span style="(.*?)">(.*?)<\/span>/g, '[[SPAN style="$1"]]$2[[/SPAN]]');
    processed = processed.replace(/<strong>(.*?)<\/strong>/g, '[[STRONG]]$1[[/STRONG]]');
    processed = processed.replace(/<em>(.*?)<\/em>/g, '[[EM]]$1[[/EM]]');
    processed = processed.replace(/<h3 style="(.*?)">(.*?)<\/h3>/g, '[[H3 style="$1"]]$2[[/H3]]');

    // 3. Escape everything else
    let safe = processed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 4. Restore the whitelisted tags
    safe = safe
      .replace(/\[\[SPAN style="(.*?)"\]\](.*?)\[\[\/SPAN\]\]/g, '<span style="$1">$2</span>')
      .replace(/\[\[STRONG\]\](.*?)\[\[\/STRONG\]\]/g, '<strong>$1</strong>')
      .replace(/\[\[EM\]\](.*?)\[\[\/EM\]\]/g, '<em>$1</em>')
      .replace(/\[\[H3 style="(.*?)"\]\](.*?)\[\[\/H3\]\]/g, '<h3 style="$1">$2</h3>')
      .replace(/\n/g, '<br/>');
    return safe;
  };

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
    fetch('/api/focus?status=all&t=' + Date.now()).then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        const active = data.find((f: any) => f.status !== 'Hibernated');
        const hibernated = data.filter((f: any) => f.status === 'Hibernated');
        if (active) {
          setFocus({ 
            id: active.id,
            problem: active.problem, 
            description: active.description || '',
            blurb: active.blurb || '',
            status: active.status || 'Active',
            projectId: active.projectId?.toString() || '',
            milestone: active.milestone || '',
            finalDestination: active.finalDestination || ''
          });
          setUpdateProjectId('__FOCUS__');
          setFinalDestination(active.finalDestination || '');
        } else {
          setFocus({ id: null, problem: '', description: '', blurb: '', status: 'Active', projectId: '', milestone: '', finalDestination: '' });
          setUpdateProjectId('');
        }
        setHibernatedMissions(hibernated);
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
    
    if (res.ok) {
      fetchAll();
      flash('focus', '✓ Focus updated & live!');
    } else {
      flash('focus', '✗ Failed to update.');
    }
  };

  const handleCompleteProject = async () => {
    if (!focus.projectId && !focus.problem) return;
    
    // If not linked to a project, ask for a title to create one
    let targetProjectId = focus.projectId;
    
    if (!targetProjectId) {
      const title = prompt('Enter a title for this new project:');
      if (!title) return;
      
      const res = await fetch('/api/projects', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: focus.problem }),
      });
      const newProj = await res.json();
      targetProjectId = newProj.id.toString();
    }
    
    // Clear focus
    await fetch('/api/focus', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem: 'Looking for the next challenge...', status: 'Idle', projectId: null }),
    });
    
    setFocus({ id: null, problem: 'Looking for the next challenge...', description: '', blurb: '', status: 'Idealizing', projectId: '', milestone: '', finalDestination: '' });
    fetchAll();
    flash('focus', '✓ Project moved to Projects list!');
  };

  // --- Projects ---
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
    const method = editingProject ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, videoUrl, links, currentMilestone: projectMilestone, finalDestination }),
    });

    if (res.ok) {
      setTitle(''); setDescription(''); setVideoUrl(''); setLinks(''); setProjectMilestone(''); setFinalDestination('');
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
    setProjectMilestone(p.currentMilestone || '');
    setFinalDestination(p.finalDestination || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    setTitle(''); setDescription(''); setVideoUrl(''); setLinks(''); setProjectMilestone(''); setFinalDestination('');
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) fetchAll();
  };

  // --- Quotes ---
  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingQuote ? `/api/quotes/${editingQuote.id}` : '/api/quotes';
    const method = editingQuote ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: quoteText, designation: quoteDesignation }),
    });
    if (res.ok) { 
      setQuoteText(''); setQuoteDesignation(''); setEditingQuote(null);
      fetchAll(); flash('quotes', editingQuote ? '✓ Quote updated!' : '✓ Quote added!'); 
    } else flash('quotes', '✗ Failed.');
  };

  const handleEditQuote = (q: any) => {
    setEditingQuote(q);
    setQuoteText(q.text);
    setQuoteDesignation(q.designation || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteQuote = async (id: number) => {
    if (!confirm('Delete this quote?')) return;
    await fetch(`/api/quotes/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  const handleReorderQuote = async (id: number, direction: 'up' | 'down') => {
    const currentIndex = quotes.findIndex((q: any) => q.id === id);
    if (currentIndex === -1) return;
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= quotes.length) return;

    const newQuotes = [...quotes];
    const currentQuote = { ...newQuotes[currentIndex] };
    const targetQuote = { ...newQuotes[targetIndex] };

    // If orders are identical or undefined, initialize them based on index
    let curOrder = currentQuote.order ?? currentIndex;
    let tarOrder = targetQuote.order ?? targetIndex;

    // Swap logic
    if (curOrder === tarOrder) {
        curOrder = currentIndex;
        tarOrder = targetIndex;
    }

    const res = await fetch('/api/quotes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quotes: [
          { id: currentQuote.id, order: tarOrder },
          { id: targetQuote.id, order: curOrder }
        ]
      })
    });

    if (res.ok) fetchAll();
  };

  // --- Suggestions ---
  const handleFeature = async (id: number, current: boolean) => {
    await fetch(`/api/suggestions/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !current }),
    });
    fetchAll();
  };

  const handleDeleteSuggestion = async (id: number) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) return;
    await fetch(`/api/suggestions/${id}`, { method: 'DELETE' });
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
    const url = editingBlog ? `/api/blog/${editingBlog.id}` : '/api/blog';
    const method = editingBlog ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: blogTitle, content: blogContent, excerpt: blogExcerpt }),
    });
    if (res.ok) {
      setBlogTitle(''); setBlogContent(''); setBlogExcerpt(''); setEditingBlog(null);
      fetchAll(); flash('blog', editingBlog ? '✓ Blog post updated!' : '✓ Blog post published!');
    } else flash('blog', '✗ Failed.');
  };

  const handleEditBlog = (b: any) => {
    setEditingBlog(b);
    setBlogTitle(b.title);
    setBlogContent(b.content);
    setBlogExcerpt(b.excerpt || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Delete this blog post?')) return;
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    if (res.ok) fetchAll();
  };

  // --- Build Updates ---
  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalProjectId = '';
    let targetFocus = null;

    if (updateProjectId === '__FOCUS__') {
      finalProjectId = focus.projectId || '';
      targetFocus = focus;
    } else if (updateProjectId.startsWith('__FOCUS_HIBERNATED_')) {
      const id = updateProjectId.replace('__FOCUS_HIBERNATED_', '').replace('__', '');
      const m = hibernatedMissions.find(miss => miss.id.toString() === id);
      finalProjectId = m?.projectId?.toString() || '';
      targetFocus = m;
    } else {
      finalProjectId = updateProjectId;
    }

    const res = await fetch('/api/updates', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: updateTitle, content: updateContent, excerpt: updateExcerpt, category: updateCategory, projectId: finalProjectId }),
    });

    if (res.ok) {
      // 1. Automatic Project Module Milestone Update
      if (finalProjectId) {
        await fetch(`/api/projects/${finalProjectId}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentMilestone: updateTitle, finalDestination }),
        });
      }

      // 2. Automatic Focus Milestone Update
      if (targetFocus) {
        const isCurrentActive = updateProjectId === '__FOCUS__';
        const updatedFocus = { ...targetFocus, milestone: updateTitle, finalDestination };
        
        if (isCurrentActive) setFocus(updatedFocus);
        
        // Use raw SQL or dedicated focus update API
        await fetch('/api/focus', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...updatedFocus, id: targetFocus.id }), // Include ID for targeted update
        });
      }
      
      setUpdateTitle(''); setUpdateContent(''); setUpdateExcerpt(''); setUpdateCategory('Update');
      fetchAll(); flash('updates', '✓ Build update posted & milestones synced!');
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>WhizzyX Admin</h1>
            <p className="text-muted">Enter credentials to access dashboard</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="label">Username</label>
              <input type="text" className="form-control" value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="label">Password</label>
              <input type="password" className="form-control" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>
              Sign In
            </button>
            {loginError && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>{loginError}</p>}
          </form>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD ====================
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'focus', label: 'Live Focus', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
    )},
    { id: 'updates', label: 'Roadmap', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
    )},
    { id: 'projects', label: 'Projects', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
    )},
    { id: 'blog', label: 'Blog', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    )},
    { id: 'quotes', label: 'Quotes', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    )},
    { id: 'suggestions', label: 'Suggestions', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.19.33-.42.41-.67a3 3 0 1 0-7 0c.08.25.23.48.41.67L10 16h4l1.09-2z"/></svg>
    )},
    { id: 'collaborators', label: 'Applications', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )},
    { id: 'settings', label: 'Site Content', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
    )},
    { id: 'credentials', label: 'Credentials', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    )},
  ];

  return (
    <div className="min-h-screen bg-primary">
      {/* ── Top Bar ── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo" style={{ cursor: 'default' }}>
            <img src="/logo.png" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
            <span style={{ fontSize: '20px', fontWeight: 800 }}>WhizzyX <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500 }}>ADMIN</span></span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span className="mono text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>{currentUsername.toUpperCase()}</span>
            <a href="/" className="btn" style={{ fontSize: '12px', fontWeight: 600 }}>LIVE SITE</a>
            <button onClick={handleLogout} className="btn" style={{ fontSize: '12px', fontWeight: 600, color: '#ef4444', borderColor: '#ef4444' }}>LOGOUT</button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div style={{ padding: '0 24px 16px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>MANAGEMENT</div>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`sidebar-item ${activeTab === t.id ? 'active' : ''}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', opacity: activeTab === t.id ? 1 : 0.6 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </aside>

        {/* ── Main Content Area ── */}
        <main className="content-area">
          {/* FOCUS TAB */}
          {activeTab === 'focus' && (
            <div className="fade-in" style={{ maxWidth: '850px' }}>
              <div className="mb-8">
                <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Live Focus</h1>
                <p className="text-muted">Broadcast the current technical objective.</p>
              </div>
              <div className="card" style={{ padding: '40px', background: 'white' }}>
                <form onSubmit={handleFocusUpdate}>
                  <div className="form-group">
                    <label className="label">Focus Title (Problem Statement)</label>
                    <input type="text" className="form-control" value={focus.problem} onChange={e => setFocus({ ...focus, problem: e.target.value })} required style={{ fontSize: '18px', fontWeight: 600, height: '50px' }} />
                  </div>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="label" style={{ margin: 0 }}>Home Page Short Summary (Blurb)</label>
                        <button type="button" onClick={() => openFS(focus.blurb || '', 'focus_blurb')} className="btn" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px' }}>FULL SCREEN EDITOR</button>
                      </div>
                      <textarea 
                        className="form-control" 
                        value={focus.blurb || ''} 
                        onChange={e => setFocus({ ...focus, blurb: e.target.value })} 
                        placeholder="A short hook for the home page card..." 
                        style={{ fontSize: '15px', fontWeight: 600, minHeight: '60px' }}
                      />
                    </div>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="label">Associated Project (System Module)</label>
                      <select 
                        className="form-control" 
                        value={focus.projectId || ''} 
                        onChange={e => setFocus({ ...focus, projectId: e.target.value })}
                        style={{ fontSize: '15px', fontWeight: 600, height: '45px' }}
                      >
                        <option value="">-- No Specific Module --</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="label">Live Milestone (Select from Roadmap)</label>
                      <select 
                        className="form-control" 
                        value={focus.milestone} 
                        onChange={e => setFocus({ ...focus, milestone: e.target.value })}
                        style={{ fontSize: '15px', fontWeight: 600, height: '45px' }}
                      >
                        <option value="">-- Select a Milestone --</option>
                        {updates.map(u => (
                          <option key={u.id} value={u.title}>{u.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="label">Current Status</label>
                      <select 
                        className="form-control" 
                        value={focus.status} 
                        onChange={e => setFocus({ ...focus, status: e.target.value })}
                        style={{ fontSize: '15px', fontWeight: 600, height: '45px' }}
                      >
                        <option>Noticing & Researching</option>
                        <option>Drafting Architecture</option>
                        <option>Building Foundation</option>
                        <option>Optimizing Logic</option>
                        <option>Finalizing Systems</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="label">Focus Destination (Ultimate Goal)</label>
                      <input type="text" className="form-control" value={focus.finalDestination || ''} onChange={e => setFocus({ ...focus, finalDestination: e.target.value })} placeholder="What is the final goal of this mission?" />
                    </div>
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="label" style={{ margin: 0 }}>Progress Log / Current Activity</label>
                      <button type="button" onClick={() => openFS(focus.description || '', 'focus')} className="btn" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px' }}>FULL SCREEN EDITOR</button>
                    </div>
                    <textarea className="form-control mono" rows={4} value={focus.description || ''} onChange={e => setFocus({ ...focus, description: e.target.value })} placeholder="Document current architecture choices..." />
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
                    <button type="submit" className="btn btn-primary" style={{ height: '48px', padding: '0 32px', borderRadius: '10px', fontWeight: 700 }}>
                      SAVE & PUBLISH
                    </button>
                    <button 
                      type="button" 
                      onClick={handleCompleteProject}
                      className="btn" 
                      style={{ height: '48px', borderRadius: '10px', borderColor: '#22c55e', color: '#22c55e', fontWeight: 700 }}
                    >
                      COMPLETE MISSION
                    </button>
                    <button 
                      type="button" 
                      onClick={async () => {
                        if (!confirm('HIBERNATION PROTOCOL: This will archive the current active mission. Proceed?')) return;
                        const res = await fetch('/api/focus/hibernate', { method: 'POST' });
                        if (res.ok) {
                          flash('focus', '✓ Mission hibernated.');
                          setFocus({ id: null, problem: '', description: '', blurb: '', status: 'Active', projectId: '', milestone: '', finalDestination: '' });
                          fetchAll();
                        }
                      }}
                      className="btn" 
                      style={{ height: '48px', borderRadius: '10px', borderColor: '#ef4444', color: '#ef4444', fontWeight: 700 }}
                    >
                      HIBERNATE
                    </button>
                  </div>
                  {msg.focus && <p className="mt-4 mono text-muted" style={{ fontSize: '12px', color: 'var(--status-success)' }}>{msg.focus}</p>}
                </form>
              </div>

              {hibernatedMissions.length > 0 && (
                <div className="mt-12">
                  <div className="technical-label mb-4" style={{ opacity: 0.6 }}>[ARCHIVED_MISSION_LOGS]</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {hibernatedMissions.map(m => (
                      <div key={m.id} className="card" style={{ padding: '24px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderStyle: 'dashed' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '4px' }}>{m.problem}</div>
                          <div className="mono text-muted" style={{ fontSize: '10px' }}>HIBERNATED ON {new Date(m.updatedAt || Date.now()).toLocaleDateString().toUpperCase()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className="btn" 
                            style={{ borderColor: 'var(--status-active)', color: 'var(--status-active)', fontWeight: 800, fontSize: '11px' }}
                            onClick={async () => {
                              if (!confirm('Re-activate this mission?')) return;
                              const res = await fetch('/api/focus', {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ ...m, status: 'Active' }),
                              });
                              if (res.ok) fetchAll();
                            }}
                          >
                            RESTORE MISSION
                          </button>
                          <button 
                            className="btn" 
                            style={{ borderColor: '#ef4444', color: '#ef4444', fontWeight: 800, fontSize: '11px' }}
                            onClick={async () => {
                              if (!confirm('PERMANENT DELETION: Are you sure you want to delete this archived mission?')) return;
                              const res = await fetch(`/api/focus/${m.id}`, { method: 'DELETE' });
                              if (res.ok) fetchAll();
                            }}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* UPDATES TAB */}
          {activeTab === 'updates' && (
            <div className="fade-in">
              <div className="mb-8">
                <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Roadmap Log</h1>
                <p className="text-muted">Document architectural milestones and build updates.</p>
              </div>
              <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                <div className="card">
                  <h3 className="mb-6">New Entry</h3>
                  <form onSubmit={handleAddUpdate}>
                    <div className="form-group">
                      <label className="label">Focus Title (Problem Statement)</label>
                      <input 
                        type="text" className="form-control" 
                        value={focus.problem} 
                        onChange={e => setFocus({...focus, problem: e.target.value})} 
                        placeholder="What problem are you solving?" 
                      />
                    </div>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="label" style={{ margin: 0 }}>Detailed Content / Gaps</label>
                        <button type="button" onClick={() => openFS(focus.description, 'focus')} className="btn" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px' }}>FULL SCREEN EDITOR</button>
                      </div>
                      <textarea 
                        className="form-control mono" rows={5} 
                        value={focus.description} 
                        onChange={e => setFocus({...focus, description: e.target.value})} 
                        placeholder="Detailed technical gaps..." 
                      />
                    </div>
                    <div className="sidebar-divider" style={{ margin: '24px 0' }} />
                    <div className="form-group">
                      <label className="label">Target Project / Activity</label>
                      <select 
                        className="form-control" 
                        value={updateProjectId} 
                        onChange={e => {
                          setUpdateProjectId(e.target.value);
                          if (e.target.value === '__FOCUS__') {
                            setFinalDestination(focus.finalDestination || '');
                          } else if (e.target.value.startsWith('__FOCUS_HIBERNATED_')) {
                            const id = e.target.value.replace('__FOCUS_HIBERNATED_', '').replace('__', '');
                            const m = hibernatedMissions.find(miss => miss.id.toString() === id);
                            setFinalDestination(m?.finalDestination || '');
                          } else if (e.target.value === '') {
                            setFinalDestination(settings.roadmapFinalDestination || '');
                          } else {
                            const p = (projects as any[]).find(proj => proj.id.toString() === e.target.value);
                            setFinalDestination(p?.finalDestination || '');
                          }
                        }}
                        style={{ fontSize: '15px', fontWeight: 600, height: '48px' }}
                      >
                        <option value="">-- General Roadmap (Global) --</option>
                        {focus.problem && (
                          <option value="__FOCUS__" style={{ fontWeight: 800, color: 'var(--status-success)' }}>
                            [CURRENTLY_WORKING_ON]: {focus.problem}
                          </option>
                        )}
                        {hibernatedMissions.length > 0 && (
                          <optgroup label="Hibernated Missions">
                            {hibernatedMissions.map(m => (
                              <option key={m.id} value={`__FOCUS_HIBERNATED_${m.id}__`}>
                                [HIBERNATED]: {m.problem}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        <optgroup label="System Modules">
                          {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="label">Entry Title (Milestone Name)</label>
                      <input type="text" className="form-control" value={updateTitle} onChange={e => setUpdateTitle(e.target.value)} required placeholder="e.g., Kernel Optimization Complete" />
                    </div>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="label" style={{ margin: 0 }}>Progress Log / Details</label>
                        <button type="button" onClick={() => openFS(updateContent, 'update')} className="btn" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px' }}>FULL SCREEN EDITOR</button>
                      </div>
                      <textarea className="form-control mono" rows={5} value={updateContent} onChange={e => setUpdateContent(e.target.value)} placeholder="Log a technical milestone..." />
                    </div>
                    <div className="form-group">
                      <label className="label" style={{ color: '#FFD700', fontWeight: 800 }}>Final Destination / Ultimate Goal</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input type="text" className="form-control" value={finalDestination} onChange={e => setFinalDestination(e.target.value)} placeholder="e.g., Global Deployment or AGI Achievement" style={{ flex: 1, border: '2px solid #FFD700', background: 'rgba(255, 215, 0, 0.05)' }} />
                        <button 
                          type="button" 
                          className="btn" 
                          onClick={async () => {
                            const isFocus = updateProjectId === '__FOCUS__';
                            const finalProjectId = isFocus ? (focus.projectId || '') : updateProjectId;
                            
                            let success = false;
                            if (finalProjectId) {
                              const res = await fetch(`/api/projects/${finalProjectId}`, {
                                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ finalDestination }),
                              });
                              if (res.ok) success = true;
                            }

                            if (isFocus) {
                              const newFocus = { ...focus, finalDestination };
                              setFocus(newFocus);
                              const res = await fetch('/api/focus', {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(newFocus),
                              });
                              if (res.ok) success = true;
                            }

                            if (success) flash('updates', '✓ Goal updated successfully!');
                            else flash('updates', finalProjectId || isFocus ? '✗ Failed to update.' : '! Please select a project first.');
                          }}
                          style={{ borderColor: '#FFD700', color: '#B8860B', fontWeight: 800, fontSize: '11px', whiteSpace: 'nowrap' }}
                        >
                          UPDATE GOAL ONLY
                        </button>
                        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #eee' }}>
                          <button 
                            type="button"
                            className="btn"
                            onClick={handleFocusUpdate}
                            style={{ width: '100%', borderColor: 'var(--accent)', color: 'var(--accent)', fontWeight: 800, fontSize: '11px', cursor: 'pointer', marginBottom: '8px' }}
                          >
                            UPDATE MISSION TITLE & CONTENT
                          </button>
                          <button 
                            type="button"
                            className="btn"
                            onClick={async () => {
                              if (!confirm('HIBERNATION PROTOCOL: This will archive the current active mission. Proceed?')) return;
                              const res = await fetch('/api/focus/hibernate', { method: 'POST' });
                              if (res.ok) {
                                flash('updates', '✓ Mission hibernated. Board cleared.');
                                setFocus({ id: null, problem: '', description: '', blurb: '', status: 'Active', projectId: '', milestone: '', finalDestination: '' });
                                setFinalDestination('');
                                setUpdateContent('');
                                fetchAll(); // Refresh to update hibernated list
                              } else {
                                flash('updates', '✗ Hibernation failed.');
                              }
                            }}
                            style={{ width: '100%', borderColor: '#444', color: '#888', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}
                          >
                            HIBERNATE CURRENT MISSION
                          </button>
                        </div>
                      </div>
                      <p className="mt-1" style={{ fontSize: '10px', color: '#888' }}>This updates the gold signpost at the end of the roadmap.</p>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', borderRadius: '12px', marginTop: '16px' }}>Post Update</button>
                    {msg.updates && <p className="mt-4 mono text-muted" style={{ fontSize: '12px' }}>{msg.updates}</p>}
                  </form>
                </div>
                <div className="card">
                  <h3 className="mb-6">Update History</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {updates.filter((u: any) => {
                      const pid = updateProjectId === '__FOCUS__' ? (focus.projectId || '') : updateProjectId;
                      if (!pid) return !u.projectId;
                      return u.projectId?.toString() === pid.toString();
                    }).map((u: any) => (
                      <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-secondary)' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{u.title}</span>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <button className="btn" style={{ color: '#ef4444', height: '32px', padding: '0 12px', fontSize: '11px', fontWeight: 700 }} onClick={() => handleDeleteUpdate(u.id)}>REMOVE</button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Special Final Destination Entry */}
                    {(finalDestination || (updateProjectId === '' && settings.roadmapFinalDestination)) && (
                      <div style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', 
                        border: '2px solid #FFD700', borderRadius: '10px', background: 'rgba(255, 215, 0, 0.1)',
                        boxShadow: '0 0 15px rgba(255, 215, 0, 0.1)'
                      }}>
                        <div>
                          <div className="mono" style={{ fontSize: '9px', fontWeight: 900, color: '#B8860B', marginBottom: '4px' }}>[FINAL_DESTINATION]</div>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#000' }}>{updateProjectId === '' ? settings.roadmapFinalDestination : finalDestination}</span>
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: 900, color: '#B8860B' }}>GOAL_POINT</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="fade-in">
              <div className="mb-8">
                <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Project Portfolio</h1>
                <p className="text-muted">Manage the global module registry.</p>
              </div>
              <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                <div className="card" style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                  <form onSubmit={handleAddProject}>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="label">Project Title</label>
                        <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="label">Current Milestone (Dropdown Selection)</label>
                        <select 
                          className="form-control" 
                          value={projectMilestone} 
                          onChange={e => setProjectMilestone(e.target.value)}
                          style={{ fontSize: '14px', fontWeight: 600 }}
                        >
                          <option value="">-- Select Milestone Title --</option>
                          {updates.map(u => (
                            <option key={u.id} value={u.title}>{u.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="label" style={{ margin: 0 }}>Core Description</label>
                        <button type="button" onClick={() => openFS(description, 'project')} className="btn" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px' }}>FULL SCREEN EDITOR</button>
                      </div>
                      <textarea className="form-control" rows={6} value={description} onChange={e => setDescription(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="label">Final Destination / Ultimate Goal</label>
                      <input type="text" className="form-control" value={finalDestination} onChange={e => setFinalDestination(e.target.value)} placeholder="e.g., Global Deployment or AGI Achievement" />
                    </div>
                    <div className="form-group">
                      <label className="label">Demo Video URL</label>
                      <input type="text" className="form-control" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://..." />
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '48px', borderRadius: '12px' }}>
                        {editingProject ? 'Save Changes' : 'Publish Module'}
                      </button>
                      {editingProject && (
                        <button type="button" onClick={handleCancelEdit} className="btn" style={{ height: '48px', borderRadius: '12px' }}>Cancel</button>
                      )}
                    </div>
                    {msg.projects && <p className="mt-4 mono text-muted" style={{ fontSize: '12px' }}>{msg.projects}</p>}
                  </form>
                </div>
                <div className="card">
                  <h3 className="mb-6">Module Index</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {projects.map((p: any) => (
                      <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{p.title}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn" style={{ height: '32px', padding: '0 12px', fontSize: '11px', fontWeight: 700 }} onClick={() => handleEditProject(p)}>EDIT</button>
                          <button className="btn" style={{ color: '#ef4444', height: '32px', padding: '0 12px', fontSize: '11px', fontWeight: 700 }} onClick={() => handleDeleteProject(p.id)}>DEL</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && (
            <div className="fade-in">
              <div className="mb-8">
                <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Engineering Blog</h1>
                <p className="text-muted">Publish technical insights and platform updates.</p>
              </div>
              <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
                <div className="card">
                  <h3 className="mb-6">{editingBlog ? 'Edit Post' : 'New Publication'}</h3>
                  <form onSubmit={handleAddBlog}>
                    <div className="form-group">
                      <label className="label">Headline</label>
                      <input type="text" className="form-control" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="label">Abstract / Excerpt</label>
                      <input type="text" className="form-control" value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="label" style={{ margin: 0 }}>Full Content (Markdown)</label>
                        <button type="button" onClick={() => openFS(blogContent, 'blog')} className="btn" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px' }}>FULL SCREEN EDITOR</button>
                      </div>
                      <textarea className="form-control mono" rows={12} value={blogContent} onChange={e => setBlogContent(e.target.value)} required style={{ fontSize: '13px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '48px', borderRadius: '12px' }}>
                        {editingBlog ? 'Update Publication' : 'Release Post'}
                      </button>
                      {editingBlog && (
                        <button type="button" onClick={() => { setEditingBlog(null); setBlogTitle(''); setBlogContent(''); setBlogExcerpt(''); }} className="btn" style={{ height: '48px', borderRadius: '12px' }}>Cancel</button>
                      )}
                    </div>
                    {msg.blog && <p className="mt-4 mono text-muted" style={{ fontSize: '12px' }}>{msg.blog}</p>}
                  </form>
                </div>
                <div className="card">
                  <h3 className="mb-6">Published Content</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {blogPosts.map((b: any) => (
                      <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>{b.title}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn" style={{ height: '32px', padding: '0 12px', fontSize: '11px', fontWeight: 700 }} onClick={() => handleEditBlog(b)}>EDIT</button>
                          <button className="btn" style={{ color: '#ef4444', height: '32px', padding: '0 12px', fontSize: '11px', fontWeight: 700 }} onClick={() => handleDeleteBlog(b.id)}>DEL</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QUOTES TAB */}
          {activeTab === 'quotes' && (
            <div className="fade-in">
              <div className="mb-8">
                <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Quote Management</h1>
                <p className="text-muted">Manage the rotating technical insights.</p>
              </div>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div className="card">
                  <h3 className="mb-6">{editingQuote ? 'Edit Quote' : 'New Quote'}</h3>
                  <form onSubmit={handleAddQuote}>
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <label className="label" style={{ margin: 0 }}>Insight Text</label>
                        <button type="button" onClick={() => openFS(quoteText, 'quote')} className="btn" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px' }}>FULL SCREEN EDITOR</button>
                      </div>
                      <textarea className="form-control" rows={4} value={quoteText} onChange={e => setQuoteText(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="label">Source / Designation</label>
                      <input type="text" className="form-control" value={quoteDesignation} onChange={e => setQuoteDesignation(e.target.value)} placeholder="e.g. Senior Software Engineer" />
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '48px', borderRadius: '12px' }}>
                        {editingQuote ? 'Save' : 'Add Quote'}
                      </button>
                      {editingQuote && (
                        <button type="button" onClick={() => { setEditingQuote(null); setQuoteText(''); setQuoteDesignation(''); }} className="btn" style={{ height: '48px', borderRadius: '12px' }}>Cancel</button>
                      )}
                    </div>
                    {msg.quotes && <p className="mt-4 mono text-muted" style={{ fontSize: '12px' }}>{msg.quotes}</p>}
                  </form>
                </div>
                <div className="card">
                  <h3 className="mb-6">Rotating Library</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {quotes.map((q: any, idx: number) => (
                      <div key={q.id} style={{ padding: '16px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                        <p style={{ fontSize: '14px', fontStyle: 'italic', marginBottom: '12px' }}>"{q.text}"</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button 
                              className="btn" 
                              style={{ height: '28px', width: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }} 
                              onClick={() => handleReorderQuote(q.id, 'up')}
                              disabled={idx === 0}
                            >↑</button>
                            <button 
                              className="btn" 
                              style={{ height: '28px', width: '28px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }} 
                              onClick={() => handleReorderQuote(q.id, 'down')}
                              disabled={idx === quotes.length - 1}
                            >↓</button>
                            <span className="text-muted" style={{ fontSize: '12px', marginLeft: '8px' }}>{q.designation}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn" style={{ height: '32px', padding: '0 12px', fontSize: '11px', fontWeight: 700 }} onClick={() => handleEditQuote(q)}>EDIT</button>
                            <button className="btn" style={{ color: '#ef4444', height: '32px', padding: '0 12px', fontSize: '11px', fontWeight: 700 }} onClick={() => handleDeleteQuote(q.id)}>DEL</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUGGESTIONS TAB */}
          {activeTab === 'suggestions' && (
            <div className="fade-in">
              <div className="mb-8">
                <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Community Feedback</h1>
                <p className="text-muted">Review and feature user suggestions.</p>
              </div>
              <div className="card">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {suggestions.length === 0 && <p className="text-muted">No suggestions received yet.</p>}
                  {suggestions.map((s: any) => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', border: '1px solid var(--border-color)', borderRadius: '16px', background: s.isFeatured ? 'rgba(var(--accent-rgb), 0.05)' : 'white' }}>
                      <div style={{ flex: 1, marginRight: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span className="mono" style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)', background: 'rgba(var(--accent-rgb), 0.1)', padding: '2px 8px', borderRadius: '4px' }}>SIGNAL_#{s.id}</span>
                          <span className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>{s.userName || 'Anonymous'} {s.userEmail ? `(${s.userEmail})` : ''}</span>
                        </div>
                        <h4 style={{ marginBottom: '8px', fontSize: '18px', fontWeight: 700 }}>{s.problem}</h4>
                        <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <div className="mono" style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>PROPOSED_SOLUTION:</div>
                          <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.6 }}>{s.solution || 'No specific solution proposed.'}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button 
                          className="btn" 
                          onClick={() => handleFeature(s.id, s.isFeatured)}
                          style={{ borderColor: s.isFeatured ? 'var(--accent)' : 'var(--border-color)', color: s.isFeatured ? 'var(--accent)' : 'inherit', height: '44px', fontWeight: 700, padding: '0 20px', whiteSpace: 'nowrap' }}
                        >
                          {s.isFeatured ? '✓ Featured' : 'Mark as Featured'}
                        </button>
                        <button 
                          className="btn" 
                          onClick={() => handleDeleteSuggestion(s.id)}
                          style={{ borderColor: '#ef4444', color: '#ef4444', height: '44px', fontWeight: 700, padding: '0 20px' }}
                        >
                          Delete Signal
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="fade-in" style={{ maxWidth: '800px' }}>
              <div className="mb-8">
                <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Site Content</h1>
                <p className="text-muted">Configure the global platform strings and identity.</p>
              </div>
              <div className="card" style={{ padding: '40px', background: 'white' }}>
                <form onSubmit={handleSettingsSave}>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="label" style={{ margin: 0 }}>Home Hero Title</label>
                      <button type="button" onClick={() => openFS(settings.homeHeroTitle || '', 'homeHeroTitle')} className="btn" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px' }}>FULL SCREEN EDITOR</button>
                    </div>
                    <textarea className="form-control" rows={2} value={settings.homeHeroTitle || ''} onChange={e => setSettings({ ...settings, homeHeroTitle: e.target.value })} placeholder="Engineering the Future of Systems." />
                  </div>
                  <div className="form-group">
                    <label className="label">Hero Title (Secondary/Focus)</label>
                    <input type="text" className="form-control" value={settings.heroTitle || ''} onChange={e => setSettings({ ...settings, heroTitle: e.target.value })} placeholder="WhizzyX Labs" />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="label" style={{ margin: 0 }}>Hero Subtitle / Bio</label>
                      <button type="button" onClick={() => openFS(settings.heroSubtitle || '', 'settings_subtitle')} className="btn" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px' }}>FULL SCREEN EDITOR</button>
                    </div>
                    <textarea className="form-control" rows={4} value={settings.heroSubtitle || ''} onChange={e => setSettings({ ...settings, heroSubtitle: e.target.value })} placeholder="Architecting the next generation..." />
                  </div>
                  <div className="form-group">
                    <label className="label">Roadmap Mission Tagline</label>
                    <input type="text" className="form-control mono" value={settings.missionTagline || ''} onChange={e => setSettings({ ...settings, missionTagline: e.target.value })} placeholder="e.g. CONQUER THE MARS" />
                  </div>
                  <div className="form-group">
                    <label className="label">Technology Stack Section Title</label>
                    <input type="text" className="form-control" value={settings.techStackTitle || ''} onChange={e => setSettings({ ...settings, techStackTitle: e.target.value })} placeholder="e.g. TECHNOLOGY STACK" />
                  </div>
                  <div className="form-group">
                    <label className="label">Technology Stack (Comma Separated)</label>
                    <input type="text" className="form-control" value={settings.techStack || ''} onChange={e => setSettings({ ...settings, techStack: e.target.value })} placeholder="React, Next.js, Rust..." />
                  </div>
                  <div className="form-group">
                    <label className="label">Hero Tagline / Status</label>
                    <input type="text" className="form-control" value={settings.heroTagline || ''} onChange={e => setSettings({ ...settings, heroTagline: e.target.value })} placeholder="STABLE_BUILD_VERSION_1.0" />
                  </div>
                  <div style={{ margin: '40px 0 24px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Founder Profile</h3>
                    <p className="text-muted" style={{ fontSize: '13px' }}>The human intelligence behind the architecture.</p>
                  </div>
                  <div className="form-group">
                    <label className="label">Founder Name</label>
                    <input type="text" className="form-control" value={settings.founderName || ''} onChange={e => setSettings({ ...settings, founderName: e.target.value })} placeholder="e.g. MANAS" />
                  </div>
                  <div className="form-group">
                    <label className="label">Professional Title</label>
                    <input type="text" className="form-control" value={settings.founderTitle || ''} onChange={e => setSettings({ ...settings, founderTitle: e.target.value })} placeholder="e.g. Lead Architect / Systems Engineer" />
                  </div>
                  <div className="form-group">
                    <label className="label">Main Roadmap Final Destination</label>
                    <input type="text" className="form-control" value={settings.roadmapFinalDestination || ''} onChange={e => setSettings({ ...settings, roadmapFinalDestination: e.target.value })} placeholder="Global Architectural Equilibrium" />
                  </div>
                  <div className="form-group">
                    <label className="label">Donate QR URL</label>
                    <input type="text" className="form-control" value={settings.founderAvatar || ''} onChange={e => setSettings({ ...settings, founderAvatar: e.target.value })} placeholder="https://.../avatar.png" />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <label className="label" style={{ margin: 0 }}>Founder Biography</label>
                      <button type="button" onClick={() => openFS(settings.founderBio || '', 'founderBio')} className="btn" style={{ fontSize: '11px', fontWeight: 700, padding: '4px 12px' }}>FULL SCREEN EDITOR</button>
                    </div>
                    <textarea className="form-control" rows={4} value={settings.founderBio || ''} onChange={e => setSettings({ ...settings, founderBio: e.target.value })} placeholder="Write about the vision and experience..." />
                  </div>

                  <div style={{ margin: '40px 0 24px', paddingTop: '40px', borderTop: '1px solid #eee' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800 }}>External Connects</h3>
                    <p className="text-muted" style={{ fontSize: '13px' }}>Manage how the community and companies reach you.</p>
                  </div>
                  <div className="form-group">
                    <label className="label">Donation QR Code URL</label>
                    <input type="text" className="form-control" value={settings.donateQrUrl || ''} onChange={e => setSettings({ ...settings, donateQrUrl: e.target.value })} placeholder="https://.../qr.png" />
                  </div>
                  <div className="form-group">
                    <label className="label">Public Contact Email (For Companies)</label>
                    <input type="email" className="form-control" value={settings.contactEmail || ''} onChange={e => setSettings({ ...settings, contactEmail: e.target.value })} placeholder="contact@whizzyx.corp" />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '52px', borderRadius: '12px', marginTop: '24px', fontWeight: 800 }}>Save All Changes</button>
                  {msg.settings && <p className="mt-4 mono text-muted" style={{ fontSize: '12px', color: 'var(--status-success)' }}>{msg.settings}</p>}
                </form>
              </div>
            </div>
          )}

          {/* CREDENTIALS TAB */}
          {activeTab === 'credentials' && (
            <div className="fade-in" style={{ maxWidth: '600px' }}>
              <div className="mb-8">
                <h1 style={{ fontSize: '28px', fontWeight: 800 }}>Security Settings</h1>
                <p className="text-muted">Update administrative access.</p>
              </div>
              <div className="card">
                <form onSubmit={handleCredentialsUpdate}>
                  <div className="form-group">
                    <label className="label">New Admin Username (Optional)</label>
                    <input type="text" className="form-control" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder={currentUsername} />
                  </div>
                  <div className="form-group">
                    <label className="label">New Admin Password</label>
                    <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', borderRadius: '12px', marginTop: '16px' }}>Update Credentials</button>
                  {msg.creds && <p className="mt-4 mono text-muted" style={{ fontSize: '12px' }}>{msg.creds}</p>}
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── FULL SCREEN EDITOR OVERLAY ── */}
      {isFSOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 9999, display: 'flex', flexDirection: 'column' }}>
          {/* Toolbar */}
          <div style={{ padding: '16px 32px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => insertTag('**', '**')} className="btn" title="Bold" style={{ fontWeight: 800, width: '36px' }}>B</button>
              <button onClick={() => insertTag('_', '_')} className="btn" title="Italic" style={{ fontStyle: 'italic', width: '36px' }}>I</button>
              <button onClick={() => togglePrefix('### ')} className="btn" title="Heading">H3</button>
              <button onClick={() => togglePrefix('- ')} className="btn" title="List">List</button>
              <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 8px' }} />
              <button onClick={() => insertTag('<span style="color:var(--accent)">', '</span>')} className="btn" style={{ color: 'var(--accent)', fontWeight: 700 }}>Accent</button>
              <button onClick={() => insertTag('<span style="color:#22c55e">', '</span>')} className="btn" style={{ color: '#22c55e', fontWeight: 700 }}>Green</button>
              <button onClick={() => insertTag('<span style="color:#f59e0b">', '</span>')} className="btn" style={{ color: '#f59e0b', fontWeight: 700 }}>Amber</button>
              <button onClick={() => insertTag('<span style="color:#ef4444">', '</span>')} className="btn" style={{ color: '#ef4444', fontWeight: 700 }}>Red</button>
              <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 8px' }} />
              <button onClick={() => insertTag('[', '](https://)')} className="btn">Link</button>
              <button onClick={() => insertTag('`', '`')} className="btn mono">Code</button>
              
              <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 8px' }} />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="mono text-muted" style={{ fontSize: '10px', fontWeight: 800 }}>FONT SIZE</span>
                <input 
                  type="range" 
                  min="12" 
                  max="48" 
                  value={fsFontSize} 
                  onChange={(e) => updateFontSize(parseInt(e.target.value))} 
                  style={{ width: '100px', cursor: 'pointer', accentColor: 'var(--accent)' }} 
                />
                <span className="mono" style={{ fontSize: '12px', width: '30px' }}>{fsFontSize}px</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span className="mono text-muted" style={{ fontSize: '12px' }}>WRITING MODE</span>
              <button onClick={() => setIsFSOpen(false)} className="btn" style={{ borderColor: '#ef4444', color: '#ef4444' }}>Discard</button>
              <button onClick={saveFS} className="btn btn-primary" style={{ padding: '0 32px', height: '40px', borderRadius: '8px' }}>SAVE CHANGES</button>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, overflow: 'hidden' }}>
            <textarea
              ref={fsTextareaRef}
              value={fsContent}
              onChange={e => setFSContent(e.target.value)}
              placeholder="Start writing technical excellence..."
              style={{ padding: '48px', fontSize: '18px', border: 'none', outline: 'none', resize: 'none', background: '#fff', borderRight: '1px solid var(--border-color)', lineHeight: '1.6', fontFamily: 'var(--font-mono)' }}
            />
            <div style={{ padding: '48px', overflowY: 'auto', background: '#fbfbfc' }}>
              <h4 className="mb-8" style={{ color: 'var(--text-muted)' }}>LIVE PREVIEW</h4>
              <div className="prose" style={{ fontSize: '18px' }}>
                <div dangerouslySetInnerHTML={{ __html: renderPreview(fsContent) }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
