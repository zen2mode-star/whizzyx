import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy & Compliance — WhizzyX",
  description: "Official Privacy Policy and compliance protocols for WhizzyX applications.",
};

export default function PrivacyPage() {
  return (
    <div className="fade-in">
      <header className="header">
        <div className="header-inner container">
          <Link href="/developer" className="logo">
            WhizzyX<span style={{ color: 'var(--status-active)' }}>.</span>
          </Link>
          <nav className="nav hidden-mobile">
            <Link href="/developer" className="nav-link">Developer Profile</Link>
            <Link href="/" className="nav-link">Main Site</Link>
          </nav>
        </div>
      </header>

      <div className="main-layout flex-col">
        <div className="content-area w-full" style={{ padding: '0', background: 'var(--bg-secondary)' }}>
          <div className="container" style={{ maxWidth: '800px', paddingTop: '80px', paddingBottom: '80px' }}>
            
            <div style={{ marginBottom: '60px', textAlign: 'center' }}>
              <span className="badge" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Data Protection & Legal Compliance
              </span>
              <h1 style={{ fontSize: '56px', marginBottom: '16px' }}>Privacy Policy</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                Last Updated & Effective: <strong>June 7, 2026</strong>
              </p>
            </div>

            <div className="card prose" style={{ padding: '60px', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }}>
              <p style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '40px' }}>
                The WhizzyX Team ("we," "our," or "us") is fiercely committed to protecting your privacy. We believe that what happens on your device should stay on your device. This Privacy Policy explains our practices regarding the VoltX mobile application and our broader software ecosystem.
              </p>

              <h2 style={{ marginTop: '48px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                1. Absolute Data Sovereignty
              </h2>
              <p>
                VoltX is architected to operate entirely offline as a local utility tool. <strong>We do not collect, store, transmit, analyze, or share any personal data, usage data, or identifiable information.</strong>
              </p>
              <p>
                Because our Service operates securely within your device's sandbox, we have designed it so that no data ever leaves your smartphone hardware.
              </p>

              <h2 style={{ marginTop: '48px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                2. Required Device Permissions
              </h2>
              <p>To function correctly and reliably, VoltX requires specific, narrowly-scoped local permissions on your Android device. These permissions are used exclusively for core app functionality:</p>
              
              <div style={{ background: 'var(--bg-tertiary)', padding: '24px', borderRadius: '16px', marginBottom: '16px', marginTop: '24px' }}>
                <strong style={{ display: 'block', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>Foreground Service</strong>
                Required to monitor your device's hardware battery metrics continuously in the background, ensuring alarms trigger flawlessly without being killed by the OS.
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '24px', borderRadius: '16px', marginBottom: '16px' }}>
                <strong style={{ display: 'block', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>Post Notifications & Full Screen Intent</strong>
                Required to bypass the lock screen and display high-priority visual/audible alarms when critical battery thresholds are reached.
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '24px', borderRadius: '16px', marginBottom: '16px' }}>
                <strong style={{ display: 'block', fontSize: '16px', color: 'var(--text-primary)', marginBottom: '8px' }}>Boot Completed</strong>
                Required to automatically revive the battery monitoring service when you reboot your device (only if "Start on Boot" is enabled).
              </div>

              <h2 style={{ marginTop: '48px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                3. Zero Third-Party Tracking
              </h2>
              <p>
                We unequivocally reject the use of third-party analytics tools, crash reporting services, or advertising tracking software. VoltX does not contain any third-party marketing APIs or external SDKs. 
              </p>
              <p>
                Furthermore, the application codebase completely excludes the <code>android.permission.INTERNET</code> permission, ensuring that third-party data transmission is mathematically and technically impossible.
              </p>

              <h2 style={{ marginTop: '48px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
                4. Contact & Legal Inquiries
              </h2>
              <p>
                If you have any questions, concerns, or legal inquiries regarding our Privacy Policy, compliance, or the VoltX application, please reach out to our team by <strong><Link href="/developer#contact">raising a query directly on our developer website</Link></strong>.
              </p>
            </div>

            <footer style={{ textAlign: 'center', marginTop: '60px', color: 'var(--text-muted)', fontSize: '14px' }}>
              © {new Date().getFullYear()} WhizzyX Technologies. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
