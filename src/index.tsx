import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./theme/variables.css";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

import { setupIonicReact } from "@ionic/react";

setupIonicReact();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
