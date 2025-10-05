
"use client";

import { useState } from "react";

export default function InvitePage() {
  const [tagId, setTagId] = useState(process.env.NEXT_PUBLIC_DEFAULT_TAG_ID || "demo-tag");
  const [link, setLink] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function createInvite(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Making a magic link...");
    setLink(null);
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tagId })
    });
    if (!res.ok) { setStatus("Could not make a link"); return; }
    const data = await res.json();
    const url = `${window.location.origin}/share/${data.code}`;
    setLink(url);
    setStatus("Link ready! Share it with friends and family.");
  }

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!link) { setStatus("Make a link first"); return; }
    try {
      const code = link.split("/").pop() || "";
      const res = await fetch("/api/followers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, email })
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("Follower added");
      setEmail("");
    } catch (err: any) {
      setStatus("Error: " + (err?.message || "Could not add"));
    }
  }

  function copyLink() {
    if (link) navigator.clipboard.writeText(link).then(() => setStatus("Link copied"));
  }

  return (
    <main className="grid">
      <section className="card">
        <h2>Invite friends and family</h2>
        <p>They can follow your journey and see your postcards.</p>
        <form onSubmit={createInvite} className="grid two">
          <div>
            <label>Tag ID</label>
            <input className="input" value={tagId} onChange={e => setTagId(e.target.value)} />
          </div>
          <div style={{ alignSelf: "end" }}>
            <button className="btn mint" type="submit">Create Invite Link</button>
          </div>
        </form>
        {link && (
          <div style={{ marginTop: 12 }}>
            <strong>Share this link:</strong>
            <div className="notice" style={{ marginTop: 8, wordBreak: "break-all" }}>{link}</div>
            <button className="btn secondary" onClick={copyLink} style={{ marginTop: 8 }}>Copy link</button>
          </div>
        )}
      </section>

      <section className="card">
        <h3>Send me postcards by email</h3>
        <p>Collect emails here (you can export or use an email service later).</p>
        <form onSubmit={subscribe} className="grid two">
          <div>
            <label>Follower Email</label>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="friend@example.com" />
          </div>
          <div style={{ alignSelf: "end" }}>
            <button className="btn accent" type="submit">Add Follower</button>
          </div>
        </form>
        {status && <p className="notice" style={{ marginTop: 8 }}>{status}</p>}
      </section>
    </main>
  );
}
