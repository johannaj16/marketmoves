import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Leaderboard from "./leaderboard.tsx";
import Portfolio from "./portfolioDashboard.tsx";
import SignUp from "./signUp";
/* <Leaderboard /> */
/* <SignUp /> */

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Portfolio />
  </StrictMode>
);
