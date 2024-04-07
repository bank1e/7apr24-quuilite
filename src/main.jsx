import React from "react";
import "semantic-ui-css/semantic.min.css";
import App from "./App.jsx";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
