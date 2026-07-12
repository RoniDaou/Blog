import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

import "../src/styles/index.css";
import "../src/styles/home.css";
import "../src/styles/styles.css";

import App from "./App";
import { API_URL } from "./config";

// Send every relative Axios request to the backend API.
axios.defaults.baseURL = API_URL;

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
