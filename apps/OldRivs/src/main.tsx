import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TeamHub } from "./pages/team-hub";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TeamHub />
  </StrictMode>
);
