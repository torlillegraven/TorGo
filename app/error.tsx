
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="card">
      <h2>Oops! Something went wrong.</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{error.message}</pre>
      <button onClick={() => reset()} className="btn" style={{ marginTop: 12 }}>
        Try again
      </button>
    </div>
  );
}
