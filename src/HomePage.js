import React from "react";
import {
  faMale,
  faFemale,
  faChild,
  faChildDress,
  faBarcode,
  faLock,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { PASSWORD } from "./CommonComponent";
import logo from "./assets/images/logo.png";
import flag from "./assets/images/lebanon.png";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import "./style/HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  const handleGenderSelect = (gender) => {
    navigate(`/gender/${gender}`);
  };

  const handleinfoSelect = () => {
    navigate(`/info`);
  };

  const handleBarcode = () => {
    navigate(`/scan`);
  };

  const handleAdminAccess = () => {
    const password = prompt("Enter admin password:");
    if (
      "$6$fwefhgwuwf874d84d5d4s84614s86d4dwa3s" +
        password +
        "$dhwqhdiuqdqw95dd4qwd" ===
      PASSWORD
    ) {
      navigate("/admin");
    }
  };

  return (
    <div className="home-page">
      <SearchBar />
      <div className="App">
        <header className="header">
          <div className="logo-container">
            <a href="/">
              <div className="logo-background"></div>
              <img src={logo} alt="Darazi Shoes Logo" className="logo-home" />
            </a>
            <h1 className="title">Darazi Shoes</h1>
          </div>
        </header>
        <div className="gender-buttons">
        <button
            className="selectgender"
            onClick={() => handleGenderSelect("Men")}
          >
            <FontAwesomeIcon icon={faMale} /> Men
          </button>
          <button
            className="selectgender"
            onClick={() => handleGenderSelect("Women")}
          >
            <FontAwesomeIcon icon={faFemale} /> Women
          </button>
          <div className="kids-buttons">
            <button
              id="boy-button"
              className="selectgender"
              onClick={() => handleGenderSelect("Boys")}
            >
              <FontAwesomeIcon icon={faChild} /> Boys
            </button>
            <button
              id="girl-button"
              className="selectgender"
              onClick={() => handleGenderSelect("Girls")}
            >
              <FontAwesomeIcon icon={faChildDress} /> Girls
            </button>
          </div>
          <div className="info-container">
            <button
              id="admin-button"
              className="info-button"
              onClick={handleAdminAccess}
            >
              <FontAwesomeIcon icon={faLock} />
            </button>
            <button className="info-button" onClick={() => handleBarcode()}>
              <FontAwesomeIcon icon={faBarcode} />
            </button>
            <button className="info-button" onClick={() => handleinfoSelect()}>
              <FontAwesomeIcon icon={faInfo} />
            </button>
          </div>
        </div>
        <div className="delivery-info">
          <p>
            Delivery available all over Lebanon{" "}
            <img src={flag} alt="Lebanon Flag" className="waving-flag" />!
            <br></br>You can place your orders through direct messages on our{" "}
            <a
              href="https://www.instagram.com/darazishoes/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>{" "}
            or{" "}
            <a
              href="https://wa.me/+96176761318"
              target="_blank"
              rel="noopener noreferrer"
            >
              Whatsapp
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
