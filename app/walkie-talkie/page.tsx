"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function WalkieTalkiePage() {
  const [ip, setIp] = useState("");
  const [status, setStatus] = useState("disconnected"); // disconnected, connecting, connected, error
  const [statusMessage, setStatusMessage] = useState("Offline - Enter Android Device IP to begin");
  const [logs, setLogs] = useState<string[]>([]);
  const [isBeeping, setIsBeeping] = useState(false);
  
  // Web Audio Context to play local sound feedback
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Load last saved IP from localStorage on client side
    const savedIp = localStorage.getItem("gokit_walkie_ip");
    if (savedIp) {
      setIp(savedIp);
    }
  }, []);

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${time}] ${message}`, ...prev.slice(0, 19)]);
  };

  const handleConnect = async () => {
    if (!ip) {
      setStatusMessage("Error: IP Address is required");
      return;
    }
    localStorage.setItem("gokit_walkie_ip", ip);
    setStatus("connecting");
    setStatusMessage(`Attempting TCP bridge to ${ip}:8888...`);
    addLog(`Connecting to ${ip}...`);

    try {
      const res = await fetch("/api/walkie-talkie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, action: "CONNECT" }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("connected");
        setStatusMessage(`Connected to Android Peer at ${ip}`);
        addLog("TCP Tunnel Established with GoKit App.");
      } else {
        setStatus("error");
        setStatusMessage(`Error: ${data.error || "Failed to connect"}`);
        addLog(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setStatus("error");
      setStatusMessage(`Bridge Failure: ${e.message}`);
      addLog(`Failed: ${e.message}`);
    }
  };

  const handleDisconnect = async () => {
    setStatus("connecting");
    addLog("Closing socket...");
    try {
      await fetch("/api/walkie-talkie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, action: "DISCONNECT" }),
      });
      setStatus("disconnected");
      setStatusMessage("Disconnected from Peer");
      addLog("TCP connection torn down.");
    } catch (e: any) {
      setStatus("disconnected");
      setStatusMessage("Disconnected");
    }
  };

  // Web Audio helpers
  const startLocalAudio = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.value = 1000; // 1000Hz Morse Tone
      
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05); // Smooth fade in

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch (e) {
      console.error("Audio Context error", e);
    }
  };

  const stopLocalAudio = () => {
    try {
      const osc = oscillatorRef.current;
      const gain = gainNodeRef.current;
      const ctx = audioContextRef.current;
      
      if (osc && gain && ctx) {
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05); // Smooth fade out
        setTimeout(() => {
          osc.stop();
          osc.disconnect();
        }, 60);
      }
    } catch (e) {
      console.error(e);
    } finally {
      oscillatorRef.current = null;
      gainNodeRef.current = null;
    }
  };

  // Trigger Beep
  const triggerBeep = async (isOn: boolean) => {
    if (status !== "connected") {
      setStatusMessage("Must connect to GoKit device IP first");
      return;
    }

    setIsBeeping(isOn);
    if (isOn) {
      startLocalAudio();
      addLog("MORSE KEY DOWN -> BEEP ON");
    } else {
      stopLocalAudio();
      addLog("MORSE KEY UP -> BEEP OFF");
    }

    try {
      await fetch("/api/walkie-talkie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ip, action: isOn ? "BEEP_ON" : "BEEP_OFF" }),
      });
    } catch (e: any) {
      addLog(`Send Error: ${e.message}`);
    }
  };

  // Pre-coded Morse sequences helper
  const playMorseSequence = async (sequence: string) => {
    if (status !== "connected") {
      setStatusMessage("Connect to Peer first to send macro");
      return;
    }
    addLog(`Sending Macro Sequence: ${sequence}`);
    const symbols = sequence.split("");
    for (const sym of symbols) {
      if (sym === ".") {
        await triggerBeep(true);
        await new Promise((resolve) => setTimeout(resolve, 150));
        await triggerBeep(false);
        await new Promise((resolve) => setTimeout(resolve, 150));
      } else if (sym === "-") {
        await triggerBeep(true);
        await new Promise((resolve) => setTimeout(resolve, 450));
        await triggerBeep(false);
        await new Promise((resolve) => setTimeout(resolve, 150));
      } else if (sym === " ") {
        await new Promise((resolve) => setTimeout(resolve, 450));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white font-sans p-6 md:p-12 flex flex-col justify-between">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#00ffcc]">
            WHIZZYX TACTICAL WIRELESS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            OFFLINE WI-FI MORSE CODE WALKIE-TALKIE CONTROL TERMINAL
          </p>
        </div>
        <Link href="/" className="text-xs border border-zinc-700 rounded-full px-4 py-2 hover:bg-zinc-800 transition">
          Exit Terminal
        </Link>
      </header>

      {/* Main Terminal Interface */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 flex-1">
        {/* Left Control Panel */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[#0e0e14] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#00ffcc] mb-4">
              1. Connection Controller
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">
                  Android Device Local IP (shown on GoKit screen)
                </label>
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="e.g. 192.168.1.15"
                  className="w-full bg-[#171725] border border-zinc-700 rounded-xl px-4 py-3 text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-[#00ffcc] transition"
                  disabled={status === "connected" || status === "connecting"}
                />
              </div>

              <div className="flex gap-4">
                {status !== "connected" ? (
                  <button
                    onClick={handleConnect}
                    disabled={status === "connecting"}
                    className="flex-1 bg-[#00ffcc] text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition disabled:opacity-50"
                  >
                    {status === "connecting" ? "Establishing..." : "Connect Peer"}
                  </button>
                ) : (
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition"
                  >
                    Disconnect Peer
                  </button>
                )}
              </div>
            </div>

            {/* Connection Status indicator */}
            <div className="mt-6 border-t border-zinc-800 pt-4 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Tunnel Status:</span>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${
                  status === "connected" ? "bg-emerald-500 animate-pulse" :
                  status === "connecting" ? "bg-amber-500 animate-bounce" : "bg-red-500"
                }`} />
                <span className="text-xs font-mono uppercase font-bold text-zinc-300">
                  {status}
                </span>
              </div>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-3 bg-black/40 p-3 rounded-lg border border-zinc-900">
              {statusMessage}
            </p>
          </div>

          {/* Quick Macros */}
          <div className="bg-[#0e0e14] border border-zinc-800 rounded-2xl p-6 shadow-2xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#00ffcc] mb-4">
              2. Pre-Coded Morse Macros
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => playMorseSequence("... --- ...")}
                className="bg-[#171725] hover:bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-left transition"
              >
                <div className="text-xs text-[#00ffcc] font-bold">SOS (Emergency)</div>
                <div className="text-xs text-zinc-400 font-mono mt-1">... --- ...</div>
              </button>
              <button
                onClick={() => playMorseSequence("--- -.-")}
                className="bg-[#171725] hover:bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-left transition"
              >
                <div className="text-xs text-[#00ffcc] font-bold">OK (Ack)</div>
                <div className="text-xs text-zinc-400 font-mono mt-1">--- -.-</div>
              </button>
              <button
                onClick={() => playMorseSequence(".... ..")}
                className="bg-[#171725] hover:bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-left transition"
              >
                <div className="text-xs text-[#00ffcc] font-bold">HI (Greeting)</div>
                <div className="text-xs text-zinc-400 font-mono mt-1">.... ..</div>
              </button>
              <button
                onClick={() => playMorseSequence("..- -")}
                className="bg-[#171725] hover:bg-zinc-800 border border-zinc-700 rounded-xl p-3 text-left transition"
              >
                <div className="text-xs text-[#00ffcc] font-bold">UT (Tension)</div>
                <div className="text-xs text-zinc-400 font-mono mt-1">..- -</div>
              </button>
            </div>
          </div>
        </section>

        {/* Morse Key Pad & Live Feed */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Key */}
          <div className="bg-[#0e0e14] border border-zinc-800 rounded-2xl p-6 shadow-2xl flex-1 flex flex-col justify-between min-h-[300px]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#00ffcc]">
              3. Interactive Morse Key Pad
            </h2>

            <div className="flex justify-center my-6">
              <button
                onMouseDown={() => triggerBeep(true)}
                onMouseUp={() => triggerBeep(false)}
                onMouseLeave={() => isBeeping && triggerBeep(false)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  triggerBeep(true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  triggerBeep(false);
                }}
                className={`w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all transform duration-100 ${
                  isBeeping
                    ? "bg-[#00ffcc] border-white text-black scale-95 shadow-[0_0_50px_rgba(0,255,204,0.6)]"
                    : "bg-[#1f1f2e] border-[#00ffcc] text-white hover:bg-[#28283d] active:scale-95"
                }`}
                disabled={status !== "connected"}
              >
                <span className="text-4xl">📡</span>
                <span className="text-xs font-bold uppercase tracking-widest mt-3">
                  {isBeeping ? "TRANSMITTING" : "TAP & HOLD"}
                </span>
              </button>
            </div>

            <div className="text-center text-xs text-zinc-500 font-mono">
              Press and hold to send Morse tone signal to your Android device. Ensure the GoKit Walkie-Talkie screen is active.
            </div>
          </div>

          {/* Console Output logs */}
          <div className="bg-[#0e0e14] border border-zinc-800 rounded-2xl p-6 shadow-2xl h-48 flex flex-col">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Console Activity Logs
            </h2>
            <div className="flex-1 bg-black/40 border border-zinc-900 rounded-xl p-4 overflow-y-auto font-mono text-[11px] text-[#00ffcc] space-y-1">
              {logs.length === 0 ? (
                <div className="text-zinc-600">No terminal logs recorded.</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={log.includes("BEEP ON") ? "text-emerald-400 font-bold" : log.includes("Error") ? "text-red-500" : ""}>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] text-zinc-600 border-t border-zinc-800 pt-6">
        WhizzyX Innovation Lab &copy; 2026. All survival systems functional.
      </footer>
    </div>
  );
}
