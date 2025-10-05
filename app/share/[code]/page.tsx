"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LeafletStyles from "../../map/leaflet.css";

const MapContainer: any = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer: any = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker: any = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Polyline: any = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });
const Popup: any = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

type Loc = { lat: number; lng: number; timestamp: string };
type Post = { id: string; title: string; lat: number; lng: number; imageUrl?: string | null };

export default function SharePage({ params }: { params: { code: string } }) {
  const { code } = params;
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

  const center: [number, number] = locs.length
    ? [locs[locs.length - 1].lat, locs[locs.length - 1].lng]
    : [20, 0];

  return (
    <main className="grid">
      <div className="card">
        <h2>Shared Travel — Invite Code: {code}</h2>
        {error && <p className="notice">Error: {error}</p>}
      </div>
      <div className="card" style={{ padding: 0 }}>
        <LeafletStyles />
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