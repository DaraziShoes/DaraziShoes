import React, { useState } from "react";
import {
  faMale,
  faFemale,
  faChildren,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { PASSWORD } from "./CommonComponent";
import logo from "./assets/images/logo.png";
import Footer from "./Footer";
import "./style/HomePage.css";

function HomePage() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleGenderSelect = (gender) => {
    navigate(`/gender/${gender}`);
  };

  const handleAdminAccess = () => {
    const password = prompt("Enter admin password:");
    if (password === PASSWORD) {
      navigate("/admin");
    }
  };

  return (
    <div className="home-page">
      <div className="App">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for shoes..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="search-input"
          />
          <button
            className="search-button"
            onClick={handleSearch}
            disabled={!searchInput.trim()}
          >
            Search
          </button>
        </div>
        <header className="header">
          <div className="logo-container">
            <a href="/">
              <img src={logo} alt="Darazi Shoes Logo" className="logo" />
            </a>
            <h1 className="title">Darazi Shoes</h1>
          </div>
        </header>
        <div className="gender-buttons">
          <button onClick={() => handleGenderSelect("Men")}>
            <FontAwesomeIcon icon={faMale} /> Men
          </button>
          <button onClick={() => handleGenderSelect("Women")}>
            <FontAwesomeIcon icon={faFemale} /> Women
          </button>
          <button onClick={() => handleGenderSelect("Kids")}>
            <FontAwesomeIcon icon={faChildren} /> Kids
          </button>
        </div>
        <div className="admin-button-container">
          <button className="admin-button" onClick={handleAdminAccess}></button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
