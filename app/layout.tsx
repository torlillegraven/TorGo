
import "./globals.css";
import RegisterSW from "./register-sw";

export const metadata = {
  title: "Teddy Travels — RFID Travel Log",
  description: "Kid-friendly travel log with a teddy bear theme."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&display=swap" rel="stylesheet"/>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#8b5e3c" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, fontFamily: "Fredoka, ui-sans-serif, system-ui, Arial, Helvetica, sans-serif" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", padding: 20 }}>
          <header>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="/bear.svg" alt="Teddy logo" width={48} height={48} style={{ borderRadius: 12 }} />
              <h1 style={{ margin: 0 }}>Teddy Travels</h1>
            </div>
            <nav className="navbar">
              <a href="/" className="btn secondary">Home</a>
              <a href="/map" className="btn secondary">Map</a>
              <a href="/postcard/new" className="btn">Postcard</a>
              <a href="/logs" className="btn accent">Stories</a>
              <a href="/invite" className="btn mint">Invite</a>
              <a href="/recommendations" className="btn plum">Ideas</a>
            </nav>
          </header>
          {children}
        </div>
        <RegisterSW />
      </body>
    </html>
  );
}
