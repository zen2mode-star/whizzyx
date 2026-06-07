import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WhizzyX Team — App Developer Profile",
  description: "Official developer profile for the WhizzyX Team, creators of VoltX and innovative technical systems.",
};

export default function DeveloperPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Background Glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        
        {/* Header Section */}
        <header className="mb-20 text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md mb-6 transition-transform hover:scale-105 duration-500 cursor-pointer">
            <span className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent tracking-tighter">
              WhizzyX
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-lg">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Innovation</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            The official developer profile for the WhizzyX Team. We build uncompromising, strictly offline, and highly optimized utility applications.
          </p>
        </header>

        {/* Apps Showcase */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-10 text-white/90 border-b border-white/10 pb-4">Our Applications</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* VoltX App Card */}
            <div className="group relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent hover:from-cyan-500/50 transition-all duration-700">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-zinc-950 p-8 rounded-[22px] h-full border border-white/5 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/10 shadow-lg group-hover:border-cyan-500/50 transition-colors">
                    <span className="text-2xl font-black text-cyan-400">VX</span>
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/20">
                    Featured
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">VoltX</h3>
                <p className="text-zinc-400 mb-8 flex-grow leading-relaxed">
                  A premium, 100% offline battery monitor featuring custom threshold alarms, real-time hardware diagnostics, and zero internet permissions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-zinc-300 font-medium border border-white/5">Android</span>
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-zinc-300 font-medium border border-white/5">Utility</span>
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-xs text-zinc-300 font-medium border border-white/5">Offline</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Legal */}
        <section className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-white/20 transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-white">Contact & Support</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Encountered a bug or have a feature request? Our team is dedicated to providing high-end support for all our applications.
            </p>
            <div className="space-y-4">
              <a href="mailto:support@whizzyx.com" className="flex items-center gap-4 p-4 rounded-xl bg-black/50 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <div>
                  <div className="text-sm text-zinc-500 font-medium">Email Support</div>
                  <div className="text-white font-medium">support@whizzyx.com</div>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-white/20 transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-white">Legal & Compliance</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              We build systems with privacy as the core foundation. Review our strictly offline compliance protocols and application policies.
            </p>
            <Link href="/privacy" className="inline-flex items-center justify-center w-full p-4 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-cyan-900/40 hover:to-emerald-900/40 transition-all border border-white/5 hover:border-cyan-500/30 font-semibold text-white">
              View Privacy Policy
            </Link>
          </div>
        </section>

        <footer className="mt-24 text-center border-t border-white/10 pt-8 pb-4">
          <Link href="/" className="inline-block mb-4 text-zinc-500 hover:text-white transition-colors">← Back to Main Site</Link>
          <p className="text-sm text-zinc-600 font-medium">
            © {new Date().getFullYear()} WhizzyX Team. All rights reserved.
          </p>
        </footer>

      </div>
    </main>
  );
}
