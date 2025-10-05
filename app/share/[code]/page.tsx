
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

type Loc = { lat: number; lng: number; timestamp: string };
type Post = { id: string; title: string; lat: number; lng: number; imageUrl?: string | null };

export default function SharePage({ params }: { params: { code: string } }) {
  const { code } = params;
  const [tagId, setTagId] = useState<string | null>(null);
  const [locs, setLocs] = useState<Loc[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setError(null);
        const info = await fetch(`/api/invite?code=${encodeURIComponent(code)}`);
        if (!info.ok) throw new Error("Invalid invite code");
        const data = await info.json();
        if (cancelled) return;
        setTagId(data.tagId);
        const [locRes, postRes] = await Promise.all([
          fetch(`/api/locations?tagId=${encodeURIComponent(data.tagId)}`),
          fetch(`/api/posts?tagId=${encodeURIComponent(data.tagId)}`),
        ]);
        const [locData, postData] = await Promise.all([locRes.json(), postRes.json()]);
        if (!cancelled) {
          setLocs(Array.isArray(locData) ? locData : []);
          setPosts(Array.isArray(postData) ? postData : []);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load");
      }
    }
    load();
    return () => { cancelled = true; };
  }, [code]);

  const center = locs.length ? [locs[locs.length - 1].lat, locs[locs.length - 1].lng] as [number, number] : [20, 0];

  return (
    <main className="grid">
      <div className="card">
        <h2>Shared Travel — Invite Code: {code}</h2>
        {error && <p className="notice">Error: {error}</p>}
      </div>
      <div className="card" style={{ padding: 0 }}>
        <MapContainer center={center} zoom={locs.length ? 8 : 2} scrollWheelZoom style={{ height: "70vh", width: "100%", borderRadius: 20 }}>
          <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locs.length > 0 && <Polyline positions={locs.map(l => [l.lat, l.lng]) as [number, number][]} />}
          {posts.map(p => (
            <Marker key={p.id} position={[p.lat, p.lng]}>
              <Popup>
                <strong>{p.title}</strong>
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.title} style={{ maxWidth: 220, borderRadius: 8, marginTop: 8 }} />
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </main>
  );
}
