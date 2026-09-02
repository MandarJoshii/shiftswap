import { useEffect, useState } from "react";
import { getHealth, type HealthResponse } from "./api/health";

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>ShiftSwap</h1>
      <p>Trade shifts, not text messages.</p>

      {error && <p style={{ color: "red" }}>Backend error: {error}</p>}
      {health && (
        <p style={{ color: "green" }}>
          Backend status: {health.data.status} (checked at{" "}
          {health.data.timestamp})
        </p>
      )}
      {!health && !error && <p>Connecting to backend...</p>}
    </div>
  );
}

export default App;