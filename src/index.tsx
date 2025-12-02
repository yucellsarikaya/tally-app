import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./theme/variables.css";

// Ionic Core CSS Dosyaları
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

// Tema ve Utility CSS Dosyaları (Eğer varsa, projenin theme klasöründen import edilir)
// import './theme/variables.css';
// import './theme/global.css';

// Ionic React'i Başlatma
import { setupIonicReact } from "@ionic/react";

// Ionic'i başlatıyoruz
setupIonicReact();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
