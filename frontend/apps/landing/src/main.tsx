import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

function Landing() {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>🦕 Dino-Atlas</h1>
      <p>Dino-Abenteuer fuer Kinder. Coming soon.</p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Landing />
  </StrictMode>,
);
