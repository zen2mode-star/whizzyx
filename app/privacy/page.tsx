import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "VoltX Privacy Policy — WhizzyX",
  description: "Official Privacy Policy for the VoltX mobile application by the WhizzyX Team.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
        
        <Link href="/developer" className="inline-block mb-10 text-zinc-500 hover:text-cyan-400 transition-colors font-medium">
          ← Back to Developer Profile
        </Link>
        
        <header className="mb-16 border-b border-white/10 pb-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
            Privacy Policy
          </h1>
          <div className="flex gap-4 text-zinc-400 text-sm font-medium">
            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5">VoltX Application</span>
            <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5">Effective: June 7, 2026</span>
          </div>
        </header>

        <article className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-p:text-zinc-400 prose-a:text-cyan-400">
          <p className="text-lg leading-relaxed mb-8">
            The WhizzyX Team ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains our practices regarding the collection, use, and disclosure of your information when you use the VoltX mobile application (the "Service").
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Information Collection and Use</h2>
            <p className="leading-relaxed">
              VoltX is designed to operate entirely offline as a local utility tool. <strong className="text-white">We do not collect, store, transmit, or share any personal data, usage data, or identifiable information.</strong>
            </p>
            <p className="leading-relaxed mt-4">
              Because our Service operates entirely locally on your device, we have designed it so that no data ever leaves your smartphone.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. Device Permissions</h2>
            <p className="leading-relaxed mb-4">To function correctly, VoltX requires specific local permissions on your Android device. These permissions are used exclusively for core app functionality:</p>
            <ul className="space-y-3 list-disc pl-5">
              <li><strong className="text-white">Foreground Service Permission:</strong> Required to monitor your device's battery status continuously in the background so that alarms can trigger accurately.</li>
              <li><strong className="text-white">Post Notifications Permission:</strong> Required to display active monitoring status and trigger visual/audible alarms when battery thresholds are met.</li>
              <li><strong className="text-white">Boot Completed Permission:</strong> Required to automatically restart the battery monitoring service when you turn on your device.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. Third-Party Services & Analytics</h2>
            <p className="leading-relaxed">
              We do not use any third-party analytics tools, crash reporting services, or tracking software. VoltX does not contain any third-party APIs or external SDKs. The application does not request internet access, ensuring that third-party data transmission is technically impossible.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. Security</h2>
            <p className="leading-relaxed">
              We value your trust. While no method of electronic storage is 100% secure, VoltX ensures maximum security by completely eliminating external server connections and relying solely on Android's secure local storage framework.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions, concerns, or suggestions regarding our Privacy Policy or the VoltX application, please contact us at: <a href="mailto:support@whizzyx.com">support@whizzyx.com</a>.
            </p>
          </section>
        </article>

      </div>
    </main>
  );
}
