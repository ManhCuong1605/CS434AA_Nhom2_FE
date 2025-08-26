import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ChatProvider } from "./context/ChatContext"; // Import ChatProvider
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { HelmetProvider } from "react-helmet-async";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode> {/* Tắt Strict Mode để tránh duplicate calls */}
  <HelmetProvider>
    <ChatProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChatProvider>
  </HelmetProvider>
  // </React.StrictMode>
);

// Nếu cần đo hiệu suất
reportWebVitals();