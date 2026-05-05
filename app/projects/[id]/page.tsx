import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
  });

  if (!project) notFound();

  const parts = (project.links || '').split('|||');
  const archLink = parts[0];
  const demoLink = parts[1];
  const pdfLink  = parts[2];
  const thumbUrl = parts[3];
  const displayTitle = parts[4];

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', color: '#0a0a0a', padding: '40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Link href="/" style={{ color: '#888', fontSize: '14px', textDecoration: 'none', marginBottom: '40px', display: 'block' }}>← Back to WhizzyX Module Index</Link>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '64px' }}>
          <div>
            <div className="mono" style={{ fontSize: '11px', color: '#10B981', fontWeight: 800, marginBottom: '12px' }}>[MODULE://{project.title}]</div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '32px', letterSpacing: '-0.04em' }}>{displayTitle || project.title}</h1>
            
            <div style={{ fontSize: '18px', lineHeight: '1.8', color: '#444', marginBottom: '48px', whiteSpace: 'pre-wrap' }}>
              {project.description}
            </div>

            <div style={{ background: 'white', border: '1px solid #eee', borderRadius: '24px', padding: '40px', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>Engineering Specs</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ color: '#888', fontWeight: 600 }}>STATUS</span>
                  <span style={{ fontWeight: 800, color: '#10B981' }}>PRODUCTION_READY</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                  <span style={{ color: '#888', fontWeight: 600 }}>MILESTONE</span>
                  <span style={{ fontWeight: 800 }}>{project.currentMilestone || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#888', fontWeight: 600 }}>DESTINATION</span>
                  <span style={{ fontWeight: 800 }}>{project.finalDestination || 'STABLE'}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            {thumbUrl && (
              <img src={thumbUrl} alt={project.title} style={{ width: '100%', borderRadius: '24px', marginBottom: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {demoLink && (
                <a href={demoLink} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '64px', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', fontWeight: 800, textDecoration: 'none', textAlign: 'center' }}>
                  ACCESS LIVE PROJECT
                </a>
              )}
              {pdfLink && (
                <a href={`https://docs.google.com/viewer?url=${encodeURIComponent(pdfLink)}&embedded=true`} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '64px', border: '2px solid #3B82F6', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', fontWeight: 800, textDecoration: 'none' }}>
                  TECHNICAL DOCUMENTATION
                </a>
              )}
              {archLink && (
                <a href={archLink} target="_blank" rel="noopener noreferrer" style={{ width: '100%', height: '64px', border: '2px solid #000', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', fontWeight: 800, textDecoration: 'none' }}>
                  VIEW ARCHITECTURE
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
