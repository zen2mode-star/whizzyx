import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WhizzyX Team — App Developer Profile",
  description: "Official developer profile for the WhizzyX Team, creators of high-performance Android applications and web systems.",
};

export default function DeveloperPage() {
  return (
    <div className="fade-in">
      <header className="header">
        <div className="header-inner container">
          <Link href="/" className="logo">
            WhizzyX<span style={{ color: 'var(--status-active)' }}>.</span>
          </Link>
          <nav className="nav hidden-mobile">
            <Link href="/" className="nav-link">Main Site</Link>
            <Link href="/privacy" className="nav-link" style={{ fontWeight: 600 }}>Privacy Policy</Link>
            <a href="#contact" className="btn btn-primary">Contact Us</a>
          </nav>
        </div>
      </header>

      <div className="main-layout flex-col">
        <div className="content-area w-full" style={{ padding: '0', background: 'var(--bg-primary)' }}>
          
          <div className="container hero text-center" style={{ textAlign: 'center', paddingTop: '100px', paddingBottom: '60px' }}>
            <span className="badge" style={{ background: 'var(--status-active-glow)', color: 'var(--status-active)', marginBottom: '24px' }}>
              Official Developer Profile
            </span>
            <h1 style={{ fontSize: '64px', marginBottom: '24px', letterSpacing: '-0.05em' }}>
              Engineering the <span style={{ color: 'var(--text-muted)' }}>Next Standard.</span>
            </h1>
            <p style={{ margin: '0 auto', fontSize: '24px' }}>
              We architect uncompromising, offline-first utilities designed with absolute precision and privacy.
            </p>
          </div>

          <div className="container section">
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '60px' }}>
              <div className="stat-box" style={{ textAlign: 'center', padding: '32px' }}>
                <div className="stat-value">99.9%</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Crash-Free Rate</div>
              </div>
              <div className="stat-box" style={{ textAlign: 'center', padding: '32px' }}>
                <div className="stat-value">100%</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Offline Capable</div>
              </div>
              <div className="stat-box" style={{ textAlign: 'center', padding: '32px' }}>
                <div className="stat-value">0</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trackers Used</div>
              </div>
            </div>

            <div className="featured-card" style={{ marginBottom: '80px', minHeight: 'auto', padding: '60px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <span style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)' }}>VX</span>
                </div>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Flagship App</span>
              </div>
              
              <h2 style={{ color: 'white', fontSize: '48px', marginBottom: '16px' }}>VoltX Battery Monitor</h2>
              <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', marginBottom: '40px', lineHeight: 1.6 }}>
                The ultimate offline battery health monitor. Featuring intelligent custom audio alarms, real-time hardware diagnostics, and beautiful full-screen visual overlays.
              </p>
              
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <span className="stack-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Zero Internet Required</span>
                <span className="stack-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Hardware Diagnostics</span>
                <span className="stack-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Absolute Privacy</span>
              </div>

              <div style={{ paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>Available Exclusively on the Indus App Store</p>
              </div>
            </div>
            
            <div className="card" style={{ marginBottom: '80px', background: 'var(--bg-tertiary)', border: 'none', padding: '48px' }}>
              <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>About WhizzyX Technologies</h2>
              <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>
                WhizzyX is a cutting-edge engineering and innovation lab dedicated to solving real-world inefficiencies through uncompromising software architecture. 
                We specialize in building local, offline-first ecosystems ranging from high-performance Android utilities to advanced local AI processing pipelines and smart IoT firmware.
                Our core philosophy is simple: technology should respect user privacy, run exceptionally fast, and never rely on unnecessary internet connections.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/privacy" className="btn btn-primary" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>
                  View Official Privacy Policy
                </Link>
                <Link href="/" className="btn" style={{ background: 'var(--bg-secondary)' }}>
                  Explore All Engineering Projects
                </Link>
              </div>
            </div>

            <div id="contact" className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h3 style={{ marginBottom: '16px' }}>Contact & Support</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
                Encountered a bug or have a feature request? Raise a query directly from the website and our team will get back to you.
              </p>
              
              <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="label">Your Name</label>
                  <input type="text" className="form-control" placeholder="Enter your name" required />
                </div>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="label">Email Address</label>
                  <input type="email" className="form-control" placeholder="Enter your email" required />
                </div>
                <div className="form-group" style={{ marginBottom: '0' }}>
                  <label className="label">Query Details</label>
                  <textarea className="form-control" rows={4} placeholder="Describe your issue or request" required></textarea>
                </div>
                <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', cursor: 'pointer' }}>
                  Submit Query
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
