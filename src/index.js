import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import CategoryPage from "./CategoryPage";
import AdminPage from "./AdminPage"; // Import the admin page component

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/category/:category" element={<CategoryPage />} />
      <Route path="/admin" element={<AdminPage />} /> {/* Admin route */}
    </Routes>
  </Router>
);
