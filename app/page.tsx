'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import RoadmapView from '@/components/RoadmapView';

type Tab = 'home' | 'focus' | 'projects' | 'blog' | 'community' | 'join' | 'suggest' | 'support' | 'inquiry';

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
  { id: 'support', label: 'Support', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
  )},
  { id: 'inquiry', label: 'Reach Us', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>
  )},
];

/* Utility to render content with markdown-like breaks and HTML support */
const RenderContent = ({ content }: { content: string }) => {
  if (!content) return null;
  
  // 1. Convert Markdown-like syntax to HTML strings
  let processed = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="mono-inline">$1</code>')
    .replace(/^### (.*)$/gm, '<h3 style="font-size: 22px; font-weight: 800; margin: 24px 0 12px;">$1</h3>')
    .replace(/^[\s]*[-*]\s+(.*)$/gm, '<li>$1</li>');

  // 2. Wrap WHITELISTED tags so they survive the escape process
  processed = processed.replace(/<span style="(.*?)">(.*?)<\/span>/g, '[[SPAN style="$1"]]$2[[/SPAN]]');
  processed = processed.replace(/<strong>(.*?)<\/strong>/g, '[[STRONG]]$1[[/STRONG]]');
  processed = processed.replace(/<em>(.*?)<\/em>/g, '[[EM]]$1[[/EM]]');
  processed = processed.replace(/<h3 style="(.*?)">(.*?)<\/h3>/g, '[[H3 style="$1"]]$2[[/H3]]');
  processed = processed.replace(/<li>(.*?)<\/li>/g, '[[LI]]$1[[/LI]]');

  // 3. Escape all other HTML for security
  let safe = processed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 4. Restore the whitelisted tags from their placeholders
  safe = safe
    .replace(/\[\[SPAN style="(.*?)"\]\](.*?)\[\[\/SPAN\]\]/g, '<span style="$1">$2</span>')
    .replace(/\[\[STRONG\]\](.*?)\[\[\/STRONG\]\]/g, '<strong>$1</strong>')
    .replace(/\[\[EM\]\](.*?)\[\[\/EM\]\]/g, '<em>$1</em>')
    .replace(/\[\[H3 style="(.*?)"\]\](.*?)\[\[\/H3\]\]/g, '<h3 style="$1">$2</h3>')
    .replace(/\[\[LI\]\](.*?)\[\[\/LI\]\]/g, '<li>$1</li>');

  // 5. Group consecutive LI items into UL for proper bullet points
  safe = safe.replace(/(<li>.*?<\/li>(\n| )*)+/g, (match) => `<ul style="margin-bottom: 20px; padding-left: 20px; list-style-type: disc;">${match}</ul>`);

  // 6. Handle final line breaks
  safe = safe.replace(/\n/g, '<br/>');

  return (
    <div 
      className="prose-content"
      dangerouslySetInnerHTML={{ __html: safe }} 
    />
  );
};

/* Helper for one-line HTML rendering (e.g. titles) */
const renderText = (content: string) => {
  if (!content) return '';
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="mono-inline">$1</code>')
    .replace(/<span style="(.*?)">(.*?)<\/span>/g, '<span style="$1">$2</span>');
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const [projects, setProjects]                   = useState<any[]>([]);
  const [blogPosts, setBlogPosts]                 = useState<any[]>([]);
  const [focus, setFocus]                         = useState<any>(null);
  const [hibernatedMissions, setHibernatedMissions] = useState<any[]>([]);
  const [otherActiveMissions, setOtherActiveMissions] = useState<any[]>([]);
  const [updates, setUpdates]                     = useState<any[]>([]);
  const [featuredSuggestions, setFeaturedSuggestions] = useState<any[]>([]);
  const [quotes, setQuotes]                       = useState<any[]>([]);
  
  const [showFocusRoadmap, setShowFocusRoadmap]   = useState(false);
  const [activeProjectRoadmap, setActiveProjectRoadmap] = useState<any>(null);
  const [viewMode, setViewMode]                   = useState<'list' | '3d'>('list');

  // Lead Generation State
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [leadForm, setLeadForm] = useState({ name: '', email: '', interest: '' });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const [settings, setSettings]                   = useState<Record<string, string>>({});
  const [selectedUpdate, setSelectedUpdate]       = useState<any>(null);
  const [filterProject, setFilterProject]         = useState<number | 'all'>('all');
  const [isFocusExpanded, setIsFocusExpanded]     = useState(false);
  const [isFocusDescExpanded, setIsFocusDescExpanded] = useState(false);

  // Community contributions
  const [contributions, setContributions] = useState<Record<number, any[]>>({});
  const [openContrib, setOpenContrib]     = useState<number | null>(null);
  const [contribText, setContribText]     = useState('');
  const [contribName, setContribName]     = useState('');
  const [contribSubmitting, setContribSubmitting] = useState(false);

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

  // Inquiry form
  const [inquiryName, setInInquiryName]   = useState('');
  const [inquiryCompany, setInquiryCompany] = useState('');
  const [inquiryEmail, setInquiryEmail]   = useState('');
  const [inquiryMsg, setInquiryMsg]       = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryResult, setInquiryResult] = useState('');

  // New States
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProjectNav, setShowProjectNav] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  
  const fetchAll = async () => {
    try {
      const [projRes, blogRes, focusRes, updateRes, suggestRes, quoteRes, settingsRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/blog'),
        fetch('/api/focus?status=all'),
        fetch('/api/updates'),
        fetch('/api/suggestions'),
        fetch('/api/quotes'),
        fetch('/api/settings')
      ]);

      const allProjects = await projRes.json();
      const allBlogs    = await blogRes.json();
      const allFocus    = await focusRes.json();
      const allUpdates  = await updateRes.json();
      const allSuggest  = await suggestRes.json();
      const allQuotes   = await quoteRes.json();
      const allSettings = await settingsRes.json();

      setSettings(allSettings);
      setProjects(Array.isArray(allProjects) ? allProjects.filter((p: any) => !p.isHidden) : []);
      setBlogPosts(Array.isArray(allBlogs) ? allBlogs.filter((b: any) => !b.isHidden) : []);
      setUpdates(Array.isArray(allUpdates) ? allUpdates : []);
      setFeaturedSuggestions(Array.isArray(allSuggest) ? allSuggest.filter((s: any) => s.isFeatured) : []);
      
      if (Array.isArray(allQuotes)) {
        setQuotes(allQuotes.length > 0 ? allQuotes : [
          { text: "Building efficient systems.", designation: "SYSTEM_CORE" },
          { text: "Technical innovation.", designation: "ARCHITECT" },
          { text: "Execution is everything.", designation: "LEAD_ENG" }
        ]);
      }

      if (Array.isArray(allFocus)) {
        const active = allFocus.filter((f: any) => f.status !== 'Hibernated' && !f.isHidden);
        setFocus(active[0] || null);
        setOtherActiveMissions(active.slice(1));
        setHibernatedMissions(allFocus.filter((f: any) => f.status === 'Hibernated' && !f.isHidden));
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem('whizzyx_visitor_auth');
    if (auth) setIsAuthorized(true);

    const terms = localStorage.getItem('whizzyx_terms_accepted');
    if (!terms) setShowTermsModal(true);

    fetch('/api/visits', { method: 'POST' }).catch(() => {});
    
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && !sessionStorage.getItem('whizzyx_mobile_warned')) {
        setShowMobileWarning(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (quotes.length > 0) {
      const interval = setInterval(() => {
        setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [quotes]);

  const handleTabChange = (tab: Tab) => {
    if (tab === 'projects' && !isAuthorized) {
      setShowLeadModal(true);
      return;
    }
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const acceptTerms = () => {
    localStorage.setItem('whizzyx_terms_accepted', 'true');
    setShowTermsModal(false);
  };

  const navigateToProject = (id: number) => {
    if (!isAuthorized) {
      setShowLeadModal(true);
      return;
    }
    setFilterProject(id);
    setActiveTab('projects');
    setShowProjectNav(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dismissMobileWarning = () => {
    sessionStorage.setItem('whizzyx_mobile_warned', 'true');
    setShowMobileWarning(false);
  };

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.email) return;
    
    setIsSubmittingLead(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadForm)
      });
      if (res.ok) {
        localStorage.setItem('whizzyx_visitor_auth', 'true');
        setIsAuthorized(true);
        setShowLeadModal(false);
        setActiveTab('projects');
      }
    } catch (err) {
      console.error('Lead submission failed', err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const repeatedQuotes = [...quotes, ...quotes, ...quotes];

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

  return (
    <div className="min-h-screen bg-primary">
      <style>{`
        .timeline-item:last-child .timeline-line {
          display: none;
        }
        @keyframes leapCat {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-25px) rotate(-5deg) scale(1.1); }
        }
        @keyframes walkAlongRoad {
          0% { offset-distance: 0%; transform: scaleX(1); }
          48% { offset-distance: 100%; transform: scaleX(1); }
          50% { offset-distance: 100%; transform: scaleX(-1); }
          98% { offset-distance: 0%; transform: scaleX(-1); }
          100% { offset-distance: 0%; transform: scaleX(1); }
        }
        .walking-cat-road {
          offset-path: path("M 100 500 C 300 500 300 200 600 200 C 900 200 900 500 1200 500 C 1500 500 1500 200 1800 200 L 1900 200");
          position: absolute;
          width: 70px;
          height: 70px;
          animation: walkAlongRoad 40s linear infinite;
          z-index: 50;
          pointer-events: none;
        }
        .technical-label {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .status-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--status-active);
          box-shadow: 0 0 8px var(--status-active-glow);
          animation: pulse 2s infinite;
        }
        .status-pulse-hibernated {
          background: var(--status-hibernated);
          box-shadow: 0 0 8px var(--status-hibernated-glow);
        }
        .cat-inner {
          animation: leapCat 0.8s ease-in-out infinite;
          display: block;
          width: 100%;
          height: 100%;
          transform-origin: bottom center;
        }
        .cat-tail {
          animation: wagTail 0.3s ease-in-out infinite;
          transform-origin: 20px 75px;
        }
        .signpost {
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .signpost:hover {
          transform: scale(1.1) translateY(-10px);
          z-index: 50;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 24px;
          pointer-events: none;
        }
        .hover-detail-card {
          position: fixed;
          bottom: 40px;
          right: 40px;
          width: 450px;
          background: #fff;
          color: #000;
          padding: 32px;
          border: 3px solid #000;
          box-shadow: 12px 12px 0 #222;
          z-index: 3000;
          pointer-events: none;
          animation: slideInRight 0.3s ease-out;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        .technical-card {
          position: relative;
          background: #fff;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          padding: 32px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .technical-card:hover {
          border-color: var(--obsidian);
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .card-obsidian {
          background: var(--obsidian);
          color: #fff;
          border-color: var(--charcoal);
        }
        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.1);
          box-shadow: 0 0 12px 1px rgba(255,255,255,0.15);
          animation: scanLine 4s linear infinite;
          pointer-events: none;
          z-index: 10;
        }
        .technical-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(0,0,0,0.05) 1px, transparent 0);
          background-size: 24px 24px;
          opacity: 1;
          pointer-events: none;
        }
        .technical-card:hover {
          border-color: var(--text-primary);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .scan-anim {
          position: absolute;
          left: 10%;
          width: 80%;
          height: 2px;
          background: linear-gradient(to right, transparent, var(--text-primary), transparent);
          filter: blur(1px);
          box-shadow: 0 0 15px var(--text-primary);
          animation: scanLine 4s linear infinite;
          pointer-events: none;
          z-index: 10;
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes quoteGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
        .quote-module {
          position: relative;
          background: #000;
          background-image: 
            radial-gradient(at 0% 0%, rgba(var(--accent-rgb), 0.2) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
            linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0.03) 75%, transparent 75%, transparent),
            radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1.5px, transparent 0);
          background-size: 100% 100%, 100% 100%, 10px 10px, 40px 40px;
          border-radius: 32px;
          padding: 32px 48px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .quote-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(var(--accent-rgb), 0.2) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: quoteGlow 4s ease-in-out infinite;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin: 4px 12px;
          border-radius: 12px;
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          background: none;
          width: calc(100% - 24px);
          cursor: pointer;
          text-align: left;
        }
        .sidebar-item:hover {
          background: #fff;
          color: var(--text-primary);
          border-color: var(--border-color);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          transform: translateX(4px);
        }
        .sidebar-item.active {
          background: var(--text-primary) !important;
          color: #fff !important;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .sidebar-label {
          padding: 24px 24px 8px;
          font-size: 10px;
          font-weight: 900;
          color: var(--text-muted);
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        .sidebar-divider {
          height: 1px;
          background: var(--border-color);
          margin: 16px 24px;
          opacity: 0.5;
        }
        @media (max-width: 1024px) {
          .sidebar {
            position: fixed;
            left: -280px;
            top: 72px;
            bottom: 0;
            z-index: 1000;
            transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            width: 280px;
          }
          .sidebar.mobile-open {
            left: 0;
            box-shadow: 20px 0 50px rgba(0,0,0,0.1);
          }
          .main-content {
            margin-left: 0 !important;
            padding: 24px 16px !important;
          }
          .header-inner {
            padding: 0 16px !important;
          }
          .sidebar-overlay {
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.8);
            backdrop-filter: blur(8px);
            z-index: 999;
          }
          .projects-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .project-card-image {
            height: 200px !important;
          }
          .project-detail-header {
            flex-direction: column !important;
            gap: 24px !important;
          }
          .project-stats {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
      {/* ── Top Bar ── */}
      <header className="header">
        <div className="header-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isMobile && (
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isMobileMenuOpen ? (
                    <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  ) : (
                    <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
                  )}
                </svg>
              </button>
            )}
            <div className="logo" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
              <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
              <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>WhizzyX</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            {isMobile && showMobileWarning && (
              <div className="fade-in" style={{ background: 'var(--obsidian)', color: '#fff', padding: '6px 14px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                <span>[RESOLUTION_ALERT]: USE_DESKTOP_FOR_OPTIMAL_VIEW</span>
                <button onClick={dismissMobileWarning} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}>×</button>
              </div>
            )}
            {!isMobile && <a href="/admin" className="btn" style={{ border: 'none', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em' }}>ADMIN CONSOLE</a>}
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600 }}>WX</div>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {isMobile && isMobileMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
        {/* ── Sidebar ── */}
        <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <div style={{ padding: '0 24px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%', boxShadow: '0 0 8px #10B981', animation: 'pulse 2s infinite' }}></div>
            <div className="mono" style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.2em' }}>ENGINEERING_CORE</div>
          </div>

          <div className="sidebar-label">[ CORE_MISSION ]</div>
          {NAV_TABS.slice(0, 4).map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`sidebar-item ${activeTab === t.id ? 'active' : ''}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', opacity: activeTab === t.id ? 1 : 0.6 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
          
          <div className="sidebar-divider" />
          <div className="sidebar-label">[ COMMUNITY_HUB ]</div>
          {NAV_TABS.slice(4, 7).map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`sidebar-item ${activeTab === t.id ? 'active' : ''}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', opacity: activeTab === t.id ? 1 : 0.6 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}

          <div className="sidebar-divider" />
          <div className="sidebar-label">[ EXTERNAL_CONNECT ]</div>
          {NAV_TABS.slice(7).map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`sidebar-item ${activeTab === t.id ? 'active' : ''}`}
            >
              <span style={{ display: 'flex', alignItems: 'center', opacity: activeTab === t.id ? 1 : 0.6 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
          <div style={{ padding: '40px 24px 0', borderTop: '1px solid var(--border-color)', marginTop: '32px' }}>
            <p className="text-muted" style={{ fontSize: '11px', lineHeight: '1.7' }}>
              Systematic optimization.<br/>
              © {new Date().getFullYear()} WhizzyX Lab
            </p>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="content-area">
          {/* Quote Slider (Slide Show) */}
          {quotes.length > 0 && (
            <div className="quote-module text-center" style={{ marginBottom: '24px' }}>
              <div className="quote-glow"></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em', marginBottom: '32px' }} className="mono">
                  [SYSTEM://VISIONARY_LOG]
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#fff', marginBottom: '24px', fontStyle: 'italic', lineHeight: 1.4 }}>
                  “{quotes[currentQuoteIndex]?.text || 'Loading vision...'}”
                </h2>
                <div className="mono" style={{ fontSize: '12px', fontWeight: 800, color: '#fff', letterSpacing: '0.1em', opacity: 0.8 }}>
                  — {quotes[currentQuoteIndex]?.designation || 'SYSTEM_CORE'}
                </div>
              </div>
              
              <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px' }}>
                {quotes.map((_: any, idx: number) => (
                  <div 
                    key={idx} 
                    onClick={() => setCurrentQuoteIndex(idx)}
                    style={{ 
                      width: idx === currentQuoteIndex ? '24px' : '6px', 
                      height: '6px', 
                      background: idx === currentQuoteIndex ? 'var(--accent)' : 'rgba(255,255,255,0.2)', 
                      borderRadius: '3px',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* ══ HOME TAB (Creative Freedom Redesign) ══ */}
          {activeTab === 'home' && (
            <div className="fade-in" style={{ maxWidth: '1200px', paddingTop: '0px' }}>
              <section className="mb-16">
                <h1 
                  style={{ fontSize: '56px', fontWeight: 800, marginBottom: '24px', letterSpacing: '-0.05em', lineHeight: 1.15 }}
                  dangerouslySetInnerHTML={{ __html: renderText(settings.homeHeroTitle || 'Engineering the <span style="color:var(--text-muted)">Future of Systems.</span>') }}
                />
                <p style={{ fontSize: '22px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '850px', lineHeight: '1.6' }}>
                  {heroSubtitle}
                </p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div className="mono" style={{ fontSize: '13px', background: 'var(--text-primary)', color: 'white', padding: '10px 20px', borderRadius: '12px', display: 'inline-block', fontWeight: 600 }}>
                    {heroTagline}
                  </div>
                  <button onClick={() => setActiveTab('projects')} className="btn" style={{ height: '44px', fontWeight: 600, border: '1px solid var(--border-color)', background: 'white' }}>
                    {settings.homeExploreModulesBtn || 'EXPLORE MODULES →'}
                  </button>
                </div>
              </section>

              {focus && (
                <div className="grid" style={{ gridTemplateColumns: '1.6fr 1fr', gap: '32px', marginBottom: '64px' }}>
                  <div className="technical-card card-obsidian" style={{ padding: '48px', minHeight: '380px' }}>
                    <div className="scan-line"></div>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div className="badge mb-6" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '10px', fontWeight: 800 }}>ACTIVE EXPEDITION</div>
                      <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '20px', color: '#fff', letterSpacing: '-0.03em' }}>{focus?.problem || 'Architecting Excellence'}</h2>
                      <div className="prose mb-10" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        <RenderContent content={focus?.blurb || focus?.milestone || 'Executing high-priority system architectural upgrades and performance optimization.'} />
                      </div>
                      <button onClick={() => setActiveTab('focus')} className="btn" style={{ height: '48px', padding: '0 28px', background: '#fff', color: '#000', borderRadius: '10px', fontSize: '13px', fontWeight: 800 }}>
                        READ FULL MISSION
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-8">
                    <div className="technical-card" style={{ background: 'var(--ghost)' }}>
                      <div className="technical-label mb-2">ACTIVE DEPLOYMENTS</div>
                      <div style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1, color: 'var(--obsidian)' }}>{projects.length}</div>
                      <div className="text-muted" style={{ fontSize: '12px', fontWeight: 600 }}>LIVE IN PRODUCTION</div>
                    </div>
                    <div className="technical-card card-obsidian">
                      <div className="scan-line" style={{ animationDelay: '1.5s' }}></div>
                      <div className="technical-label mb-2" style={{ opacity: 0.5 }}>ARCHITECTURAL HEALTH</div>
                      <div style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1 }}>{settings.homeHealthValue || '99.8%'}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, opacity: 0.7 }}>UPTIME & OPTIMIZATION RATE</div>
                    </div>
                  </div>
                </div>
              )}

              <section className="mb-20">
                <div className="mono text-muted mb-6" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em' }}>{settings.techStackTitle || 'TECHNOLOGY STACK'}</div>
                <div className="flex flex-wrap gap-4">
                  {(settings.techStack ? settings.techStack.split(',') : ['React', 'Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'TailwindCSS', 'Node.js', 'Rust', 'Vercel', 'AWS']).map((tech: string) => (
                    <div key={tech} className="badge" style={{ padding: '12px 24px', fontSize: '14px', background: 'var(--bg-secondary)', fontWeight: 600 }}>{tech.trim()}</div>
                  ))}
                </div>
              </section>

              {/* THE WHIZZYX PROTOCOL */}
              <section className="mt-24 mb-20">
                <div className="mb-12">
                  <div className="mono text-muted mb-4" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em' }}>[SYSTEM://PROTOCOL_V1.0]</div>
                  <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em' }}>The WhizzyX Protocol</h2>
                  <p className="text-muted" style={{ fontSize: '18px', maxWidth: '700px' }}>Our systematic architectural approach to identifying, engineering, and deploying modular solutions.</p>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
                  <div className="technical-card">
                    <div className="mono mb-4" style={{ color: 'var(--accent)', fontWeight: 800 }}>01. SIGNAL_DETECTION</div>
                    <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.6 }}>Scanning the real world for inefficiencies and technical gaps. We broadcast signals for problems that need a modular cure.</p>
                  </div>
                  <div className="technical-card" style={{ background: '#000', color: '#fff' }}>
                    <div className="scan-anim" style={{ background: 'linear-gradient(to right, transparent, #fff, transparent)' }}></div>
                    <div className="mono mb-4" style={{ color: '#fff', fontWeight: 800, opacity: 0.8 }}>02. SYSTEM_ARCHITECT</div>
                    <p style={{ fontSize: '14px', lineHeight: 1.6, opacity: 0.7 }}>Designing the high-fidelity blueprint. We engineer robust, non-linear systems to bridge identified gaps with code and logic.</p>
                  </div>
                  <div className="technical-card">
                    <div className="mono mb-4" style={{ color: 'var(--accent)', fontWeight: 800 }}>03. PRODUCTION_DEPLOY</div>
                    <p className="text-muted" style={{ fontSize: '14px', lineHeight: 1.6 }}>Releasing stable, production-ready modules. Every deployment is a verified solution to an original technical signal.</p>
                  </div>
                </div>
              </section>

              {/* ABOUT THE FOUNDER / ARCHITECT */}
              <section className="mb-24" style={{ padding: '60px', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.05 }}></div>
                <div style={{ display: 'flex', gap: '48px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ width: '180px', height: '180px', borderRadius: '24px', overflow: 'hidden', border: '4px solid #fff', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                      <img 
                        src={settings.founderAvatar || 'https://ui-avatars.com/api/?name=Architect&background=111&color=fff&size=256&bold=true'} 
                        alt="Founder" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="mono text-muted mb-4" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em' }}>[SYSTEM://ARCHITECT_INFO]</div>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>{settings.founderName || 'The Architect'}</h2>
                    <div className="mono mb-8" style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>{settings.founderTitle || 'Lead Systems Engineer'}</div>
                    <div className="prose" style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                      <RenderContent content={settings.founderBio || 'Driving the technical vision of WhizzyX through modular innovation and non-linear system design.'} />
                    </div>
                  </div>
                </div>
              </section>

              <div style={{ padding: '80px 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div className="mono text-muted mb-6" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em' }}>[SYSTEM://QUICK_ACCESS]</div>
                <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>Navigate the Engineering Registry</h3>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
                  {projects.slice(0, 3).map(p => (
                    <button 
                      key={p.id}
                      onClick={() => navigateToProject(p.id)}
                      className="btn"
                      style={{ padding: '16px 32px', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 800, fontSize: '14px', transition: 'all 0.3s' }}
                    >
                      {p.title} →
                    </button>
                  ))}
                  <button 
                    onClick={() => handleTabChange('projects')}
                    className="btn btn-primary"
                    style={{ padding: '16px 32px', borderRadius: '16px', fontWeight: 800, fontSize: '14px' }}
                  >
                    EXPLORE ALL MODULES
                  </button>
                </div>
              </div>

              <div style={{ padding: '80px 0', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                <div className="mono text-muted mb-6" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em' }}>[SYSTEM://TRANSITION_READY]</div>
                <h3 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>Ready to see the blueprint?</h3>
                <button 
                  onClick={() => {
                    setActiveTab('focus');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn btn-primary" 
                  style={{ height: '64px', padding: '0 48px', borderRadius: '32px', fontSize: '18px', fontWeight: 800, gap: '16px' }}
                >
                  PROCEED TO ROADMAP
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>

            </div>
          )}

          {/* ══ WORKING ON TAB ══ */}
          {activeTab === 'focus' && (
            <div className="fade-in" style={{ maxWidth: '100%' }}>
              <div className="mb-12">
                <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '8px' }}>Engineering Roadmap</h1>
                <p className="text-muted" style={{ fontSize: '18px' }}>Technical build logs</p>
              </div>
              {focus && focus.status !== 'Hibernated' ? (
                <>
                  <div className="card mb-12" style={{ padding: '48px', background: 'white', borderLeft: '6px solid var(--obsidian)', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <div className={`status-pulse ${focus.status === 'Hibernated' ? 'status-pulse-hibernated' : ''}`}></div>
                          <div className="technical-label">[SYSTEM://{focus.status?.toUpperCase() || 'MISSION_LOG'}]</div>
                        </div>
                        <div className="mb-6" style={{ display: 'inline-block', padding: '18px 36px', background: 'white', border: '2px solid var(--obsidian)', borderRadius: '4px', boxShadow: '8px 8px 0px var(--obsidian)' }}>
                            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>{focus.problem}</h2>
                        </div>
                      </div>
                      {focus.projectId && (
                        <div style={{ textAlign: 'right' }}>
                          <div className="mb-2 mono text-muted" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em' }}>[TARGET_MODULE]</div>
                          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            {(projects as any[]).find((p: any) => p.id.toString() === focus.projectId.toString())?.title || 'System Core'}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="prose" style={{ fontSize: '17px', color: '#444', lineHeight: '1.7', maxWidth: '1000px', position: 'relative' }}>
                      <div style={isFocusExpanded ? {} : { display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {(() => {
                          const title = focus.problem || '';
                          const desc = focus.description || '';
                          const blurb = focus.blurb || '';
                          const milestone = focus.milestone || '';
                          
                          if (isFocusExpanded) {
                            return (
                              <div className="fade-in">
                                <div className="mb-6">
                                  <div className="mono text-muted mb-2" style={{ fontSize: '10px', fontWeight: 800 }}>[MISSION_OBJECTIVE]</div>
                                  <RenderContent content={title} />
                                </div>
                                {desc && desc !== title && (
                                  <div className="mb-6">
                                    <div className="mono text-muted mb-2" style={{ fontSize: '10px', fontWeight: 800 }}>[TECHNICAL_LOG_DETAILS]</div>
                                    <RenderContent content={desc} />
                                  </div>
                                )}
                                {blurb && blurb !== title && blurb !== desc && (
                                  <div className="mb-6">
                                    <div className="mono text-muted mb-2" style={{ fontSize: '10px', fontWeight: 800 }}>[SUMMARY_BLURB]</div>
                                    <RenderContent content={blurb} />
                                  </div>
                                )}
                                {milestone && milestone !== title && milestone !== desc && milestone !== blurb && (
                                  <div>
                                    <div className="mono text-muted mb-2" style={{ fontSize: '10px', fontWeight: 800 }}>[ROADMAP_MILESTONE]</div>
                                    <RenderContent content={milestone} />
                                  </div>
                                )}
                              </div>
                            );
                          }
                          
                          // Collapsed: Find a non-title blurb
                          let collapsedText = 'Technical deep-dive into system architectural upgrades and performance optimization.';
                          if (blurb && blurb.trim() !== title.trim()) collapsedText = blurb;
                          else if (milestone && milestone.trim() !== title.trim()) collapsedText = milestone;
                          else if (desc && desc.trim() !== title.trim()) collapsedText = desc;
                          else if (title.includes('\n')) collapsedText = title.split('\n').slice(1).join(' ');
                          
                          return <RenderContent content={collapsedText} />;
                        })()}
                      </div>
                      
                      <button 
                        onClick={() => setIsFocusExpanded(!isFocusExpanded)}
                        style={{ 
                          marginTop: '12px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px', 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--accent)', 
                          fontWeight: 700, 
                          fontSize: '13px', 
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        {isFocusExpanded ? 'COLLAPSE' : 'READ FULL MISSION'}
                        <svg 
                          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" 
                          style={{ transform: isFocusExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end mb-8">
                    <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <button 
                        onClick={() => setViewMode('list')}
                        style={{ 
                          padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                          background: viewMode === 'list' ? 'var(--bg-primary)' : 'transparent',
                          color: viewMode === 'list' ? 'var(--text-primary)' : 'var(--text-secondary)',
                          boxShadow: viewMode === 'list' ? 'var(--shadow-sm)' : 'none',
                          border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        LIST
                      </button>
                      <button 
                        onClick={() => setShowFocusRoadmap(true)}
                        style={{ 
                          padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 700,
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          boxShadow: 'none',
                          border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center'
                        }}
                      >
                        3D MAP ↗
                      </button>
                    </div>
                  </div>

                  {/* MILESTONE LIST VIEW */}
                  {viewMode === 'list' && (
                    <div className="fade-in mb-16">
                      {(() => {
                        const missionUpdates = updates.filter((u: any) => {
                          const pid = focus.projectId;
                          if (!pid) return !u.projectId;
                          return u.projectId?.toString() === pid.toString();
                        });

                        if (missionUpdates.length === 0) {
                          return (
                            <div className="p-12 text-center" style={{ background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                              <div className="mono text-muted mb-4" style={{ fontSize: '11px' }}>[SYSTEM_LOG://NO_MILESTONES_FOUND]</div>
                              <p className="text-muted">No technical milestones have been logged for this mission yet.</p>
                            </div>
                          );
                        }

                        return (
                          <div style={{ position: 'relative', paddingLeft: '48px' }}>
                            <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '2px', background: 'var(--border-color)', opacity: 0.5 }}></div>
                            
                            <div className="flex flex-col gap-10">
                              {missionUpdates.map((update: any, idx: number) => (
                                <div key={update.id} className="relative">
                                  <div style={{ 
                                    position: 'absolute', left: '-36px', top: '4px', 
                                    width: '18px', height: '18px', borderRadius: '50%', 
                                    background: idx === 0 ? 'var(--accent)' : 'var(--bg-primary)', 
                                    border: `3px solid ${idx === 0 ? 'var(--accent)' : 'var(--text-primary)'}`,
                                    boxShadow: idx === 0 ? '0 0 12px var(--accent)' : 'none',
                                    zIndex: 2
                                  }}></div>
                                  
                                  <div className="card" style={{ padding: '32px', background: 'white' }}>
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <div className="mono text-muted mb-2" style={{ fontSize: '10px', fontWeight: 800 }}>[MILESTONE_LOG: {new Date(update.createdAt).toLocaleDateString()}]</div>
                                        <h3 style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em' }}>{update.title}</h3>
                                      </div>
                                      <div className="badge" style={{ background: 'var(--bg-secondary)', fontSize: '10px' }}>#{missionUpdates.length - idx}</div>
                                    </div>
                                    <div className="prose" style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                                      <RenderContent content={update.content} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* OTHER ACTIVE MISSIONS */}
                  {otherActiveMissions.length > 0 && (
                    <div className="mt-16 mb-16">
                      <div className="mono text-muted mb-8" style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.3em' }}>[SYSTEM://PARALLEL_EXPEDITIONS]</div>
                      <div className="grid projects-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '32px' }}>
                        {otherActiveMissions.map((mission: any) => (
                          <div key={mission.id} className="card" style={{ padding: '32px', background: 'white', borderLeft: '4px solid var(--accent)' }}>
                            <div className="flex justify-between items-start mb-4">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div className="status-pulse"></div>
                                <div className="technical-label">{mission.status?.toUpperCase()}</div>
                              </div>
                              <button 
                                onClick={() => {
                                    // Swap this mission with the focus one
                                    const oldFocus = focus;
                                    setFocus(mission);
                                    setOtherActiveMissions(prev => [...prev.filter(m => m.id !== mission.id), oldFocus].sort((a,b) => b.id - a.id));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="mono" 
                                style={{ fontSize: '10px', fontWeight: 800, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}
                              >
                                [SWITCH_FOCUS]
                              </button>
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>{mission.problem}</h3>
                            <div className="prose mb-6" style={{ fontSize: '14px', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              <RenderContent content={mission.description} />
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="mono" style={{ fontSize: '10px', color: '#999' }}>LOG_ID: #{mission.id}</div>
                                <button 
                                    onClick={() => {
                                        setFocus(mission); // Temporary focus for roadmap
                                        setShowFocusRoadmap(true);
                                    }}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                                >
                                    VIEW ROADMAP ↗
                                </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="card" style={{ padding: '80px 48px', textAlign: 'center', background: 'var(--bg-secondary)', borderStyle: 'dashed', borderRadius: '24px', marginBottom: '64px' }}>
                  <div className="mono text-muted mb-6" style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.3em' }}>[SYSTEM://STANDBY]</div>
                  <h2 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--obsidian)', marginBottom: '16px' }}>Currently no mission in progress.</h2>
                  <p className="text-muted" style={{ fontSize: '18px', maxWidth: '500px', margin: '0 auto' }}>The architect is currently analyzing technical signals and drafting the next high-fidelity blueprint.</p>
                </div>
              )}
            </div>
          )}
          {/* HIBERNATED MISSIONS (TACTICAL ARCHIVE) */}
          {activeTab === 'focus' && hibernatedMissions.length > 0 && (
            <div className="fade-in mt-32 pt-24" style={{ borderTop: '2px dashed var(--border-color)', opacity: 0.8 }}>
              <div className="mb-12">
                <div className="mono text-muted mb-4" style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.3em' }}>[SYSTEM://TACTICAL_ARCHIVE]</div>
                <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>Hibernated Missions</h2>
                <p className="text-muted" style={{ fontSize: '17px', maxWidth: '700px' }}>Historical technical gaps identified and partially engineered, currently in long-term stasis.</p>
              </div>
              <div className="grid projects-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
                {hibernatedMissions.map((mission: any) => (
                  <div key={mission.id} className="card" style={{ padding: '40px', background: 'var(--bg-secondary)', borderStyle: 'dashed', borderColor: '#ccc' }}>
                    <div className="mono mb-4" style={{ fontSize: '10px', color: '#999', fontWeight: 900 }}>MISSION_STASIS_LOG: #{mission.id}</div>
                    <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>{mission.problem}</h3>
                    <p className="text-muted" style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>{mission.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#888', borderRadius: '50%' }}></div>
                      <span className="mono" style={{ fontSize: '11px', fontWeight: 800, color: '#888' }}>POWER_CONSUMPTION_MINIMAL</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ PROJECTS TAB ══ */}
          {activeTab === 'projects' && (
            <div className="fade-in">
              <div className="mb-12">
                <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em' }}>Module Index</h1>
                <p className="text-muted" style={{ fontSize: '18px' }}>The technical registry of WhizzyX engineering modules and modular systems.</p>
              </div>

              <div className="grid projects-grid" style={{ gap: '32px' }}>
                {projects.map((p: any) => {
                  const getYouTubeId = (url: string) => {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = url?.match(regExp);
                    return (match && match[2].length === 11) ? match[2] : null;
                  };
                  
                  const parts = (p.links || '').split('|||');
                  const demoLink = parts[1];
                  const uploadedThumb = parts[3];
                  const displayTitle = parts[4];

                  const youtubeId = getYouTubeId(p.videoUrl || '');
                  const youtubeThumb = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : null;
                  const thumbnailUrl = uploadedThumb || youtubeThumb;

                  // Clean description for preview (strip Markdown and HTML)
                  const cleanDesc = p.description
                    .replace(/<[^>]*>?/gm, '') // Strip HTML
                    .replace(/[#*_~`]/g, '')   // Strip Markdown
                    .slice(0, 85);

                  return (
                    <div 
                      key={p.id} 
                      onClick={() => window.open(`/projects/${p.id}`, '_blank')}
                      className="project-card"
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="project-thumbnail">
                        {thumbnailUrl ? (
                          <img src={thumbnailUrl} alt={p.title} className="thumbnail-img" />
                        ) : (
                          <div className="thumbnail-img" style={{ 
                            background: 'linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                          }}>
                            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                            <div className="mono" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: 900 }}>[MODULE_PREVIEW://{p.title.toUpperCase()}]</div>
                          </div>
                        )}
                        <div className="thumbnail-overlay">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <span className="badge" style={{ 
                                background: p.statusTag === 'Completed' ? '#10B981' : p.statusTag === 'Will Work in Future' ? '#3B82F6' : '#6B7280', 
                                color: 'white', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '9px' 
                              }}>
                                {p.statusTag || 'Just Idea'}
                              </span>
                              <span className="badge" style={{ background: 'rgba(0,0,0,0.8)', color: 'white', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '9px' }}>
                                {p.currentMilestone || 'STABLE'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="project-info">
                        <div className="project-avatar">
                          {p.title.charAt(0)}
                        </div>
                        <div className="project-details">
                          <h3 className="project-title" style={{ fontSize: '16px' }}>{displayTitle || p.title}</h3>
                          <p className="project-desc" style={{ fontSize: '13px' }}>{cleanDesc}...</p>
                          
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                            {demoLink && (
                              <div onClick={(e) => { e.stopPropagation(); window.open(demoLink, '_blank'); }} className="btn" style={{ background: '#10B981', color: 'white', fontSize: '10px', height: '28px', borderRadius: '6px' }}>
                                LIVE PROJECT
                              </div>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); setActiveProjectRoadmap(p); }}
                              className="btn" 
                              style={{ border: '1px solid #000', fontSize: '10px', height: '28px', borderRadius: '6px' }}
                            >
                              ROADMAP
                            </button>
                            <div className="btn" style={{ border: '1px solid #3B82F6', color: '#3B82F6', fontSize: '10px', height: '28px', borderRadius: '6px' }}>
                              VIEW SPECS
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ BLOG TAB ══ */}
          {activeTab === 'blog' && (
            <div className="fade-in" style={{ maxWidth: '900px' }}>
              <div className="mb-12">
                <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em' }}>Technical Journal</h1>
                <p className="text-muted" style={{ fontSize: '18px' }}>Deep dives into system architecture, engineering logic, and execution.</p>
              </div>

              {blogPosts.map((post: any) => (
                <div key={post.id} className="card mb-12" style={{ padding: '56px' }}>
                  <div className="mono text-muted mb-6" style={{ fontSize: '12px', letterSpacing: '0.1em', fontWeight: 700 }}>LOGGED: {new Date(post.createdAt).toLocaleDateString()}</div>
                  <div className="mb-2 mono text-muted" style={{ fontSize: '10px', fontWeight: 800 }}>[JOURNAL://TECH_LOG]</div>
                  <div className="mb-10" style={{ display: 'inline-block', padding: '18px 36px', background: 'white', border: '2px solid #111', borderRadius: '4px', boxShadow: '8px 8px 0px #111' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.2 }}>{post.title}</h2>
                  </div>
                  <div className="prose" style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    <RenderContent content={post.content} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ══ COMMUNITY TAB ══ */}
          {activeTab === 'community' && (
            <div className="fade-in">
              <div className="mb-12">
                <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em' }}>Technical Signals</h1>
                <p className="text-muted" style={{ fontSize: '18px' }}>Community-identified inefficiencies and modular feature signals.</p>
              </div>

              <div className="grid projects-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
                {featuredSuggestions.map((s: any) => (
                  <div key={s.id} className="card" style={{ borderLeft: '6px solid var(--text-primary)', padding: '32px' }}>
                    <div className="mb-6">
                      <span className="badge badge-warning" style={{ fontSize: '10px', borderRadius: '6px', padding: '4px 10px' }}>FEATURE SIGNAL</span>
                    </div>
                    <p style={{ fontWeight: 700, marginBottom: '20px', fontSize: '18px', lineHeight: '1.6', letterSpacing: '-0.01em' }}>{s.problem}</p>
                    <div className="text-muted mono" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>SOURCE: {s.userName || 'ANONYMOUS'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ JOIN TAB ══ */}
          {activeTab === 'join' && (
            <div className="fade-in" style={{ maxWidth: '700px' }}>
              <div className="mb-12">
                <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em' }}>Collaboration Gateway</h1>
                <p className="text-muted" style={{ fontSize: '18px' }}>Join the core engineering network and architect future systems.</p>
              </div>

              <div className="card" style={{ padding: '56px' }}>
                <form onSubmit={handleJoinSubmit}>
                  <div className="form-group">
                    <label className="label">Primary Identity</label>
                    <input type="text" className="form-control" value={joinName} onChange={e => setJoinName(e.target.value)} required placeholder="Full Name" style={{ height: '52px', fontSize: '16px' }} />
                  </div>
                  <div className="form-group">
                    <label className="label">Technical Stack</label>
                    <input type="text" className="form-control" value={joinSkills} onChange={e => setJoinSkills(e.target.value)} required placeholder="Primary modules/languages" style={{ height: '52px', fontSize: '16px' }} />
                  </div>
                  <div className="form-group">
                    <label className="label">Engineering Intent</label>
                    <textarea className="form-control" rows={5} value={joinWhy} onChange={e => setJoinWhy(e.target.value)} required placeholder="Why do you wish to collaborate?" style={{ fontSize: '16px', padding: '16px' }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '40px', height: '60px', fontSize: '18px', fontWeight: 800, borderRadius: '16px' }} disabled={joinSubmitting}>
                    {joinSubmitting ? 'Processing Application...' : 'Broadcast Application'}
                  </button>
                  {joinMsg && <div className="mt-10 p-6 bg-tertiary rounded-xl text-center mono" style={{ fontSize: '14px', fontWeight: 700, border: '1px solid var(--border-color)' }}>{joinMsg}</div>}
                </form>
              </div>
            </div>
          )}

          {/* ══ SUGGEST TAB ══ */}
          {activeTab === 'suggest' && (
            <div className="fade-in" style={{ maxWidth: '700px' }}>
              <div className="mb-12">
                <h1 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.03em' }}>Broadcast Technical Signal</h1>
                <p className="text-muted" style={{ fontSize: '18px' }}>Identify a technical gap or propose a new system module.</p>
              </div>

              <div className="card" style={{ padding: '48px' }}>
                <form onSubmit={handleSuggestSubmit}>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="label">Identity / Name</label>
                      <input type="text" className="form-control" value={userName} onChange={e => setUserName(e.target.value)} placeholder="e.g. System Architect" style={{ height: '48px' }} />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="label">Contact Email (Optional)</label>
                      <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="architect@whizzyx.corp" style={{ height: '48px' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="label">Signal / Technical Gap Description</label>
                    <textarea className="form-control" rows={4} value={problem} onChange={e => setProblem(e.target.value)} required placeholder="Detail the technical gap or modular proposal..." style={{ fontSize: '15px', padding: '16px' }} />
                  </div>
                  <div className="form-group">
                    <label className="label">Proposed Solution / Architecture (Optional)</label>
                    <textarea className="form-control" rows={4} value={solution} onChange={e => setSolution(e.target.value)} placeholder="How would you engineer the cure?" style={{ fontSize: '15px', padding: '16px' }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '32px', height: '60px', fontSize: '18px', fontWeight: 800, borderRadius: '16px' }} disabled={submitting}>
                    {submitting ? 'Transmitting Signal...' : 'Transmit Signal'}
                  </button>
                  {suggestMsg && <div className="mt-10 p-6 bg-tertiary rounded-xl text-center mono" style={{ fontSize: '14px', fontWeight: 700, border: '1px solid var(--border-color)' }}>{suggestMsg}</div>}
                </form>
              </div>
            </div>
          )}
          {/* ══ SUPPORT TAB ══ */}
          {activeTab === 'support' && (
            <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <div className="mb-12">
                <h1 style={{ fontSize: '36px', fontWeight: 800 }}>Support the Mission</h1>
                <p className="text-muted">Buy me a coffee and help fuel the next generation of architectural breakthroughs.</p>
              </div>
              <div className="card" style={{ padding: '64px', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '24px', marginBottom: '32px', border: '1px solid var(--border-color)' }}>
                  {settings.donateQrUrl ? (
                    <img src={settings.donateQrUrl} alt="Donate QR" style={{ width: '250px', height: '250px', borderRadius: '12px' }} />
                  ) : (
                    <div style={{ width: '250px', height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center' }}>
                      QR Code Pending.<br/>Please check back soon!
                    </div>
                  )}
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px' }}>Buy me a coffee ☕</h3>
                <p className="text-muted mb-8" style={{ maxWidth: '400px' }}>Every contribution helps maintain the infrastructure and accelerate the WhizzyX roadmap.</p>
                <div className="badge mono" style={{ background: '#111', color: '#fff', padding: '12px 24px', fontSize: '13px' }}>WHIZZYX_ECOSYSTEM_SUPPORT</div>
              </div>
            </div>
          )}

          {/* ══ INQUIRY TAB ══ */}
          {activeTab === 'inquiry' && (
            <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="mb-12">
                <h1 style={{ fontSize: '36px', fontWeight: 800 }}>Corporate Inquiry</h1>
                <p className="text-muted">Connect with WhizzyX for strategic partnerships, system licensing, or custom architectural consulting.</p>
              </div>
              <div className="card" style={{ padding: '48px', background: 'white' }}>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setInquirySubmitting(true);
                  // Mock submission
                  setTimeout(() => {
                    setInquiryResult('✓ Inquiry received. Our technical team will reach out shortly.');
                    setInInquiryName(''); setInquiryCompany(''); setInquiryEmail(''); setInquiryMsg('');
                    setInquirySubmitting(false);
                    setTimeout(() => setInquiryResult(''), 5000);
                  }, 1500);
                }}>
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="form-group">
                      <label className="label">Full Name</label>
                      <input type="text" className="form-control" value={inquiryName} onChange={e => setInInquiryName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                      <label className="label">Company Name</label>
                      <input type="text" className="form-control" value={inquiryCompany} onChange={e => setInquiryCompany(e.target.value)} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="label">Corporate Email</label>
                    <input type="email" className="form-control" value={inquiryEmail} onChange={e => setInquiryEmail(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Message / Objective</label>
                    <textarea className="form-control" rows={5} value={inquiryMsg} onChange={e => setInquiryMsg(e.target.value)} required placeholder="Describe your collaborative goals..." />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '52px', borderRadius: '12px', fontWeight: 800 }} disabled={inquirySubmitting}>
                    {inquirySubmitting ? 'TRANSMITTING...' : 'SEND CORPORATE INQUIRY'}
                  </button>
                  {inquiryResult && <p className="mt-4 mono" style={{ color: 'var(--status-success)', fontSize: '13px' }}>{inquiryResult}</p>}
                </form>
              </div>
              <div className="mt-8 p-6 mono" style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '12px', color: 'var(--text-muted)' }}>
                DIRECT_CHANNEL: {settings.contactEmail || 'contact@whizzyx.corp'}
              </div>
            </div>
          )}
          {activeProjectRoadmap && (
            <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.98)', pointerEvents: 'auto', padding: '2.5vh 2.5vw' }} onClick={() => setActiveProjectRoadmap(null)}>
              <div style={{ width: '95vw', height: '95vh', display: 'flex', borderRadius: '24px', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                <RoadmapView 
                  updates={updates.filter((u: any) => u.projectId?.toString() === activeProjectRoadmap.id?.toString())} 
                  title={`${activeProjectRoadmap.title} Roadmap`}
                  finalDestination={activeProjectRoadmap.finalDestination}
                  isModal={true}
                  onClose={() => setActiveProjectRoadmap(null)}
                />
              </div>
            </div>
          )}
          {showFocusRoadmap && (
            <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.98)', pointerEvents: 'auto', padding: '2.5vh 2.5vw' }} onClick={() => setShowFocusRoadmap(false)}>
              <div style={{ width: '95vw', height: '95vh', display: 'flex', borderRadius: '24px', overflow: 'hidden', border: '1px solid #333', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                <RoadmapView 
                  updates={updates.filter((u: any) => {
                    const pid = focus.projectId;
                    if (!pid) return !u.projectId;
                    return u.projectId?.toString() === pid.toString();
                  })} 
                  title={focus.problem || "Current Focus Mission"} 
                  finalDestination={focus.finalDestination}
                  isModal={true}
                  onClose={() => setShowFocusRoadmap(false)}
                />
              </div>
            </div>
          )}

          {showLeadModal && (
            <div className="modal-overlay" style={{ pointerEvents: 'auto', background: 'rgba(0,0,0,0.85)' }}>
              <div className="card" style={{ width: '100%', maxWidth: '450px', background: 'var(--obsidian)', color: '#fff', border: '1px solid #333', padding: '48px', position: 'relative' }}>
                <button onClick={() => setShowLeadModal(false)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#666', fontSize: '20px', cursor: 'pointer' }}>×</button>
                <div className="mono text-muted mb-8" style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.3em' }}>[SYSTEM://ACCESS_RESTRICTED]</div>
                <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '16px' }}>Project Archive Access</h2>
                <p className="text-muted mb-10" style={{ fontSize: '14px', lineHeight: 1.6 }}>To explore the WhizzyX engineering blueprints and modular systems, please identify yourself.</p>
                
                <form onSubmit={submitLead}>
                  <div className="form-group mb-6">
                    <label className="label" style={{ color: '#aaa' }}>LEGAL_NAME</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ background: '#111', border: '1px solid #333', color: '#fff', height: '48px' }}
                      value={leadForm.name}
                      onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="form-group mb-6">
                    <label className="label" style={{ color: '#aaa' }}>COMMUNICATION_ENDPOINT (EMAIL)</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      style={{ background: '#111', border: '1px solid #333', color: '#fff', height: '48px' }}
                      value={leadForm.email}
                      onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="form-group mb-10">
                    <label className="label" style={{ color: '#aaa' }}>PRIMARY_INTEREST</label>
                    <select 
                      className="form-control" 
                      style={{ background: '#111', border: '1px solid #333', color: '#fff', height: '48px' }}
                      value={leadForm.interest}
                      onChange={e => setLeadForm({...leadForm, interest: e.target.value})}
                    >
                      <option value="Research">Technical Research</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Licensing">System Licensing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '56px', background: '#fff', color: '#000', fontWeight: 800, fontSize: '14px' }} disabled={isSubmittingLead}>
                    {isSubmittingLead ? 'SYNCHRONIZING...' : 'INITIALIZE SESSION →'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {showTermsModal && (
            <div className="modal-overlay" style={{ pointerEvents: 'auto', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
              <div className="card" style={{ width: '100%', maxWidth: '550px', padding: '48px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
                <div className="mono text-muted mb-6" style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.2em' }}>[ PROTOCOL_ESTABLISHED_2026 ]</div>
                <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '24px' }}>Terms of Architectural Access</h2>
                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', maxHeight: '400px', overflowY: 'auto', paddingRight: '12px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ fontSize: '20px' }}>🛡️</div>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '15px' }}>Section 1.1: Experimental System Registry</h4>
                      <p className="text-muted" style={{ fontSize: '14px' }}>WhizzyX is a non-linear technical laboratory. You acknowledge that all architectural blueprints, modular structures, and logic systems are in a perpetual state of 'Alpha' flux and are provided strictly for research and observation.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ fontSize: '20px' }}>👁️</div>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '15px' }}>Section 2.4: Metadata & Telemetry Integrity</h4>
                      <p className="text-muted" style={{ fontSize: '14px' }}>To maintain platform stability, we collect high-fidelity session telemetry, including IP-based vector tracking and interaction logs. This data is used exclusively for internal system optimization and security audit trails.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ fontSize: '20px' }}>⚖️</div>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '15px' }}>Section 3.7: Intellectual Property Governance</h4>
                      <p className="text-muted" style={{ fontSize: '14px' }}>The modular systems and engineering concepts displayed here are the proprietary intellectual property of WhizzyX. Unauthorized redistribution, redlining, or commercial reverse-engineering is prohibited under global technical protocols.</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ fontSize: '20px' }}>🚫</div>
                    <div>
                      <h4 style={{ fontWeight: 800, fontSize: '15px' }}>Section 4.2: Liability & System Failure</h4>
                      <p className="text-muted" style={{ fontSize: '14px' }}>WhizzyX assumes zero liability for external system integrations or logical interpretations of provided documentation. Use of any modular logic is at the sole discretion and risk of the visiting entity.</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={acceptTerms} 
                  className="btn btn-primary" 
                  style={{ width: '100%', height: '56px', borderRadius: '16px', fontWeight: 800, fontSize: '15px' }}
                >
                  I ACKNOWLEDGE & AGREE →
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
