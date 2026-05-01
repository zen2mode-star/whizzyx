'use client';

import React, { useState, useEffect } from 'react';

const RenderContent = ({ content }: { content: string }) => {
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

  let safe = processed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  safe = safe
    .replace(/\[\[SPAN style="(.*?)"\]\](.*?)\[\[\/SPAN\]\]/g, '<span style="$1">$2</span>')
    .replace(/\[\[STRONG\]\](.*?)\[\[\/STRONG\]\]/g, '<strong>$1</strong>')
    .replace(/\[\[EM\]\](.*?)\[\[\/EM\]\]/g, '<em>$1</em>')
    .replace(/\[\[H3 style="(.*?)"\]\](.*?)\[\[\/H3\]\]/g, '<h3 style="$1">$2</h3>')
    .replace(/\[\[LI\]\](.*?)\[\[\/LI\]\]/g, '<li>$1</li>');

  safe = safe.replace(/(<li>.*?<\/li>(\n| )*)+/g, (match) => `<ul style="margin-bottom: 20px; padding-left: 20px; list-style-type: disc;">${match}</ul>`);
  safe = safe.replace(/\n/g, '<br/>');

  return <div className="prose-content" dangerouslySetInnerHTML={{ __html: safe }} />;
};

export default function RoadmapExpedition() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [selectedUpdate, setSelectedUpdate] = useState<any>(null);

  useEffect(() => {
    fetch('/api/updates').then(r => r.json()).then(setUpdates).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen" style={{ 
      background: '#0a0a0c', 
      backgroundImage: `radial-gradient(circle at 2px 2px, #1a1a1e 1px, transparent 0)`,
      backgroundSize: '40px 40px',
      color: '#fff', 
      overflowX: 'hidden' 
    }}>
      <style>{`
        @keyframes leapCat {
          0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
          50% { transform: translateY(-25px) rotate(-5deg) scale(1.1); }
        }
        @keyframes wagTail {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes walkAlongRoad {
          0% { offset-distance: 0%; transform: scaleX(1); }
          48% { offset-distance: 100%; transform: scaleX(1); }
          50% { offset-distance: 100%; transform: scaleX(-1); }
          98% { offset-distance: 0%; transform: scaleX(-1); }
          100% { offset-distance: 0%; transform: scaleX(1); }
        }
        .walking-cat-road {
          offset-path: path("M 100 800 C 300 800 300 100 600 100 C 900 100 900 800 1200 800 C 1500 800 1500 100 1800 100");
          position: absolute;
          width: 80px;
          height: 80px;
          animation: walkAlongRoad 40s linear infinite;
          z-index: 50;
          pointer-events: none;
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
        .glow-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(var(--accent-rgb), 0.1) 0%, transparent 70%);
          pointer-events: none;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.92);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 24px;
        }
      `}</style>

      <div className="glow-overlay" />

      <div style={{ padding: '64px 48px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div className="flex justify-between items-start mb-16">
          <div>
            <div className="mono" style={{ color: '#555', fontWeight: 800, letterSpacing: '0.2em', fontSize: '12px', marginBottom: '8px' }}>MISSION_LOG://EXPEDITION_MAP</div>
            <h1 style={{ fontSize: '56px', fontWeight: 900, letterSpacing: '-0.04em', color: '#fff' }}>The WhizzyX Journey</h1>
            <p style={{ color: '#888', fontSize: '18px', maxWidth: '600px', marginTop: '16px' }}>
              A high-fidelity technical roadmap of our architectural breakthroughs and system evolutions.
            </p>
          </div>
          <div style={{ padding: '20px', background: '#111', border: '1px solid #222', borderRadius: '12px', textAlign: 'right' }}>
             <div className="mono" style={{ color: '#444', fontSize: '10px' }}>SYSTEM_STATUS</div>
             <div className="mono" style={{ color: '#10B981', fontSize: '14px', fontWeight: 800 }}>✓ STABLE_EXPEDITION</div>
          </div>
        </div>

        <div className="relative" style={{ height: '900px', background: 'rgba(20,20,25,0.5)', backdropFilter: 'blur(10px)', borderRadius: '32px', border: '1px solid #222', overflowX: 'auto', overflowY: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
          <div style={{ minWidth: '2000px', height: '100%', position: 'relative' }}>
            <svg width="2000" height="900" viewBox="0 0 2000 900" fill="none">
              {/* Enhanced Road Surface */}
              <path d="M 100 800 C 300 800 300 100 600 100 C 900 100 900 800 1200 800 C 1500 800 1500 100 1800 100" stroke="#000" strokeWidth="64" strokeLinecap="round" />
              <path d="M 100 800 C 300 800 300 100 600 100 C 900 100 900 800 1200 800 C 1500 800 1500 100 1800 100" stroke="#222" strokeWidth="60" strokeLinecap="round" />
              <path d="M 100 800 C 300 800 300 100 600 100 C 900 100 900 800 1200 800 C 1500 800 1500 100 1800 100" stroke="white" strokeWidth="1" strokeDasharray="10 30" strokeLinecap="round" opacity="0.1" />
            </svg>

            <div className="walking-cat-road">
              <span className="cat-inner">
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                  {/* Tail */}
                  <path className="cat-tail" d="M 20 75 Q 5 60 20 45" stroke="#000" strokeWidth="6" fill="none" strokeLinecap="round" />
                  {/* Body */}
                  <ellipse cx="50" cy="70" rx="25" ry="20" fill="#000" />
                  {/* White Chest */}
                  <ellipse cx="50" cy="72" rx="12" ry="15" fill="#fff" opacity="0.9" />
                  {/* Head */}
                  <circle cx="50" cy="40" r="18" fill="#000" />
                  {/* White Muzzle */}
                  <circle cx="50" cy="45" r="8" fill="#fff" opacity="0.9" />
                  <path d="M 46 44 Q 50 48 54 44" stroke="#000" strokeWidth="1" fill="none" />
                  <circle cx="50" cy="43" r="1.5" fill="#000" />
                  {/* Ears */}
                  <path d="M 35 30 L 30 10 L 45 25 Z" fill="#000" />
                  <path d="M 65 30 L 70 10 L 55 25 Z" fill="#000" />
                  {/* Eyes */}
                  <circle cx="43" cy="35" r="3" fill="#fff" />
                  <circle cx="43" cy="35" r="1.5" fill="#000" />
                  <circle cx="57" cy="35" r="3" fill="#fff" />
                  <circle cx="57" cy="35" r="1.5" fill="#000" />
                  {/* Whiskers */}
                  <path d="M 40 45 L 20 42 M 40 47 L 20 47 M 40 49 L 20 52" stroke="#fff" strokeWidth="0.5" />
                  <path d="M 60 45 L 80 42 M 60 47 L 80 47 M 60 49 L 80 52" stroke="#fff" strokeWidth="0.5" />
                  {/* Paws (White) */}
                  <circle cx="35" cy="85" r="5" fill="#fff" stroke="#000" strokeWidth="1" />
                  <circle cx="65" cy="85" r="5" fill="#fff" stroke="#000" strokeWidth="1" />
                </svg>
              </span>
            </div>

            {updates.map((upd, index) => {
              const positions = [
                { x: 100, y: 800 }, { x: 250, y: 550 }, { x: 400, y: 300 }, { x: 600, y: 100 },
                { x: 800, y: 300 }, { x: 1000, y: 550 }, { x: 1200, y: 800 }, { x: 1400, y: 550 },
                { x: 1600, y: 300 }, { x: 1800, y: 100 }
              ];
              const pos = positions[index % positions.length];
              return (
                <div 
                  key={upd.id} 
                  className="signpost" 
                  onClick={() => setSelectedUpdate(upd)}
                  style={{ position: 'absolute', left: pos.x, top: pos.y, transform: 'translate(-50%, -100%)' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ 
                      background: '#fff', color: '#000', padding: '12px 20px', borderRadius: '4px', 
                      border: '2px solid #000', boxShadow: '6px 6px 0 #333', minWidth: '140px', textAlign: 'center' 
                    }}>
                      <div className="mono" style={{ fontSize: '9px', fontWeight: 900, marginBottom: '4px', color: '#666' }}>
                        {new Date(upd.date).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>
                        {upd.title.length > 25 ? upd.title.substring(0, 22) + '...' : upd.title}
                      </div>
                    </div>
                    <div style={{ width: '4px', height: '30px', background: '#fff' }}></div>
                    <div style={{ width: '12px', height: '12px', background: '#fff', borderRadius: '50%', border: '2px solid #000' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex justify-between items-center mono" style={{ color: '#444', fontSize: '12px' }}>
          <div>[SCROLL HORIZONTALLY TO VIEW MORE]</div>
          <div>WHIZZYX_CORP // EXPEDITION_ENGINE_V2</div>
        </div>
      </div>

      {selectedUpdate && (
        <div className="modal-overlay" onClick={() => setSelectedUpdate(null)}>
          <div style={{ 
            background: '#fff', color: '#000', maxWidth: '800px', width: '100%', padding: '64px', 
            borderRadius: '4px', position: 'relative', border: '3px solid #000', boxShadow: '16px 16px 0 #222' 
          }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedUpdate(null)} 
              style={{ position: 'absolute', right: '32px', top: '32px', background: '#000', color: '#fff', border: 'none', padding: '8px 16px', fontWeight: 800, cursor: 'pointer' }}
            >
              CLOSE_X
            </button>
            <div className="mono mb-6" style={{ fontSize: '11px', fontWeight: 900, color: '#888' }}>
              [LOG_ID: {selectedUpdate.id}] // [TIMESTAMP: {new Date(selectedUpdate.date).toLocaleString()}]
            </div>
            <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '32px', lineHeight: 1.1 }}>{selectedUpdate.title}</h2>
            <div className="prose" style={{ fontSize: '17px', lineHeight: '1.8', color: '#333' }}>
              <RenderContent content={selectedUpdate.content} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
