'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

type Tab = 'home' | 'focus' | 'projects' | 'blog' | 'community' | 'join' | 'suggest';

const NAV_TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  )},
  { id: 'focus', label: 'Working On', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  )},
  { id: 'projects', label: 'Projects', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  )},
  { id: 'blog', label: 'Blog', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  )},
  { id: 'community', label: 'Community', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )},
  { id: 'join', label: 'Join WhizzyX', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
  )},
  { id: 'suggest', label: 'Suggest', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
  )},
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const [projects, setProjects]                   = useState([]);
  const [focus, setFocus]                         = useState<any>(null);
  const [featuredSuggestions, setFeaturedSugg]    = useState([]);
  const [quotes, setQuotes]                       = useState<string[]>([]);
  const [settings, setSettings]                   = useState<Record<string, string>>({});
  const [blogPosts, setBlogPosts]                 = useState<any[]>([]);
  const [updates, setUpdates]                     = useState<any[]>([]);
  const [filterProject, setFilterProject]         = useState<number | 'all'>('all');
  const [isFocusExpanded, setIsFocusExpanded]     = useState(false);

  // Community contributions
  const [contributions, setContributions] = useState<Record<number, any[]>>({});
  const [openContrib, setOpenContrib]     = useState<number | null>(null);
  const [contribText, setContribText]     = useState('');
  const [contribName, setContribName]     = useState('');
  const [contribSubmitting, setContribSubmitting] = useState(false);

  // Quote slider
  const [quoteIdx, setQuoteIdx]   = useState(0);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [autoPaused, setAutoPaused] = useState(false);
  const goNext = () => setQuoteIdx(i => (i + 1) % Math.max(quotes.length, 1));
  const goPrev = () => setQuoteIdx(i => (i - 1 + Math.max(quotes.length, 1)) % Math.max(quotes.length, 1));

  // Auto-advance every 4s, pauses on manual interaction for 8s
  useEffect(() => {
    if (quotes.length <= 1 || autoPaused) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [quotes.length, autoPaused, quoteIdx]);

  const handleManualNav = (fn: () => void) => {
    setAutoPaused(true);
    fn();
    setTimeout(() => setAutoPaused(false), 8000);
  };


  // Suggest form
  const [problem, setProblem]       = useState('');
  const [solution, setSolution]     = useState('');
  const [email, setEmail]           = useState('');
  const [userName, setUserName]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [suggestMsg, setSuggestMsg] = useState('');

  // Join form
  const [joinName, setJoinName]           = useState('');
  const [joinEmail, setJoinEmail]         = useState('');
  const [joinSkills, setJoinSkills]       = useState('');
  const [joinWhy, setJoinWhy]             = useState('');
  const [joinPortfolio, setJoinPortfolio] = useState('');
  const [joinSubmitting, setJoinSubmitting] = useState(false);
  const [joinMsg, setJoinMsg]             = useState('');

  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (spotlightRef.current)
        spotlightRef.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    fetch('/api/projects').then(r => r.json()).then(setProjects).catch(console.error);
    fetch('/api/focus').then(r => r.json()).then(setFocus).catch(console.error);
    fetch('/api/suggestions').then(r => r.json()).then(d => setFeaturedSugg(d.filter((s: any) => s.isFeatured))).catch(console.error);
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error);
    fetch('/api/blog').then(r => r.json()).then(setBlogPosts).catch(console.error);
    fetch('/api/updates').then(r => r.json()).then(setUpdates).catch(console.error);
    fetch('/api/quotes').then(r => r.json()).then((data: any[]) => {
      setQuotes(data.length > 0
        ? data.map(q => q.designation ? `"${q.text}" — ${q.designation}` : q.text)
        : [
            "You don't need to know everything to start. Just build.",
            'Continuous learning through continuous building.',
            'Refusing to settle for inefficient systems.',
            'Grounded, feasible solutions to daily friction.',
            'Technical innovation driven by non-linear thinking.',
            'Ideas are cheap, execution is everything.',
            'Solve real problems, not imaginary ones.',
          ]);
    }).catch(console.error);
  }, []);

  const repeatedQuotes = [...quotes, ...quotes, ...quotes];

  const heroTitle    = settings.heroTitle    || 'Self-Initiated Startup Idea & Creative Systems';
  const heroSubtitle = settings.heroSubtitle || 'Identifying and solving real-world inefficiencies through technical innovation and non-linear thinking.';
  const heroTagline  = settings.heroTagline  || '— Welcome to my workshop! 🛠️';
  const hasFocus     = focus && focus.problem && focus.problem !== 'No problem set yet.';

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const res = await fetch('/api/suggestions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem, solution, userEmail: email, userName }),
    });
    setSuggestMsg(res.ok ? '✓ Suggestion received! Thank you.' : '✗ Something went wrong.');
    if (res.ok) { setProblem(''); setSolution(''); setEmail(''); setUserName(''); }
    setSubmitting(false);
    setTimeout(() => setSuggestMsg(''), 5000);
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setJoinSubmitting(true);
    const res = await fetch('/api/collaborators', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: joinName, email: joinEmail, skills: joinSkills, why: joinWhy, portfolio: joinPortfolio }),
    });
    setJoinMsg(res.ok ? "✓ Application submitted! We'll review it soon." : '✗ Something went wrong. Please try again.');
    if (res.ok) { setJoinName(''); setJoinEmail(''); setJoinSkills(''); setJoinWhy(''); setJoinPortfolio(''); }
    setJoinSubmitting(false);
    setTimeout(() => setJoinMsg(''), 6000);
  };

  const fetchContributions = async (suggestionId: number) => {
    const res = await fetch(`/api/contributions?suggestionId=${suggestionId}`);
    const data = await res.json();
    setContributions(prev => ({ ...prev, [suggestionId]: data }));
  };

  const handleContribSubmit = async (e: React.FormEvent, suggestionId: number) => {
    e.preventDefault();
    setContribSubmitting(true);
    const res = await fetch('/api/contributions', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suggestionId, text: contribText, contributorName: contribName }),
    });
    if (res.ok) { setContribText(''); setContribName(''); fetchContributions(suggestionId); }
    setContribSubmitting(false);
  };

  return (
    <>
      {/* Background */}
      <div className="bg-base">
        <div className="bg-grid"></div>
        <div className="cursor-spotlight" ref={spotlightRef}></div>
      </div>

      {/* ── Header + Tabs ── */}
      <div className="sticky-tabs-wrapper">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0' }}>

            {/* Left: logo block */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', flexShrink: 0 }} onClick={() => setActiveTab('home')}>
              <div style={{ padding: '3px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                <img src="/logo.png" alt="WhizzyX Logo" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
              </div>
              <div className="logo" style={{ lineHeight: 1 }}>WhizzyX.</div>
            </div>

            {/* Right: tabs + admin */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0', flexShrink: 0 }}>
              {NAV_TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
                  style={{ padding: '0.6rem 1rem', fontSize: '0.88rem' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>{t.icon}{t.label}</span>
                </button>
              ))}
              <a href="/admin" style={{ fontSize: '0.8rem', opacity: 0.4, marginLeft: '1rem', padding: '0.6rem 0.5rem', whiteSpace: 'nowrap' }}>Admin</a>
            </nav>
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="tab-content-wrapper">

        {/* ══ HOME ══ */}
        {activeTab === 'home' && (
          <div className="tab-page fade-in">
            <div className="hero" style={{ paddingBottom: '2rem' }}>
              <div className="hero-orb"></div>
              <h1>{heroTitle}</h1>
              <p>{heroSubtitle}</p>
              <div style={{ marginTop: '1.5rem' }}>
                <span className="human-touch" style={{ transform: 'rotate(-3deg)', display: 'inline-block', fontSize: '1.6rem', opacity: 0.9 }}>{heroTagline}</span>
              </div>

              {/* Premium CTA buttons */}
              <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => setActiveTab('projects')} className="home-cta-btn cta-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <span>View Projects</span>
                  <svg className="cta-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <button onClick={() => setActiveTab('focus')} className="home-cta-btn cta-ghost">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                  <span>Current Focus</span>
                  <svg className="cta-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
                <button onClick={() => setActiveTab('join')} className="home-cta-btn cta-purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                  <span>Join WhizzyX</span>
                  <svg className="cta-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>

            {/* Interactive quote slider */}
            {quotes.length > 0 && (
              <div className="quote-slider-wrapper">
                <div
                  className="quote-slider-track"
                  onMouseDown={e => setDragStart(e.clientX)}
                  onMouseUp={e => { if (dragStart !== null) { const d = dragStart - e.clientX; if (d > 40) handleManualNav(goNext); else if (d < -40) handleManualNav(goPrev); setDragStart(null); }}}
                  onTouchStart={e => setDragStart(e.touches[0].clientX)}
                  onTouchEnd={e => { if (dragStart !== null) { const d = dragStart - e.changedTouches[0].clientX; if (d > 40) handleManualNav(goNext); else if (d < -40) handleManualNav(goPrev); setDragStart(null); }}}
                  style={{ userSelect: 'none', cursor: 'grab' }}
                >
                  <div className="quote-slide" key={quoteIdx}>
                    <div className="quote-mark-big">"</div>
                    <p className="quote-slide-text">{quotes[quoteIdx]}</p>
                    <span className="quote-slide-attr">— MJ</span>
                  </div>
                </div>
                <div className="quote-nav">
                  <button onClick={() => handleManualNav(goPrev)} className="quote-nav-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <div className="quote-dots">
                    {quotes.map((_: any, i: number) => (
                      <button key={i} onClick={() => { setAutoPaused(true); setQuoteIdx(i); setTimeout(() => setAutoPaused(false), 8000); }} className={`quote-dot ${i === quoteIdx ? 'active' : ''}`} />
                    ))}
                  </div>
                  <button onClick={() => handleManualNav(goNext)} className="quote-nav-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ WORKING ON ══ */}

        {activeTab === 'focus' && (
          <div className="tab-page fade-in">
            {/* Mini hero on this tab */}
            <div className="hero" style={{ paddingBottom: '2rem' }}>
              <div className="hero-orb"></div>
              <h1>{heroTitle}</h1>
              <p>{heroSubtitle}</p>
              <div style={{ marginTop: '1.5rem' }}>
                <span className="human-touch" style={{ transform: 'rotate(-3deg)', display: 'inline-block', fontSize: '1.6rem', opacity: 0.9 }}>{heroTagline}</span>
              </div>
            </div>

            {/* Marquee */}
            {repeatedQuotes.length > 0 && (
              <div className="marquee-wrapper" style={{ marginBottom: '3rem' }}>
                <div className="marquee-content">
                  {repeatedQuotes.map((q, i) => <span key={i} className="marquee-item">{q}</span>)}
                </div>
              </div>
            )}

            {hasFocus ? (
              <div className="container" style={{ maxWidth: '800px' }}>
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', border: '1px solid rgba(139,92,246,0.3)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
                  
                  <span className="status-tag" style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0.4rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {focus?.status || 'Active Research'}
                  </span>
                  
                  <h2 style={{ fontSize: '2.4rem', marginTop: '1.5rem', marginBottom: '1rem', color: '#fff', lineHeight: 1.2 }}>{focus?.problem}</h2>
                  
                  {focus?.project && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Currently Building:</span>
                      <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{focus.project.title}</strong>
                      <button onClick={() => setFilterProject(focus.project.id)} className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>View Roadmap</button>
                    </div>
                  )}
                  
                  {focus?.description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '1.5rem', maxWidth: '600px', marginInline: 'auto' }}>
                      {focus.description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="container" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>No active focus set yet. Check back soon!</p>
              </div>
            )}

            {/* Build Updates Timeline (Roadmap) */}
            <div className="container" style={{ maxWidth: '900px', marginTop: '4rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Graphical Roadmap</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>A living log of technical progress and creative evolution.</p>
                
                {projects.length > 0 && (
                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                    <button 
                      onClick={() => setFilterProject('all')} 
                      className={`btn ${filterProject === 'all' ? 'btn-primary' : ''}`}
                      style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', background: filterProject === 'all' ? undefined : 'rgba(255,255,255,0.05)' }}
                    >
                      All Updates
                    </button>
                    {projects.map((p: any) => (
                      <button 
                        key={p.id}
                        onClick={() => setFilterProject(p.id)}
                        className={`btn ${filterProject === p.id ? 'btn-primary' : ''}`}
                        style={{ padding: '0.4rem 1.2rem', fontSize: '0.85rem', background: filterProject === p.id ? undefined : 'rgba(255,255,255,0.05)' }}
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {updates.filter(u => filterProject === 'all' || u.projectId === filterProject).length > 0 ? (
                <div className="timeline">
                  {updates.filter(u => filterProject === 'all' || u.projectId === filterProject).map((upd: any) => (
                    <div key={upd.id} className="timeline-item">
                      <div className="timeline-dot" style={{ background: upd.category === 'Learning' ? '#10b981' : upd.category === 'Improvement' ? '#f59e0b' : '#3b82f6' }}></div>
                      <span className="timeline-date">
                        {new Date(upd.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <div className="timeline-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className={`category-tag category-${upd.category.toLowerCase()}`}>
                              {upd.category === 'Learning' && '🎓 '}
                              {upd.category === 'Improvement' && '📈 '}
                              {upd.category === 'Update' && '🚀 '}
                              {upd.category}
                            </span>
                          </div>
                          {upd.project && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                              Project: <strong style={{ color: '#fff' }}>{upd.project.title}</strong>
                            </span>
                          )}
                        </div>
                        
                        {upd.title && (
                          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>{upd.title}</h3>
                        )}
                        
                        {upd.excerpt && (
                          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1rem', borderLeft: '2px solid var(--accent)', paddingLeft: '0.75rem' }}>
                            {upd.excerpt}
                          </p>
                        )}

                        <div className="report-content" style={{ fontSize: '1rem' }}>
                          <ReactMarkdown>{upd.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', opacity: 0.5, padding: '4rem 0', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '24px' }}>
                  <p>No logged updates for this selection yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ PROJECTS ══ */}
        {activeTab === 'projects' && (
          <div className="tab-page fade-in container" style={{ maxWidth: '1200px' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 className="section-title" style={{ marginBottom: '1rem' }}>{settings.sectionProjectsTitle || 'Featured Projects'}</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                A collection of self-initiated systems, tools, and creative experiments designed to solve real-world friction.
              </p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2.5rem' }}>
              {projects.length > 0 ? projects.map((p: any) => (
                <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {p.videoUrl ? (
                    <div className="video-wrapper" style={{ margin: '0', borderRadius: '0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <iframe src={`https://www.youtube.com/embed/${p.videoUrl.split('v=')[1] || p.videoUrl.split('/').pop()}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  ) : (
                    <div style={{ height: '200px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    </div>
                  )}
                  
                  <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent)', fontWeight: 700, background: 'rgba(59,130,246,0.1)', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>Project</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(p.createdAt || Date.now()).getFullYear()}</span>
                    </div>
                    
                    <h3 className="project-title" style={{ fontSize: '1.6rem', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>{p.title}</h3>
                    <p className="project-desc" style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '2rem', flex: 1 }}>{p.description}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      {p.links ? (
                        <a href={p.links} target="_blank" rel="noopener noreferrer" className="home-cta-btn cta-blue" style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}>
                          <span>View Details</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      ) : (
                        <div style={{ height: '38px' }}></div>
                      )}
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold', color: '#fff' }}>MJ</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>MJ Build</span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                  <div style={{ marginBottom: '1.5rem', opacity: 0.3 }}>
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No projects published yet. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ BLOG ══ */}
        {activeTab === 'blog' && (
          <div className="tab-page fade-in">
            <div className="hero" style={{ paddingBottom: '2rem' }}>
              <div className="hero-orb"></div>
              <h1 style={{ fontSize: '3.5rem' }}>The Workshop Blog</h1>
              <p style={{ maxWidth: '600px', margin: '0 auto' }}>Deep dives into my building process, technical challenges, and creative philosophy.</p>
            </div>

            <div className="container" style={{ maxWidth: '900px', paddingBottom: '5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {blogPosts.map((post: any) => (
                  <article key={post.id} className="glass-card" style={{ padding: '2.5rem', border: '1px solid rgba(139,92,246,0.2)', transition: 'all 0.3s ease' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      <h2 style={{ fontSize: '2.2rem', color: '#fff', marginTop: '0.5rem', fontFamily: 'Outfit, sans-serif' }}>{post.title}</h2>
                    </div>
                    
                    {post.excerpt && (
                      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '1.5rem', borderLeft: '3px solid var(--accent)', paddingLeft: '1.25rem' }}>
                        {post.excerpt}
                      </p>
                    )}

                    <div className="report-content">
                      <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: '#fff' }}>MJ</div>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Written by <strong style={{ color: '#fff' }}>{post.author}</strong></span>
                    </div>
                  </article>
                ))}

                {blogPosts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.6 }}>
                    <p>No blog posts published yet. Stay tuned!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ COMMUNITY ══ */}
        {activeTab === 'community' && (
          <div className="tab-page fade-in container">
            <h2 className="section-title">{settings.sectionCommunityTitle || 'Community Wall'}</h2>
            <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
              Real problems spotted by the community. Click any card to contribute your solution idea.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
              {featuredSuggestions.length > 0 ? featuredSuggestions.map((s: any) => {
                const isOpen = openContrib === s.id;
                const cardContribs = contributions[s.id] || [];
                return (
                  <div key={s.id} className="glass-card community-card" style={{ cursor: 'default' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <span className="community-author">{s.userName || 'Anonymous'}</span>
                        <h3 className="project-title" style={{ fontSize: '1.1rem', marginTop: '0.5rem' }}>"{s.problem}"</h3>
                        {s.solution && <p className="project-desc" style={{ fontStyle: 'italic', marginTop: '0.4rem' }}>Original idea: {s.solution}</p>}
                      </div>
                      <button
                        onClick={() => { if (!isOpen) { setOpenContrib(s.id); fetchContributions(s.id); } else setOpenContrib(null); }}
                        className="btn"
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.8rem', flexShrink: 0, background: isOpen ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${isOpen ? 'var(--accent)' : 'var(--glass-border)'}`, color: isOpen ? '#93c5fd' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        {isOpen ? 'Close' : `Ideas (${cardContribs.length || '?'})`}
                      </button>
                    </div>

                    {isOpen && (
                      <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem' }}>
                        {cardContribs.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                            {cardContribs.map((c: any) => (
                              <div key={c.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>
                                  {(c.contributorName || 'A')[0].toUpperCase()}
                                </div>
                                <div>
                                  <span className="community-author" style={{ fontSize: '1rem' }}>{c.contributorName || 'Anonymous'}</span>
                                  <p style={{ color: '#e2e8f0', fontSize: '0.92rem', marginTop: '0.15rem', lineHeight: 1.5 }}>{c.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>No ideas yet — be the first!</p>
                        )}
                        <form onSubmit={(e) => handleContribSubmit(e, s.id)} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <textarea className="form-control" value={contribText} onChange={e => setContribText(e.target.value)} required placeholder="Your idea to solve this..." style={{ minHeight: '65px', fontSize: '0.92rem' }} />
                          <div style={{ display: 'flex', gap: '0.6rem' }}>
                            <input type="text" className="form-control" value={contribName} onChange={e => setContribName(e.target.value)} placeholder="Your name (optional)" style={{ flex: 1, fontSize: '0.88rem' }} />
                            <button type="submit" className="btn btn-primary" disabled={contribSubmitting} style={{ flexShrink: 0, padding: '0.45rem 1.1rem', fontSize: '0.88rem' }}>
                              {contribSubmitting ? '...' : 'Post'}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="glass-card" style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-secondary)' }}>No featured ideas yet. Submit yours in the Suggest tab!</p>
                </div>
              )}
            </div>
          </div>
        )}


        {/* ══ JOIN ══ */}
        {activeTab === 'join' && (
          <div className="tab-page fade-in container">
            <h2 className="section-title">🤝 Join WhizzyX</h2>
            <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Interested in building real-world solutions together? Share your details and we'll reach out.
            </p>
            <div className="glass-card" style={{ maxWidth: '680px', margin: '0 auto', border: '1px solid rgba(139,92,246,0.3)' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <span className="human-touch" style={{ fontSize: '1.4rem' }}>Tell us about yourself ✍️</span>
              </div>
              <form onSubmit={handleJoinSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="joinName">Full Name *</label>
                    <input id="joinName" type="text" className="form-control" value={joinName} onChange={e => setJoinName(e.target.value)} required placeholder="Your name" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="joinEmail">Email *</label>
                    <input id="joinEmail" type="email" className="form-control" value={joinEmail} onChange={e => setJoinEmail(e.target.value)} required placeholder="you@example.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="joinSkills">Your Skills / Expertise *</label>
                  <input id="joinSkills" type="text" className="form-control" value={joinSkills} onChange={e => setJoinSkills(e.target.value)} required placeholder="e.g. Python, Hardware, UI Design, Electronics..." />
                </div>
                <div className="form-group">
                  <label htmlFor="joinWhy">Why do you want to be part of WhizzyX? *</label>
                  <textarea id="joinWhy" className="form-control" value={joinWhy} onChange={e => setJoinWhy(e.target.value)} required placeholder="What draws you to this? What can you bring?" />
                </div>
                <div className="form-group">
                  <label htmlFor="joinPortfolio">Portfolio / GitHub / LinkedIn (Optional)</label>
                  <input id="joinPortfolio" type="text" className="form-control" value={joinPortfolio} onChange={e => setJoinPortfolio(e.target.value)} placeholder="https://..." />
                </div>
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={joinSubmitting} style={{ background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)' }}>
                    {joinSubmitting ? 'Sending...' : 'Send Application'}
                  </button>
                  {joinMsg && <p style={{ marginTop: '1rem', color: joinMsg.startsWith('✓') ? '#10b981' : '#ef4444' }}>{joinMsg}</p>}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══ SUGGEST ══ */}
        {activeTab === 'suggest' && (
          <div className="tab-page fade-in container">
            <h2 className="section-title">{settings.sectionSuggestTitle || 'Got a Problem to Solve?'}</h2>
            <p className="header-tagline" style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Spotted an inefficiency in daily life? Share it — the best ideas get featured on the Community Wall.
            </p>
            <div className="glass-card" style={{ maxWidth: '680px', margin: '0 auto' }}>
              <form onSubmit={handleSuggestSubmit}>
                <div className="form-group">
                  <label htmlFor="problem">What daily friction or inefficiency did you notice? *</label>
                  <textarea id="problem" className="form-control" value={problem} onChange={e => setProblem(e.target.value)} required placeholder="Describe the problem..." />
                </div>
                <div className="form-group">
                  <label htmlFor="solution">Any idea how to solve it?</label>
                  <textarea id="solution" className="form-control" value={solution} onChange={e => setSolution(e.target.value)} placeholder="Your idea or leave blank..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="userName">Name / Alias (Optional)</label>
                    <input id="userName" type="text" className="form-control" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Anonymous" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email (Optional)</label>
                    <input id="email" type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Suggestion'}
                  </button>
                  {suggestMsg && <p style={{ marginTop: '1rem', color: suggestMsg.startsWith('✓') ? '#10b981' : '#ef4444' }}>{suggestMsg}</p>}
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
