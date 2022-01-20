import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

if (process.env.NODE_ENV === "development") {
  await import("../tests/mocks/browser")
    .then((module) => {
      module.worker.start();
    })
    .catch((err) => console.log(err));
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
