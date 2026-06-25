import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RoadmapView, { RenderContent } from '@/components/RoadmapView';

export const dynamic = 'force-dynamic';

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
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: '100px', fontFamily: 'var(--font-sans)' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .project-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(-45deg, #0a0a0a, #1a1a1a, #050505, #0a0a0a);
          background-size: 400% 400%;
          animation: flow 15s ease infinite;
          opacity: 0.8;
        }
        .grid-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0);
          background-size: 32px 32px;
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 32px;
        }
        @media (max-width: 768px) {
          .project-hero { padding: 80px 24px !important; }
          .project-title-text { font-size: 40px !important; }
          .project-main-grid { grid-template-columns: 1fr !important; padding: 40px 24px !important; gap: 48px !important; }
          .specs-sidebar { position: relative !important; top: 0 !important; }
        }
      `}} />

      {/* Hero Section */}
      <div className="project-hero" style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="project-hero-bg" />
        <div className="grid-pattern" />
        {thumbUrl && (
          <div style={{ position: 'absolute', inset: 0, background: `url(${thumbUrl}) center/cover`, opacity: 0.15, mixBlendMode: 'luminosity' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #050505)' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10, padding: '60px 40px 40px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', color: '#fff', fontSize: '11px', textDecoration: 'none', marginBottom: '24px', fontWeight: 900, padding: '8px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '30px', backdropFilter: 'blur(10px)', letterSpacing: '0.1em' }}>
            <span style={{ marginRight: '10px', fontSize: '14px' }}>←</span> MODULE_INDEX
          </Link>
          
          <div className="mono" style={{ fontSize: '12px', color: '#10B981', fontWeight: 900, marginBottom: '20px', letterSpacing: '0.3em', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 12px #10B981' }}></div>
            [ PROTOCOL_ACTIVE: 0x{id.padStart(4, '0')} ]
          </div>

          <h1 className="project-title-text" style={{ fontSize: '72px', fontWeight: 900, margin: '0 0 40px 0', letterSpacing: '-0.05em', lineHeight: 1.05, background: 'linear-gradient(to bottom, #fff 0%, #aaa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {displayTitle || project.title}
          </h1>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
             {demoLink && (
               <a href={demoLink} target="_blank" rel="noopener noreferrer" style={{ padding: '0 36px', height: '64px', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', fontWeight: 900, textDecoration: 'none', fontSize: '14px', letterSpacing: '0.05em', transition: 'all 0.3s' }}>
                 INITIALIZE PROJECT ↗
               </a>
             )}
             <a href="#roadmap" style={{ padding: '0 36px', height: '64px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', fontWeight: 900, textDecoration: 'none', fontSize: '14px', letterSpacing: '0.05em' }}>
               ENGINEERING_LOGS
             </a>
          </div>
        </div>
      </div>

      <div className="project-main-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 40px', display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '40px' }}>
        {/* Main Content */}
        <div>
          <div className="mono" style={{ fontSize: '11px', color: '#10B981', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.2em' }}>01_CORE_SPECIFICATION</div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.03em' }}>Technical Overview</h2>
          <div style={{ fontSize: '17px', lineHeight: '1.7', color: '#aaa', marginBottom: '40px', overflowWrap: 'break-word', fontWeight: 400 }}>
            <RenderContent content={project.description || ''} />
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '40px' }}></div>

          <div className="mono" style={{ fontSize: '11px', color: '#10B981', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.2em' }}>02_SYSTEM_ARCHITECTURE</div>
          <div style={{ padding: '32px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
             <p style={{ color: '#888', lineHeight: 1.6, fontSize: '14px' }}>Architecture visualizer for <span style={{ color: '#fff', fontWeight: 700 }}>{project.title}</span> is synchronized with core systems.</p>
             {archLink && (
               <a href={archLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', marginTop: '20px', color: '#10B981', fontWeight: 800, fontSize: '12px', textDecoration: 'none', borderBottom: '1px solid #10B981', paddingBottom: '4px' }}>
                 OPEN ARCHITECTURE BLUEPRINT ↗
               </a>
             )}
          </div>
        </div>

        {/* HUD Sidebar */}
        <div style={{ position: 'relative' }}>
          <div className="specs-sidebar glass-panel" style={{ padding: '48px', position: 'sticky', top: '40px' }}>
            <div className="mono" style={{ fontSize: '11px', color: '#10B981', fontWeight: 900, marginBottom: '40px', letterSpacing: '0.3em', opacity: 0.8 }}>MODULE_SPEC_HUD</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div>
                <div className="mono" style={{ fontSize: '10px', color: '#555', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.1em' }}>DEPLOYMENT_STATUS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 15px #10B981' }}></div>
                  <span style={{ fontWeight: 900, color: '#fff', fontSize: '20px', letterSpacing: '-0.02em' }}>{project.statusTag?.toUpperCase() || 'PRODUCTION'}</span>
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

              <div>
                <div className="mono" style={{ fontSize: '10px', color: '#555', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.1em' }}>CURRENT_VERSION</div>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '20px' }}>{project.currentMilestone || 'v1.0.4-STABLE'}</div>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>

              <div>
                <div className="mono" style={{ fontSize: '10px', color: '#B8860B', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.1em' }}>TARGET_OBJECTIVE</div>
                <div style={{ fontWeight: 900, color: '#FFD700', fontSize: '22px', lineHeight: 1.3 }}>{project.finalDestination || 'System Stability'}</div>
              </div>

              {pdfLink && (
                <Link href={`/pdf-viewer?url=${encodeURIComponent(pdfLink)}`} target="_blank" className="glass-panel" style={{ padding: '20px', textAlign: 'center', fontWeight: 800, fontSize: '12px', textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  DOWNLOAD DOCS
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Section */}
      <div id="roadmap" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 40px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ marginBottom: '40px' }}>
            <div className="mono" style={{ fontSize: '11px', color: '#666', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.3em' }}>03_ENGINEERING_HISTORY</div>
            <h2 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-0.05em' }}>Development Timeline</h2>
        </div>
        
        {updates.length > 0 ? (
          <div style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', background: '#0a0a0a' }}>
            <RoadmapView 
              updates={updates} 
              title={`${project.title} Mission Log`}
              finalDestination={project.finalDestination || undefined}
              isModal={false}
            />
          </div>
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '140px 20px' }}>
            <div className="mono" style={{ color: '#444', fontSize: '14px', fontWeight: 900, letterSpacing: '0.1em' }}>[SYSTEM_LOG://ZERO_UPDATES]</div>
            <p style={{ color: '#666', marginTop: '32px', fontSize: '20px' }}>This system is awaiting its initial engineering log.</p>
          </div>
        )}
      </div>

    </div>
  );
}
