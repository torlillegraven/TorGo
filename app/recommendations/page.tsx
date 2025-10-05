
"use client";

import { useEffect, useState } from "react";

type Loc = { lat: number; lng: number; timestamp: string };

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export default function Recommendations() {
  const [tagId, setTagId] = useState<string>(process.env.NEXT_PUBLIC_DEFAULT_TAG_ID || "demo-tag");
  const [locs, setLocs] = useState<Loc[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const r = await fetch("/api/locations?tagId=" + encodeURIComponent(tagId));
        const data = await r.json();
        setLocs(Array.isArray(data) ? data : []);
      } catch {
        setLocs([]);
      }
    }
    load();
  }, [tagId]);

  const last = locs.length > 0 ? locs[locs.length - 1] : undefined;

  let totalKm = 0;
  for (let i = 1; i < locs.length; i++) {
    totalKm += distanceKm(locs[i - 1].lat, locs[i - 1].lng, locs[i].lat, locs[i].lng);
  }
  totalKm = Math.round(totalKm);

  return (
    <main className="grid">
      <section className="card">
        <h2>Trip Ideas</h2>
        <div className="grid two">
          <div>
            <label>Tag ID</label>
            <input className="input" value={tagId} onChange={(e) => setTagId(e.target.value)} />
          </div>
          <div>
            <label>Last stop</label>
            <div className="notice" style={{ marginTop: 8 }}>
              {last
                ? last.lat.toFixed(4) + ", " + last.lng.toFixed(4) + " (as of " + new Date(last.timestamp).toLocaleString() + ")"
                : "No locations yet — add one via /api/rfid/ingest or Postcard/Stories."}
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <h3>Photo postcard ideas</h3>
        <ul className="cute">
          <li>Take a picture with your travel buddy Teddy in the frame.</li>
          <li>Find a colorful wall, door, or market booth and snap a close-up.</li>
          <li>Hold up a sign that says "Hello from here!" and smile big.</li>
        </ul>
      </section>

      <section className="card">
        <h3>Tasty stops</h3>
        <ul className="cute">
          <li>Hot chocolate or warm tea at a cozy cafe near your last stop.</li>
          <li>Try a sweet treat from a local bakery and describe the taste.</li>
          <li>Ask someone friendly for their favorite snack in town.</li>
        </ul>
      </section>

      <section className="card">
        <h3>Travel tips</h3>
        <ul className="cute">
          <li>Stay with your grown-up and keep your devices charged.</li>
          <li>Use a small backpack to carry Teddy, snacks, and a notebook.</li>
          <li>Take breaks and drink water so the adventure stays fun.</li>
        </ul>
        <p className="notice" style={{ marginTop: 8 }}>
          Total distance recorded so far: <strong>{totalKm} km</strong>
        </p>
      </section>
    </main>
  );
}
