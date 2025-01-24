import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchResults from "./SearchResults";
import CategoryPage from "./CategoryPage";
import ScanPage from "./ScanPage";
import AdminPage from "./AdminPage";
import HomePage from "./HomePage";
import GenderPage from "./GenderPage";
import InfoPage from "./InfoPage";
import "./style/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/gender/:gender" element={<GenderPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
