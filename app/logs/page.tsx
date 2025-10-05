
"use client";

import { useEffect, useState } from "react";

type Post = { id: string; title: string; body: string; lat: number; lng: number; createdAt: string };

export default function LogsPage() {
  const [tagId, setTagId] = useState(process.env.NEXT_PUBLIC_DEFAULT_TAG_ID || "demo-tag");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [lat, setLat] = useState<number | "">("");
  const [lng, setLng] = useState<number | "">("");
  const [posts, setPosts] = useState<Post[]>([]);

  async function refresh() {
    const res = await fetch(`/api/posts?tagId=${encodeURIComponent(tagId)}`);
    const data = await res.json();
    setPosts(Array.isArray(data) ? data.sort((a: Post, b: Post) => b.createdAt.localeCompare(a.createdAt)) : []);
  }

  useEffect(() => { refresh(); }, [tagId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.set("tagId", tagId);
    form.set("title", title);
    form.set("body", body);
    form.set("lat", String(lat));
    form.set("lng", String(lng));
    const res = await fetch("/api/posts", { method: "POST", body: form });
    if (res.ok) { setTitle(""); setBody(""); setLat(""); setLng(""); refresh(); }
  }

  return (
    <main className="grid">
      <section className="card">
        <h2>Write a Travel Story</h2>
        <p>Tell everyone what you saw, heard, or tasted.</p>
        <form className="grid two" onSubmit={submit}>
          <div>
            <label>Tag ID</label>
            <input className="input" value={tagId} onChange={e => setTagId(e.target.value)} />
          </div>
          <div>
            <label>Title</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>
          <div>
            <label>Latitude</label>
            <input className="input" type="number" step="any" value={lat} onChange={e => setLat(e.target.value === "" ? "" : Number(e.target.value))} required />
          </div>
          <div>
            <label>Longitude</label>
            <input className="input" type="number" step="any" value={lng} onChange={e => setLng(e.target.value === "" ? "" : Number(e.target.value))} required />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Your story</label>
            <textarea className="textarea" rows={6} value={body} onChange={e => setBody(e.target.value)} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button className="btn accent" type="submit">Save Story</button>
          </div>
        </form>
      </section>
      <section className="card">
        <h2>Recent Stories</h2>
        <ul className="cute">
          {posts.map(p => (
            <li key={p.id} style={{ marginBottom: 10 }}>
              <strong>{p.title}</strong> — {new Date(p.createdAt).toLocaleString()} @ {p.lat.toFixed(4)},{p.lng.toFixed(4)}
              <p style={{ marginTop: 6 }}>{p.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
