import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { Analytics } from "@vercel/analytics/react";
injectSpeedInsights();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster />
    <Analytics />
  </React.StrictMode>
);
