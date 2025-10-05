
"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="card">
          <h2>App error</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
          <button onClick={() => reset()} className="btn" style={{ marginTop: 12 }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
