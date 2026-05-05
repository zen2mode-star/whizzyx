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
      {/* Premium Hero Section */}
      <div style={{ 
        position: 'relative', 
        padding: '100px 40px', 
        background: thumbUrl ? `linear-gradient(to bottom, rgba(10,10,10,0.4), #0a0a0a), url(${thumbUrl}) center/cover` : 'linear-gradient(135deg, #111 0%, #050505 100%)',
        borderBottom: '1px solid #222'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', color: '#888', fontSize: '14px', textDecoration: 'none', marginBottom: '40px', fontWeight: 600, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
            <span style={{ marginRight: '8px' }}>←</span> RETURN TO MODULE INDEX
          </Link>
          <div className="mono" style={{ fontSize: '12px', color: '#10B981', fontWeight: 900, marginBottom: '16px', letterSpacing: '0.1em' }}>[SYSTEM_MODULE_LOADED]</div>
          <h1 style={{ fontSize: '64px', fontWeight: 900, margin: '0 0 24px 0', letterSpacing: '-0.03em', lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            {displayTitle || project.title}
          </h1>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
             {demoLink && (
               <a href={demoLink} target="_blank" rel="noopener noreferrer" style={{ padding: '0 32px', height: '56px', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', fontSize: '14px', letterSpacing: '0.05em' }}>
                 INITIALIZE LIVE PROJECT
               </a>
             )}
             {pdfLink && (
               <Link href={`/pdf-viewer?url=${encodeURIComponent(pdfLink)}`} target="_blank" rel="noopener noreferrer" style={{ padding: '0 32px', height: '56px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3B82F6', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', fontSize: '14px', letterSpacing: '0.05em' }}>
                 VIEW DOCUMENTATION
               </Link>
             )}
             <a href="#roadmap" style={{ padding: '0 32px', height: '56px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid #444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontWeight: 800, textDecoration: 'none', fontSize: '14px', letterSpacing: '0.05em' }}>
               EXPLORE ROADMAP ↓
             </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 40px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '80px' }}>
        {/* Main Content */}
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '32px', borderBottom: '1px solid #222', paddingBottom: '16px' }}>Core Architecture & Logic</h2>
          <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#bbb', marginBottom: '64px', overflowWrap: 'break-word', fontWeight: 400 }}>
            <RenderContent content={project.description || ''} />
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: '24px', padding: '40px', position: 'sticky', top: '40px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '32px', color: '#fff' }}>Engineering Specs</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#888', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.05em' }}>CURRENT STATUS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }}></div>
                  <span style={{ fontWeight: 800, color: '#fff', fontSize: '16px' }}>PRODUCTION READY</span>
                </div>
              </div>

              <div style={{ height: '1px', background: '#222' }}></div>

              <div>
                <div style={{ fontSize: '11px', color: '#888', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.05em' }}>LATEST MILESTONE</div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '16px' }}>{project.currentMilestone || 'System Initialized'}</div>
              </div>

              <div style={{ height: '1px', background: '#222' }}></div>

              <div>
                <div style={{ fontSize: '11px', color: '#B8860B', fontWeight: 800, marginBottom: '8px', letterSpacing: '0.05em' }}>FINAL DESTINATION</div>
                <div style={{ fontWeight: 800, color: '#FFD700', fontSize: '18px' }}>{project.finalDestination || 'STABLE BUILD'}</div>
              </div>

              {archLink && (
                <>
                  <div style={{ height: '1px', background: '#222', marginTop: '8px' }}></div>
                  <a href={archLink} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '56px', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontWeight: 900, textDecoration: 'none', fontSize: '14px', marginTop: '8px' }}>
                    OPEN ARCHITECTURE GRAPH
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Roadmap Section */}
      <div id="roadmap" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', paddingTop: '80px', borderTop: '1px solid #222' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '40px', textAlign: 'center', letterSpacing: '-0.02em' }}>Project Engineering Log</h2>
        {updates.length > 0 ? (
          <div style={{ background: '#0a0a0a', border: '1px solid #333', borderRadius: '24px', overflow: 'hidden' }}>
            <RoadmapView 
              updates={updates} 
              title={`${project.title} Mission Log`}
              finalDestination={project.finalDestination || undefined}
              isModal={false}
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 20px', background: '#111', borderRadius: '24px', border: '1px dotted #333' }}>
            <div className="mono" style={{ color: '#666', fontSize: '14px', fontWeight: 800 }}>NO_LOGS_DETECTED</div>
            <p style={{ color: '#888', marginTop: '16px' }}>The roadmap for this module has not been populated yet.</p>
          </div>
        )}
      </div>

    </div>
  );
}
