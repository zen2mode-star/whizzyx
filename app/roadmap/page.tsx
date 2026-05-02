'use client';

import React, { useState, useEffect } from 'react';
import RoadmapView from '@/components/RoadmapView';

export default function RoadmapExpedition() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetch('/api/updates').then(r => r.json()).then(setUpdates).catch(console.error);
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen" style={{ 
      background: '#0a0a0c', 
      backgroundImage: `radial-gradient(circle at 2px 2px, #1a1a1e 1px, transparent 0)`,
      backgroundSize: '40px 40px',
      color: '#fff', 
      overflowX: 'hidden' 
    }}>
      <div style={{ padding: '64px 48px', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <RoadmapView 
          updates={updates} 
          title="The WhizzyX Journey" 
          finalDestination={settings.roadmapFinalDestination || "Global Architectural Equilibrium"}
        />

        <div className="mt-12 flex justify-between items-center mono" style={{ color: '#444', fontSize: '12px' }}>
          <div>[SCROLL HORIZONTALLY TO VIEW MORE]</div>
          <div>WHIZZYX_CORP // CAT_EXPEDITION_ENGINE_V4</div>
        </div>
      </div>
    </div>
  );
}
