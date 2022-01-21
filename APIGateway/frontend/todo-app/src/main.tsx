import "./polyfills";
import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import db from "../tests/mocks/db";
import AuthProvider from "./auth/AuthProvider";

if (process.env.NODE_ENV === "development") {
  db.seed();
  await import("../tests/mocks/browser")
    .then((module) => {
      module.worker.start();
    })
    .catch((err) => console.log(err));
}

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
