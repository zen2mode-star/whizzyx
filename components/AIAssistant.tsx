'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if AI is enabled
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (data.aiEnabled === 'true') {
          setIsEnabled(true);
        }
      });

    // Initialize Speech Recognition
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-IN'; // Better for Indian accent and Hinglish

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', content: text } as const];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
        if (isTtsEnabled) speak(data.message);
      } else {
        const errorMsg = data.error || 'System error: Unable to process request.';
        setMessages([...newMessages, { role: 'assistant', content: errorMsg }]);
        if (isTtsEnabled) speak(errorMsg);
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Connection failed. Please check your network.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const speak = (text: string) => {
    if (!isTtsEnabled) return;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      
      // CLEANING TEXT FOR NATURAL SPEECH
      let cleanText = text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/#(.*?)\n/g, '$1. ')   // Remove headers and add pause
        .replace(/-(.*?)\n/g, '$1. ')   // Remove bullet points and add pause
        .replace(/[`*]/g, '')           // Remove remaining symbols
        .replace(/\n/g, '. ')           // New lines to pauses
        .replace(/\. \. \./g, '...')     // Fix triple dots
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();
      
      const hasHindi = /[\u0900-\u097F]/.test(cleanText);
      
      let preferredVoice;
      if (hasHindi) {
        preferredVoice = voices.find(v => v.lang.startsWith('hi')) || voices.find(v => v.name.includes('Hindi'));
      }
      
      if (!preferredVoice) {
        preferredVoice = voices.find(v => v.lang === 'en-IN' || v.name.includes('India') || v.name.includes('Indian'));
      }
      
      if (!preferredVoice) {
        preferredVoice = voices.find(v => 
          (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google US English') || v.name.includes('Samantha')) && 
          v.lang.startsWith('en')
        );
      }

      if (preferredVoice) utterance.voice = preferredVoice;
      
      // Natural pacing logic
      utterance.rate = 1.0;
      utterance.pitch = 1.0; 
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopAll = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsLoading(false);
  };

  const renderMarkdown = (content: string) => {
    if (!content) return '';
    // Basic markdown for links and bold
    let processed = content
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #10B981; text-decoration: underline; font-weight: 800;">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 800; color: #fff;">$1</strong>')
      .replace(/\n/g, '<br/>');
    return processed;
  };

  if (!isEnabled) return null;

  return (
    <>
      {/* Floating Button */}
      <button 
        className="assistant-btn"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '64px',
          height: '64px',
          borderRadius: '32px',
          background: '#10B981',
          color: '#fff',
          border: 'none',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
          zIndex: 9999,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isOpen ? 'rotate(135deg) scale(0.9)' : 'rotate(0) scale(1)'
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          )}
        </svg>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="assistant-window" style={{
          position: 'fixed',
          bottom: '110px',
          right: '32px',
          width: '400px',
          maxWidth: 'calc(100vw - 64px)',
          height: '600px',
          maxHeight: 'calc(100vh - 160px)',
          background: '#0a0a0c',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes slideIn {
              from { transform: translateY(20px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @media (max-width: 600px) {
              .assistant-window {
                right: 16px !important;
                bottom: 100px !important;
                max-width: calc(100vw - 32px) !important;
              }
              .assistant-btn {
                right: 16px !important;
                bottom: 16px !important;
              }
            }
            .chat-scroll::-webkit-scrollbar { width: 4px; }
            .chat-scroll::-webkit-scrollbar-track { background: transparent; }
            .chat-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
          `}} />

          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(16, 185, 129, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>
                <div className="mono" style={{ fontSize: '10px', color: '#10B981', fontWeight: 900, letterSpacing: '0.2em', marginBottom: '2px' }}>AI_INTELLIGENCE_CORE</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>WhizzyAssistant</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => {
                  const newState = !isTtsEnabled;
                  setIsTtsEnabled(newState);
                  if (!newState && typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }}
                style={{ 
                  padding: '6px 12px', borderRadius: '6px', 
                  background: isTtsEnabled ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', 
                  color: isTtsEnabled ? '#10B981' : '#666', 
                  border: isTtsEnabled ? '1px solid #10B981' : '1px solid #333',
                  fontSize: '10px', fontWeight: 800, cursor: 'pointer' 
                }}
              >
                {isTtsEnabled ? 'VOICE ON' : 'VOICE OFF'}
              </button>
              <button 
                onClick={stopAll}
                style={{ padding: '6px 12px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 800, cursor: 'pointer', display: (isLoading || (typeof window !== 'undefined' && window.speechSynthesis.speaking)) ? 'block' : 'none' }}
              >
                STOP
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '30px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.5 }}>Hello! I am WhizzyAI. Ask me anything about WhizzyX projects, MJ's blogs, or platform updates.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: m.role === 'user' ? '#10B981' : 'rgba(255,255,255,0.05)',
                color: m.role === 'user' ? '#fff' : '#ccc',
                fontSize: '14px',
                lineHeight: 1.5,
                border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
              </div>
            ))}
            {isLoading && (
              <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '12px 16px', borderRadius: '16px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <div style={{ width: '6px', height: '6px', background: '#444', borderRadius: '30%' }} />
                  <div style={{ width: '6px', height: '6px', background: '#444', borderRadius: '30%' }} />
                  <div style={{ width: '6px', height: '6px', background: '#444', borderRadius: '30%' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={startListening}
                style={{ 
                  width: '48px', height: '48px', borderRadius: '12px', background: isListening ? '#ef4444' : 'rgba(255,255,255,0.05)', 
                  border: 'none', color: '#fff', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              </button>
              <input 
                type="text" 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Talk to module core..."
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0 16px', color: '#fff', outline: 'none' }}
              />
              <button 
                onClick={() => handleSend()}
                style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff', border: 'none', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
