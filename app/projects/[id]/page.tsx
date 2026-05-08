import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RoadmapView, { RenderContent } from '@/components/RoadmapView';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
  });

  if (!project) notFound();

  const updates = await prisma.buildUpdate.findMany({
    where: { projectId: parseInt(id) },
    orderBy: { date: 'asc' }
  });

  const parts = (project.links || '').split('|||');
  const archLink = parts[0];
  const demoLink = parts[1];
  const pdfLink  = parts[2];
  const thumbUrl = parts[3];
  const displayTitle = parts[4];

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', paddingBottom: '100px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .project-hero { padding: 60px 20px !important; }
          .project-title-text { font-size: 36px !important; }
          .project-actions { flex-direction: column !important; width: 100% !important; }
          .project-actions a, .project-actions button { width: 100% !important; height: 52px !important; font-size: 13px !important; }
          .project-main-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding: 40px 20px !important; }
          .specs-sidebar { position: relative !important; top: 0 !important; padding: 32px 24px !important; }
        }
        .cyber-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .cyber-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.2);
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }
      `}} />

      {/* Premium Hero Section */}
      <div className="project-hero" style={{ 
        position: 'relative', 
        padding: '100px 40px', 
        background: thumbUrl ? `linear-gradient(to bottom, rgba(10,10,10,0.6), #0a0a0a), url(${thumbUrl}) center/cover` : 'linear-gradient(135deg, #111 0%, #050505 100%)',
        borderBottom: '1px solid #1a1a1a'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', color: '#888', fontSize: '12px', textDecoration: 'none', marginBottom: '40px', fontWeight: 800, padding: '10px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '30px', backdropFilter: 'blur(10px)', letterSpacing: '0.05em' }}>
            <span style={{ marginRight: '8px' }}>←</span> RETURN TO MODULE INDEX
          </Link>
          <div className="mono" style={{ fontSize: '11px', color: '#10B981', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.3em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }}></div>
            [ SYSTEM_MODULE_LOADED ]
          </div>
          <h1 className="project-title-text" style={{ fontSize: '64px', fontWeight: 900, margin: '0 0 32px 0', letterSpacing: '-0.04em', lineHeight: 1, textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}>
            {displayTitle || project.title}
          </h1>
          <div className="project-actions" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
             {demoLink && (
               <a href={demoLink} target="_blank" rel="noopener noreferrer" className="cyber-btn" style={{ padding: '0 32px', height: '60px', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', fontWeight: 900, textDecoration: 'none', fontSize: '14px', letterSpacing: '0.05em' }}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '10px' }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                 INITIALIZE LIVE PROJECT
               </a>
             )}
             {pdfLink && (
               <Link href={`/pdf-viewer?url=${encodeURIComponent(pdfLink)}`} target="_blank" rel="noopener noreferrer" className="cyber-btn" style={{ padding: '0 32px', height: '60px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', fontWeight: 900, textDecoration: 'none', fontSize: '14px', letterSpacing: '0.05em' }}>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '10px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                 VIEW DOCUMENTATION
               </Link>
             )}
             <a href="#roadmap" className="cyber-btn" style={{ padding: '0 32px', height: '60px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', fontWeight: 900, textDecoration: 'none', fontSize: '14px', letterSpacing: '0.05em' }}>
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '10px' }}><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
               EXPLORE ROADMAP
             </a>
          </div>
        </div>
      </div>

      <div className="project-main-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 40px', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '80px' }}>
        {/* Main Content */}
        <div>
          <div className="mono" style={{ fontSize: '11px', color: '#666', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.1em' }}>[01. ARCHITECTURAL_OVERVIEW]</div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '32px', letterSpacing: '-0.02em' }}>Core Engineering Logic</h2>
          <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#888', marginBottom: '64px', overflowWrap: 'break-word', fontWeight: 400 }}>
            <RenderContent content={project.description || ''} />
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="specs-sidebar" style={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '28px', padding: '48px', position: 'sticky', top: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div className="mono" style={{ fontSize: '10px', color: '#10B981', fontWeight: 900, marginBottom: '32px', letterSpacing: '0.2em' }}>[ HUD://ENGINEERING_SPECS ]</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#555', fontWeight: 900, marginBottom: '12px', letterSpacing: '0.1em' }}>STATUS_PROTOCOL</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px #10B981', animation: 'pulse 2s infinite' }}></div>
                  <span style={{ fontWeight: 900, color: '#fff', fontSize: '18px', letterSpacing: '-0.01em' }}>PRODUCTION READY</span>
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

              <div>
                <div style={{ fontSize: '11px', color: '#555', fontWeight: 900, marginBottom: '12px', letterSpacing: '0.1em' }}>CURRENT_PHASE</div>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '18px' }}>{project.currentMilestone || 'System Initialized'}</div>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

              <div>
                <div style={{ fontSize: '11px', color: '#B8860B', fontWeight: 900, marginBottom: '12px', letterSpacing: '0.1em' }}>FINAL_STABLE_VERSION</div>
                <div style={{ fontWeight: 900, color: '#FFD700', fontSize: '20px', textShadow: '0 0 20px rgba(255, 215, 0, 0.2)' }}>{project.finalDestination || 'STABLE BUILD'}</div>
              </div>

              {archLink && (
                <>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginTop: '8px' }}></div>
                  <a href={archLink} target="_blank" rel="noopener noreferrer" className="cyber-btn" style={{ width: '100%', height: '56px', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px', fontWeight: 900, textDecoration: 'none', fontSize: '13px', marginTop: '8px' }}>
                    OPEN ARCHITECTURE GRAPH ↗
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Roadmap Section */}
      <div id="roadmap" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', paddingTop: '100px', borderTop: '1px solid #1a1a1a' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div className="mono" style={{ fontSize: '12px', color: '#666', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.2em' }}>[ ARCHIVE://ENGINEERING_LOG ]</div>
            <h2 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.04em' }}>System Evolution Roadmap</h2>
        </div>
        {updates.length > 0 ? (
          <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }}>
            <RoadmapView 
              updates={updates} 
              title={`${project.title} Mission Log`}
              finalDestination={project.finalDestination || undefined}
              isModal={false}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '120px 20px', background: '#0d0d0d', borderRadius: '32px', border: '1px dashed #222' }}>
            <div className="mono" style={{ color: '#444', fontSize: '14px', fontWeight: 900, letterSpacing: '0.1em' }}>[SYSTEM_LOG://NO_DATA_DETECTED]</div>
            <p style={{ color: '#666', marginTop: '24px', fontSize: '18px' }}>The roadmap for this module has not been populated yet.</p>
          </div>
        )}
      </div>

    </div>
  );
}
