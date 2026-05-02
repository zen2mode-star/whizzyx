'use client';

import React, { useState, useEffect, useRef } from 'react';

const HighlightedText = ({ text, highlightCharIndex }: { text: string, highlightCharIndex: number }) => {
  if (!text) return null;
  const words = text.split(/(\s+)/);
  let currentCharCount = 0;
  return (
    <>
      {words.map((word, i) => {
        const start = currentCharCount;
        const end = currentCharCount + word.length;
        currentCharCount = end;
        const isHighlighted = highlightCharIndex >= start && highlightCharIndex < end && !word.match(/^\s+$/);
        return (
          <span key={i} style={{ 
            backgroundColor: isHighlighted ? '#FFD700' : 'transparent', 
            color: isHighlighted ? '#000' : 'inherit', 
            transition: 'background-color 0.1s, color 0.1s',
            borderRadius: '2px',
            padding: isHighlighted ? '2px 0' : '0'
          }}>
            {word}
          </span>
        );
      })}
    </>
  );
};

const RenderContent = ({ content, highlightCharIndex = -1 }: { content: string, highlightCharIndex?: number }) => {
  if (!content) return null;
  let processed = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="mono-inline">$1</code>')
    .replace(/^### (.*)$/gm, '<h3 style="font-size: 22px; font-weight: 800; margin: 24px 0 12px;">$1</h3>')
    .replace(/^[\s]*[-*]\s+(.*)$/gm, '<li>$1</li>');

  processed = processed.replace(/<span style="(.*?)">(.*?)<\/span>/g, '[[SPAN style="$1"]]$2[[/SPAN]]');
  processed = processed.replace(/<strong>(.*?)<\/strong>/g, '[[STRONG]]$1[[/STRONG]]');
  processed = processed.replace(/<em>(.*?)<\/em>/g, '[[EM]]$1[[/EM]]');
  processed = processed.replace(/<h3 style="(.*?)">(.*?)<\/h3>/g, '[[H3 style="$1"]]$2[[/H3]]');
  processed = processed.replace(/<li>(.*?)<\/li>/g, '[[LI]]$1[[/LI]]');

  let safe = processed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  safe = safe.replace(/\[\[SPAN style="(.*?)"\]\](.*?)\[\[\/SPAN\]\]/g, '<span style="$1">$2</span>')
    .replace(/\[\[STRONG\]\](.*?)\[\[\/STRONG\]\]/g, '<strong>$1</strong>')
    .replace(/\[\[EM\]\](.*?)\[\[\/EM\]\]/g, '<em>$1</em>')
    .replace(/\[\[H3 style="(.*?)"\]\](.*?)\[\[\/H3\]\]/g, '<h3 style="$1">$2</h3>')
    .replace(/\[\[LI\]\](.*?)\[\[\/LI\]\]/g, '<li>$1</li>');

  safe = safe.replace(/(<li>.*?<\/li>(\n| )*)+/g, (match) => `<ul style="margin-bottom: 20px; padding-left: 20px; list-style-type: disc;">${match}</ul>`);
  safe = safe.replace(/\n/g, '<br/>');

  if (highlightCharIndex >= 0) {
    const plainText = content.replace(/[#*_`]/g, '').replace(/<[^>]*>/g, '');
    return <div className="prose-content"><HighlightedText text={plainText} highlightCharIndex={highlightCharIndex} /></div>;
  }
  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: safe }} />;
};

interface RoadmapViewProps {
  updates: any[];
  title?: string;
  finalDestination?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export default function RoadmapView({ updates, title = "The Project Journey", finalDestination, isModal = false, onClose }: RoadmapViewProps) {
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [offsetDist, setOffsetDist] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [contentHighlightChar, setContentHighlightChar] = useState(-1);
  const [titleHighlightChar, setTitleHighlightChar] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isManuallyClosed = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') { synthRef.current = window.speechSynthesis; }
    return () => { if (synthRef.current) synthRef.current.cancel(); };
  }, []);

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.8;
    synthRef.current.speak(utterance);
  };

  const speakUpdate = (upd: any, index: number) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const dateStr = new Date(upd.date).toLocaleDateString();
    const timeStr = new Date(upd.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const headerText = `Milestone reached on ${dateStr} at ${timeStr}. `;
    const plainContent = upd.content.replace(/[#*_`]/g, '').replace(/<[^>]*>/g, '');
    const fullText = `${headerText}${upd.title}. ${plainContent}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    const voices = synthRef.current.getVoices();
    const premiumVoice = voices.find(v => v.name.includes('Natural') && v.lang.includes('IN')) || voices.find(v => v.name.includes('Google') && v.lang.includes('IN')) || voices.find(v => v.lang.includes('IN')) || voices.find(v => v.name.includes('Natural')) || voices[0];
    if (premiumVoice) utterance.voice = premiumVoice;
    utterance.rate = 0.88; utterance.pitch = 1.02; utterance.volume = 1.0;
    const tStart = headerText.length; const tEnd = tStart + upd.title.length; const cStart = tEnd + 2;
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        if (event.charIndex >= tStart && event.charIndex < tEnd) { setTitleHighlightChar(event.charIndex - tStart); setContentHighlightChar(-1); }
        else if (event.charIndex >= cStart) { setContentHighlightChar(event.charIndex - cStart); setTitleHighlightChar(-1); }
        else { setTitleHighlightChar(-1); setContentHighlightChar(-1); }
      }
    };
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false); setContentHighlightChar(-1); setTitleHighlightChar(-1);
      if (!isManuallyClosed.current && index < updates.length - 1) { 
        setTimeout(() => { 
          if (!isManuallyClosed.current) {
            setSelectedUpdate(null); 
            handlePush(index + 1); 
          }
        }, 500); 
      }
    };
    synthRef.current.speak(utterance);
  };

  const closeUpdate = () => {
    isManuallyClosed.current = true;
    if (synthRef.current) synthRef.current.cancel();
    setSelectedUpdate(null);
    setIsSpeaking(false);
    setTitleHighlightChar(-1);
    setContentHighlightChar(-1);
  };

  const handleMainClose = () => {
    isManuallyClosed.current = true;
    if (synthRef.current) synthRef.current.cancel();
    if (onClose) onClose();
  };

  const handlePush = (targetIdx?: number) => {
    if (isWalking || updates.length === 0) return;
    const nextIdx = targetIdx !== undefined ? targetIdx : (currentIdx + 1) % updates.length;
    setIsWalking(true);
    const segmentWidth = 33.33;
    let newPercent = 0;
    if (nextIdx <= 3) newPercent = (nextIdx / 3) * segmentWidth;
    else if (nextIdx <= 6) newPercent = segmentWidth + ((nextIdx - 3) / 3) * segmentWidth;
    else newPercent = (segmentWidth * 2) + ((nextIdx - 6) / 3) * segmentWidth;
    setOffsetDist(newPercent);
    setCurrentIdx(nextIdx);
    setTimeout(() => {
      if (isManuallyClosed.current) {
        setIsWalking(false);
        return;
      }
      setIsWalking(false);
      setSelectedUpdate(updates[nextIdx]);
      speakUpdate(updates[nextIdx], nextIdx);
    }, 1500);
  };

  return (
    <div style={{ 
      background: isModal ? '#0a0a0c' : 'transparent', color: '#fff', position: 'relative',
      padding: isModal ? '40px' : '0', borderRadius: '0', width: '100%', 
      margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column'
    }}>
      <style>{`
        @keyframes walkCat { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-3px) rotate(1deg); } }
        @keyframes tailWag { from { transform: rotate(-20deg); } to { transform: rotate(20deg); } }
        @keyframes earTwitch { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(10deg); } }
        @keyframes swingLeg { from { transform: rotate(15deg); } to { transform: rotate(-15deg); } }
        
        .walking-cat-road { 
          offset-path: path("M 100 800 C 300 800 300 100 600 100 C 900 100 900 800 1200 800 C 1500 800 1500 100 1800 100 L 1900 100"); 
          position: absolute; 
          width: 60px; 
          height: 50px; 
          z-index: 50; 
          pointer-events: none; 
          transition: offset-distance 1.5s cubic-bezier(0.45, 0.05, 0.55, 0.95); 
        }
        .cat-inner { animation: walkCat 0.4s ease-in-out infinite; display: block; width: 100%; height: 100%; transform-origin: bottom center; }
        .cat-tail { transform-origin: 5px 30px; animation: tailWag 0.6s ease-in-out infinite alternate; }
        .cat-ear { transform-origin: bottom center; animation: earTwitch 1s ease-in-out infinite; }
        .cat-leg { transform-origin: top center; animation: swingLeg 0.4s ease-in-out infinite alternate; }
        
        .signpost { cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .signpost:hover { transform: scale(1.1) translateY(-10px); z-index: 50; }
        .update-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.92); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 24px; }
        .push-button { background: #fff; color: #000; border: 3px solid #000; padding: 12px 24px; font-weight: 900; font-size: 14px; letter-spacing: 0.1em; cursor: pointer; box-shadow: 6px 6px 0 #333; transition: all 0.2s; position: relative; overflow: hidden; }
        .push-button:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 #444; }
        .push-button:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #111; }
        .push-button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
      `}</style>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="mono" style={{ color: '#555', fontWeight: 800, letterSpacing: '0.2em', fontSize: '10px', marginBottom: '4px' }}>EXPEDITION_MAP://{title.toUpperCase().replace(/\s+/g, '_')}</div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>{title}</h2>
        </div>
        <div className="flex gap-3 items-center">
          {finalDestination && (
            <button 
                className="push-button mono"
                onClick={() => scrollRef.current?.scrollTo({ left: 1600, behavior: 'smooth' })}
                style={{ background: '#000', color: '#FFD700', borderColor: '#FFD700', padding: '10px 20px', fontSize: '11px' }}
            >
                {'GO_TO_GOAL ->'}
            </button>
          )}
          <button className="push-button mono" onClick={() => { isManuallyClosed.current = false; handlePush(); }} disabled={isWalking} style={{ padding: '10px 20px', fontSize: '11px' }}>
            {isWalking ? 'NAVIGATING...' : 'PROCEED_FORWARD >>'}
          </button>
          {onClose && (
            <button 
              onClick={handleMainClose} 
              className="push-button mono" 
              style={{ background: '#222', color: '#fff', borderColor: '#444', padding: '10px 20px', fontSize: '11px' }}
            >
              CLOSE_X
            </button>
          )}
        </div>
      </div>

      <div className="relative" style={{ flex: 1, minHeight: 0, background: 'rgba(20,20,25,0.5)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid #222', overflowX: 'hidden' }}>
        <div 
          ref={scrollRef}
          style={{ height: '100%', overflowX: 'auto', overflowY: 'hidden', padding: '40px 0' }}
        >
        {updates.length === 0 && !finalDestination ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#555' }}>
            <div className="mono" style={{ fontSize: '12px', marginBottom: '16px' }}>[SYSTEM_ERROR://NO_DATA_STREAM]</div>
            <div style={{ fontSize: '20px', fontWeight: 800 }}>No milestones logged for this module yet.</div>
          </div>
        ) : (
          <div style={{ minWidth: '2000px', height: '100%', position: 'relative', transform: 'scale(0.6)', transformOrigin: 'top left' }}>
            <svg width="2000" height="900" viewBox="0 0 2000 900" fill="none">
              <path d="M 100 800 C 300 800 300 100 600 100 C 900 100 900 800 1200 800 C 1500 800 1500 100 1800 100 L 1900 100" stroke="#000" strokeWidth="64" strokeLinecap="round" />
              <path d="M 100 800 C 300 800 300 100 600 100 C 900 100 900 800 1200 800 C 1500 800 1500 100 1800 100 L 1900 100" stroke="#222" strokeWidth="60" strokeLinecap="round" />
              <path d="M 100 800 C 300 800 300 100 600 100 C 900 100 900 800 1200 800 C 1500 800 1500 100 1800 100 L 1900 100" stroke="white" strokeWidth="1" strokeDasharray="10 30" strokeLinecap="round" opacity="0.1" />
            </svg>

            <div className="walking-cat-road" style={{ offsetDistance: `${offsetDist}%` }}>
               <svg viewBox="0 0 60 50" width="100%" height="100%">
                    <path className="cat-tail" d="M 10 30 Q 0 20 10 10" stroke="#FFD700" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <ellipse cx="30" cy="35" rx="15" ry="10" fill="#FFD700" />
                    <circle cx="45" cy="25" r="10" fill="#FFD700" />
                    <path className="cat-ear" d="M 40 18 L 38 10 L 44 16" fill="#FFD700" />
                    <path className="cat-ear" d="M 50 18 L 52 10 L 46 16" fill="#FFD700" />
                    <circle cx="42" cy="23" r="1.5" fill="#000" />
                    <circle cx="48" cy="23" r="1.5" fill="#000" />
                    <circle cx="45" cy="27" r="1" fill="#FF69B4" />
                    <line className="cat-leg" x1="22" y1="42" x2="20" y2="48" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
                    <line className="cat-leg" x1="38" y1="42" x2="40" y2="48" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" style={{ animationDelay: '-0.2s' }} />
                </svg>
            </div>

            {updates.map((upd, index) => {
              const positions = [ { x: 100, y: 800 }, { x: 250, y: 550 }, { x: 400, y: 300 }, { x: 600, y: 100 }, { x: 800, y: 300 }, { x: 1000, y: 550 }, { x: 1200, y: 800 }, { x: 1400, y: 550 }, { x: 1600, y: 300 }, { x: 1800, y: 100 } ];
              const pos = positions[index % positions.length];
              const isActive = index === currentIdx;
              return (
                <div key={upd.id} className="signpost" onClick={() => { isManuallyClosed.current = false; setSelectedUpdate(upd); speakUpdate(upd, index); }} style={{ position: 'absolute', left: pos.x, top: pos.y, transform: 'translate(-50%, -100%)', filter: isActive ? 'drop-shadow(0 0 10px #FFD700)' : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ background: isActive ? '#FFD700' : '#fff', color: '#000', padding: '12px 20px', borderRadius: '4px', border: '2px solid #000', boxShadow: isActive ? '8px 8px 0 #B8860B' : '6px 6px 0 #333', minWidth: '140px', textAlign: 'center' }}>
                      <div className="mono" style={{ fontSize: '9px', fontWeight: 900, marginBottom: '4px', color: '#666' }}>{new Date(upd.date).toLocaleDateString()}</div>
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>{upd.title.length > 25 ? upd.title.substring(0, 22) + '...' : upd.title}</div>
                    </div>
                    <div style={{ width: '4px', height: '30px', background: isActive ? '#FFD700' : '#fff' }}></div>
                    <div style={{ width: '12px', height: '12px', background: isActive ? '#FFD700' : '#fff', borderRadius: '50%', border: '2px solid #000' }}></div>
                  </div>
                </div>
              );
            })}

            {finalDestination && (
              <div 
                className="signpost" 
                style={{ position: 'absolute', left: 1900, top: 100, transform: 'translate(-50%, -100%)', cursor: 'pointer' }}
                onClick={() => speak(`Mission goal: to reach ${finalDestination}`)}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ 
                    background: '#000', color: '#FFD700', padding: '16px 24px', borderRadius: '8px', 
                    border: '3px solid #FFD700', boxShadow: '10px 10px 0 rgba(255, 215, 0, 0.2)', minWidth: '180px', textAlign: 'center' 
                  }}>
                    <div className="mono" style={{ fontSize: '10px', fontWeight: 900, marginBottom: '6px', color: '#aaa' }}>FINAL_DESTINATION</div>
                    <div style={{ fontSize: '15px', fontWeight: 900, letterSpacing: '0.05em' }}>{finalDestination}</div>
                  </div>
                  <div style={{ width: '6px', height: '40px', background: '#FFD700' }}></div>
                  <div style={{ width: '20px', height: '20px', background: '#000', borderRadius: '50%', border: '3px solid #FFD700' }}></div>
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>

      {selectedUpdate && (
        <div className="update-modal-overlay" onClick={closeUpdate}>
          <div style={{ background: '#fff', color: '#000', maxWidth: '800px', width: '100%', padding: '64px', borderRadius: '4px', position: 'relative', border: '3px solid #000', boxShadow: '16px 16px 0 #222', zIndex: 10000 }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeUpdate();
              }}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#000', color: '#fff', border: 'none', padding: '8px 16px', cursor: 'pointer', fontWeight: 900, fontSize: '12px', zIndex: 11000 }}
            >
              CLOSE_X
            </button>
            <div className="mono mb-6" style={{ fontSize: '11px', fontWeight: 900, color: '#888' }}>[LOG_ID: {selectedUpdate.id}] // [TIMESTAMP: {new Date(selectedUpdate.date).toLocaleString()}]</div>
            <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '32px', lineHeight: 1.1 }}>
              <HighlightedText text={selectedUpdate.title} highlightCharIndex={titleHighlightChar} />
            </h2>
            <div className="prose" style={{ fontSize: '17px', lineHeight: '1.8', color: '#333' }}>
              <RenderContent content={selectedUpdate.content} highlightCharIndex={contentHighlightChar} />
            </div>
            {isSpeaking && (
              <div className="mt-12 mono" style={{ fontSize: '12px', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
                SYSTEM_AUDIO_PLAYBACK_ACTIVE...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
