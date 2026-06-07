"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, interest: query }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setQuery("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--bg-tertiary)', borderRadius: '16px' }}>
        <h4 style={{ fontSize: '24px', color: 'var(--status-active)', marginBottom: '16px' }}>Query Submitted Successfully!</h4>
        <p style={{ color: 'var(--text-secondary)' }}>Our team has received your request and will get back to you shortly.</p>
        <button 
          onClick={() => setStatus("idle")} 
          className="btn" 
          style={{ marginTop: '24px', background: 'var(--bg-primary)' }}
        >
          Submit Another Query
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="form-group" style={{ marginBottom: '0' }}>
        <label className="label">Your Name</label>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Enter your name" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "loading"}
        />
      </div>
      <div className="form-group" style={{ marginBottom: '0' }}>
        <label className="label">Email Address</label>
        <input 
          type="email" 
          className="form-control" 
          placeholder="Enter your email" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
        />
      </div>
      <div className="form-group" style={{ marginBottom: '0' }}>
        <label className="label">Query Details</label>
        <textarea 
          className="form-control" 
          rows={4} 
          placeholder="Describe your issue or request" 
          required
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={status === "loading"}
        ></textarea>
      </div>
      
      {status === "error" && (
        <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: 500, textAlign: 'center' }}>
          An error occurred. Please try again.
        </div>
      )}

      <button 
        type="submit" 
        className="btn btn-primary" 
        style={{ width: '100%', marginTop: '8px', cursor: status === "loading" ? 'not-allowed' : 'pointer', opacity: status === "loading" ? 0.7 : 1 }}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Submitting..." : "Submit Query"}
      </button>
    </form>
  );
}
