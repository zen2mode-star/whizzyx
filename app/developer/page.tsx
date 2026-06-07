import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WhizzyX Team — Premium Software Engineering",
  description: "Official developer profile for the WhizzyX Team, creators of high-performance Android applications and web systems.",
};

export default function DeveloperPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between bg-white/5 border border-white/10 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl">
          <Link href="/" className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent hover:from-cyan-400 hover:to-blue-500 transition-all">
            WhizzyX<span className="text-cyan-500">.</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#apps" className="hover:text-white transition-colors">Applications</Link>
            <Link href="#about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="#support" className="hover:text-white transition-colors">Support</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
          <a href="mailto:support@whizzyx.com" className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
            Contact Us
          </a>
        </div>
      </nav>

      {/* Cinematic Aurora Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[150px]" />
        <div className="absolute top-[20%] right-[-20%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] bg-emerald-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 pt-40 pb-20">
        {/* Hero Section */}
        <header className="max-w-6xl mx-auto px-6 mb-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-cyan-400 mb-8 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Pioneering Mobile Experiences
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1]">
            Engineering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 animate-gradient">
              Next Standard.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed font-light">
            We don't just build apps. We architect uncompromising, offline-first utilities designed with absolute precision and privacy.
          </p>
        </header>

        {/* Dynamic Stats Banner */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-zinc-900/50 border border-white/10 rounded-3xl backdrop-blur-md">
            <div className="text-center p-4">
              <div className="text-4xl font-black text-white mb-2">99.9%</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Crash-Free Rate</div>
            </div>
            <div className="text-center p-4 border-l border-white/10">
              <div className="text-4xl font-black text-white mb-2">100%</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Offline Capable</div>
            </div>
            <div className="text-center p-4 border-t md:border-t-0 md:border-l border-white/10">
              <div className="text-4xl font-black text-white mb-2">0</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Trackers Used</div>
            </div>
            <div className="text-center p-4 border-t md:border-t-0 md:border-l border-white/10">
              <div className="text-4xl font-black text-white mb-2">4.9★</div>
              <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Average Rating</div>
            </div>
          </div>
        </section>

        {/* Premium App Showcase */}
        <section id="apps" className="max-w-6xl mx-auto px-6 mb-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-white mb-4">Our Ecosystem</h2>
              <p className="text-zinc-400 text-lg">Industry-leading utilities for Android.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* VoltX Premium Card */}
            <div className="group relative rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-cyan-500/50 transition-all duration-700 shadow-2xl">
              {/* Card Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative p-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all">
                    <span className="text-3xl font-black bg-gradient-to-br from-cyan-400 to-blue-500 text-transparent bg-clip-text">VX</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest border border-cyan-500/20">
                      Flagship
                    </span>
                  </div>
                </div>
                
                <h3 className="text-4xl font-black mb-4 text-white">VoltX</h3>
                <p className="text-zinc-400 text-lg mb-8 leading-relaxed flex-grow">
                  The ultimate offline battery health monitor. Featuring intelligent custom audio alarms, real-time hardware diagnostics (temperature/voltage), and beautiful full-screen visual overlays.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                    Zero Internet Required
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                    Absolute Privacy Guarantee
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">✓</div>
                    Pro-Level Hardware Diagnostics
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                  <span className="text-zinc-500 font-medium">Available on Indus App Store</span>
                  <button className="p-3 bg-white text-black rounded-full hover:bg-cyan-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Coming Soon Card */}
            <div className="relative rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 border-dashed flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 rounded-3xl bg-zinc-900/50 flex items-center justify-center border border-white/5 mb-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-zinc-500">Project Nexus</h3>
              <p className="text-zinc-600">Currently in stealth development. A new era of productivity.</p>
            </div>
          </div>
        </section>

        {/* Global Corporate Footer */}
        <footer className="border-t border-white/10 bg-[#050505] pt-20 pb-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-2">
                <div className="text-2xl font-black tracking-tighter text-white mb-6">
                  WhizzyX<span className="text-cyan-500">.</span>
                </div>
                <p className="text-zinc-500 leading-relaxed max-w-sm">
                  Dedicated to crafting uncompromising digital tools. We believe software should be powerful, beautiful, and absolutely private.
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6">Company</h4>
                <ul className="space-y-4 text-zinc-500 font-medium">
                  <li><Link href="#about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                  <li><Link href="#careers" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
                  <li><Link href="#press" className="hover:text-cyan-400 transition-colors">Press Kit</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-6">Legal & Support</h4>
                <ul className="space-y-4 text-zinc-500 font-medium">
                  <li><Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link></li>
                  <li><a href="mailto:support@whizzyx.com" className="hover:text-cyan-400 transition-colors">Contact Support</a></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm font-medium text-zinc-600">
                © {new Date().getFullYear()} WhizzyX Technologies. All rights reserved.
              </p>
              <div className="flex gap-4">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-medium text-zinc-600">All Systems Operational</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </main>
  );
}
