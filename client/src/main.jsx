// React core library.
import React from "react";
// ReactDOM connects React to the real browser page.
import ReactDOM from "react-dom/client";
// BrowserRouter lets the app change "pages" without reloading the browser.
import { BrowserRouter } from "react-router-dom";
// Our top-level component.
import App from "./App.jsx";
// Global styles.
import "./index.css";

// Find <div id="root"> in index.html and tell React to render our app inside it.
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode adds extra development warnings (does not affect production).
  <React.StrictMode>
    {/* Wrap App in the router so every component inside can use links and URLs */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
