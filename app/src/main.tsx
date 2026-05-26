import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("missing #root");
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Global page reset.
document.body.style.margin = "0";
document.body.style.padding = "0";
document.body.style.background = "#16161a";
document.body.style.color = "#ddd";
document.body.style.fontFamily = "system-ui, sans-serif";
document.body.style.overflow = "hidden";
