
"use client";

import { useState } from "react";

export default function NewPostcard() {
  const [tagId, setTagId] = useState(process.env.NEXT_PUBLIC_DEFAULT_TAG_ID || "demo-tag");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [lat, setLat] = useState<number | "">("");
  const [lng, setLng] = useState<number | "">("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = new FormData();
    form.set("tagId", tagId);
    form.set("title", title);
    form.set("body", body);
    form.set("lat", String(lat));
    form.set("lng", String(lng));
    if (file) form.set("image", file);

    const res = await fetch("/api/posts", { method: "POST", body: form });
    if (!res.ok) {
      const t = await res.text();
      setStatus("Error: " + t);
    } else {
      setStatus("Postcard saved!");
      setTitle(""); setBody(""); setLat(""); setLng(""); setFile(null);
    }
  }

  return (
    <main className="grid">
      <section className="card">
        <h2>Make a Postcard</h2>
        <p>Add a picture and a short story from your stop.</p>
        <form onSubmit={handleSubmit} className="grid two">
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
            <label>Story</label>
            <textarea className="textarea" rows={5} value={body} onChange={e => setBody(e.target.value)} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label>Photo</label>
            <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button className="btn" type="submit">Save Postcard</button>
          </div>
        </form>
        {status && <p className="notice" style={{ marginTop: 12 }}>{status}</p>}
      </section>
    </main>
  );
}
