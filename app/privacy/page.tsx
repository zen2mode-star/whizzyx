import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy & Compliance — WhizzyX",
  description: "Official Privacy Policy and compliance protocols for WhizzyX applications.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between bg-white/5 border border-white/10 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl">
          <Link href="/developer" className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent hover:from-cyan-400 hover:to-blue-500 transition-all">
            WhizzyX<span className="text-cyan-500">.</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="/developer" className="hover:text-white transition-colors">Developer Profile</Link>
          </div>
          <a href="mailto:legal@whizzyx.com" className="px-5 py-2 text-sm font-semibold bg-white/10 text-white border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
            Contact Legal
          </a>
        </div>
      </nav>

      {/* Cinematic Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 pt-40 pb-20 max-w-4xl mx-auto px-6">
        
        <header className="mb-20 border-b border-white/10 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-zinc-400 mb-8 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Data Protection & Legal Compliance
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-zinc-400">
            Last Updated & Effective: <span className="text-white font-medium">June 7, 2026</span>
          </p>
        </header>

        <article className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-p:text-zinc-400 prose-p:leading-relaxed prose-a:text-cyan-400 prose-li:text-zinc-400 bg-zinc-900/20 p-8 md:p-16 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl">
          <p className="text-xl text-white font-medium mb-12">
            The WhizzyX Team ("we," "our," or "us") is fiercely committed to protecting your privacy. We believe that what happens on your device should stay on your device. This Privacy Policy explains our practices regarding the VoltX mobile application and our broader software ecosystem.
          </p>

          <h2 className="text-3xl mt-16 mb-6 flex items-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 text-lg border border-cyan-500/20">1</span>
            Absolute Data Sovereignty
          </h2>
          <p>
            VoltX is architected to operate entirely offline as a local utility tool. <strong>We do not collect, store, transmit, analyze, or share any personal data, usage data, or identifiable information.</strong>
          </p>
          <p>
            Because our Service operates securely within your device's sandbox, we have designed it so that no data ever leaves your smartphone hardware. 
          </p>

          <h2 className="text-3xl mt-16 mb-6 flex items-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 text-lg border border-cyan-500/20">2</span>
            Required Device Permissions
          </h2>
          <p>To function correctly and reliably, VoltX requires specific, narrowly-scoped local permissions on your Android device. These permissions are used exclusively for core app functionality:</p>
          <div className="grid gap-4 mt-6">
            <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
              <strong className="text-white text-lg block mb-2">Foreground Service</strong>
              Required to monitor your device's hardware battery metrics continuously in the background, ensuring alarms trigger flawlessly without being killed by the OS.
            </div>
            <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
              <strong className="text-white text-lg block mb-2">Post Notifications & Full Screen Intent</strong>
              Required to bypass the lock screen and display high-priority visual/audible alarms when critical battery thresholds are reached.
            </div>
            <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
              <strong className="text-white text-lg block mb-2">Boot Completed</strong>
              Required to automatically revive the battery monitoring service when you reboot your device (only if "Start on Boot" is enabled).
            </div>
          </div>

          <h2 className="text-3xl mt-16 mb-6 flex items-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 text-lg border border-cyan-500/20">3</span>
            Zero Third-Party Tracking
          </h2>
          <p>
            We unequivocally reject the use of third-party analytics tools, crash reporting services, or advertising tracking software. VoltX does not contain any third-party marketing APIs or external SDKs. 
          </p>
          <p>
            Furthermore, the application codebase completely excludes the <code>android.permission.INTERNET</code> permission, ensuring that third-party data transmission is mathematically and technically impossible.
          </p>

          <h2 className="text-3xl mt-16 mb-6 flex items-center gap-4">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 text-lg border border-cyan-500/20">4</span>
            Contact & Legal Inquiries
          </h2>
          <p>
            If you have any questions, concerns, or legal inquiries regarding our Privacy Policy, compliance, or the VoltX application, please contact our legal and support team directly at: <a href="mailto:legal@whizzyx.com" className="text-white font-bold hover:text-cyan-400 transition-colors">legal@whizzyx.com</a>.
          </p>
        </article>

        <footer className="mt-20 text-center border-t border-white/10 pt-10">
          <p className="text-zinc-600 font-medium">
            © {new Date().getFullYear()} WhizzyX Technologies.
          </p>
        </footer>

      </div>
    </main>
  );
}
