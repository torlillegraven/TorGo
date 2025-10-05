
import Link from "next/link";

export default function Home() {
  return (
    <main className="grid">
      <section className="hero">
        <div className="hero-art">
          <img src="/bear-trip.png" alt="Travel Teddy" style={{ width: "100%", borderRadius: 20 }} />
        </div>
        <div className="card" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: 28, margin: 0 }}>Hello from Teddy! Let's go on an adventure.</h2>
          <p style={{ marginTop: 10 }}>Track your tag on the map, make photo postcards, and write stories for friends and family.</p>
          <div className="hero-buttons" style={{ marginTop: 12 }}>
            <Link href="/map" className="btn sky">See the Map</Link>
            <Link href="/postcard/new" className="btn">Make a Postcard</Link>
            <Link href="/logs" className="btn accent">Write a Story</Link>
            <Link href="/invite" className="btn mint">Invite Friends</Link>
            <Link href="/recommendations" className="btn plum">Trip Ideas</Link>
          </div>
          <p className="notice" style={{ marginTop: 12 }}>
            Tip: default tag id is demo-tag. You can change it in forms or set NEXT_PUBLIC_DEFAULT_TAG_ID in .env.
          </p>
        </div>
      </section>
    </main>
  );
}
