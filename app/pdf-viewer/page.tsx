'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PDFViewerContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  if (!url) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="mono" style={{ fontSize: '24px', marginBottom: '16px' }}>[ERROR://NO_SOURCE_SPECIFIED]</h1>
          <p className="text-muted">Please provide a valid PDF source module.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#0a0a0c', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <header style={{ height: '60px', background: '#111', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 10px #ef4444' }}></div>
          <span className="mono" style={{ fontSize: '13px', fontWeight: 800, color: '#fff', letterSpacing: '0.1em' }}>WHIZZYX_SECURE_VIEWER // MODULE_STASIS_DOCS</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
           <a href={url} download className="mono" style={{ color: '#aaa', fontSize: '12px', textDecoration: 'none', border: '1px solid #444', padding: '6px 16px', borderRadius: '4px' }}>DOWNLOAD_LOCAL_COPY</a>
           <button onClick={() => window.close()} className="mono" style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', fontSize: '12px', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer' }}>TERMINATE_SESSION</button>
        </div>
      </header>
      
      <main style={{ flex: 1, position: 'relative', background: '#1a1a1e' }}>
        {/* Hacker Aesthetic Scan-lines Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.02), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.02))',
          backgroundSize: '100% 4px, 3px 100%',
          zIndex: 5
        }}></div>

        <iframe 
          src={url} 
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Project Documentation"
        />
      </main>

      <footer style={{ height: '40px', background: '#000', borderTop: '1px solid #333', display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <div className="mono" style={{ fontSize: '10px', color: '#666' }}>
          SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()} // ENCRYPTION: AES-256-V4 // STATUS: SECURE_STREAM_ACTIVE
        </div>
      </footer>
    </div>
  );
}

export default function PDFViewerPage() {
  return (
    <Suspense fallback={
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: '#fff' }}>
        <div className="mono">INITIALIZING_VIEWER_PROTOCOL...</div>
      </div>
    }>
      <PDFViewerContent />
    </Suspense>
  );
}
