
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import LeafletStyles from "./leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

type Loc = { lat: number; lng: number; timestamp: string };
type Post = { id: string; title: string; lat: number; lng: number; imageUrl?: string | null };

export default function MapPage() {
  const [tagId, setTagId] = useState<string>(process.env.NEXT_PUBLIC_DEFAULT_TAG_ID || "demo-tag");
  const [locs, setLocs] = useState<Loc[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setError(null);
        const locRes = await fetch(`/api/locations?tagId=${encodeURIComponent(tagId)}`);
        const postRes = await fetch(`/api/posts?tagId=${encodeURIComponent(tagId)}`);
        if (!locRes.ok || !postRes.ok) throw new Error("API error");
        const locData = await locRes.json();
        const postData = await postRes.json();
        if (!cancelled) {
          setLocs(Array.isArray(locData) ? locData : []);
          setPosts(Array.isArray(postData) ? postData : []);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to load data");
          setLocs([]);
          setPosts([]);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [tagId]);

  const center = locs.length ? [locs[locs.length - 1].lat, locs[locs.length - 1].lng] as [number, number] : [20, 0];

  return (
    <main className="grid">
      <div className="card">
        <h2>Where is the tag now?</h2>
        <p>Type your tag id and see the path. Tap the markers to peek at postcards.</p>
        <input className="input" placeholder="Tag ID" value={tagId} onChange={(e) => setTagId(e.target.value)} />
        {error && <p className="notice" style={{ marginTop: 8 }}>Error: {error}</p>}
      </div>
      <div className="card" style={{ padding: 0 }}>
        <LeafletStyles />
        <MapContainer center={center} zoom={locs.length ? 8 : 2} scrollWheelZoom style={{ height: "70vh", width: "100%", borderRadius: 20 }}>
          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {locs.length > 0 && (
            <Polyline positions={locs.map(l => [l.lat, l.lng]) as [number, number][]} />
          )}
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
