import React, { useEffect, useState } from "react";
import { faMale, faFemale, faChild } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { collection, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/images/logo.png";
import { db } from "./firebaseConfig";
import Footer from "./Footer";
import "./style/App.css";

function App() {
  const [selectedGender, setSelectedGender] = useState(null);
  const [filteredShoes, setFilteredShoes] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShoes = async () => {
      const shoesCollection = collection(db, "shoes");
      const shoesSnapshot = await getDocs(shoesCollection);
      const shoesList = shoesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFilteredShoes(shoesList);
    };

    fetchShoes();
  }, []);

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

  const groupedShoesByGender = filteredShoes.reduce((acc, shoe) => {
    const { gender, category } = shoe;
    if (!acc[gender]) {
      acc[gender] = {};
    }
    if (!acc[gender][category]) {
      acc[gender][category] = [];
    }
    acc[gender][category].push(shoe);
    return acc;
  }, {});

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const renderShoesForGender = (gender) => {
    const shoesForGender = groupedShoesByGender[gender];
    if (!shoesForGender) {
      return <p>Loading!</p>;
    }
    return (
      <div className="gender-categories">
        {Object.keys(shoesForGender).map((category) => (
          <div key={category} className="category-section">
            <h3 className="category-title">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            <div className="category-row">
              {shoesForGender[category].slice(0, 5).map((shoe) => (
                <div key={shoe.id} className="shoe-card">
                  <img src={shoe.link} title={shoe.caption}></img>
                  <div className="shoe-info">
                    <h3>{shoe.caption}</h3>
                    <p>{shoe.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to={`/category/${category}?gender=${gender}`}
              className="show-all-button"
            >
              Show All
            </Link>
          </div>
        ))}
      </div>
    );
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
            <img src={logo} alt="Darazi Shoes Logo" className="logo" />
            {!selectedGender && <h1 className="title">Darazi Shoes</h1>}
          </div>
        </header>
        {!selectedGender && (
          <div className="gender-buttons">
            <button onClick={() => handleGenderSelect("Men")}>
              <FontAwesomeIcon icon={faMale} /> Men
            </button>
            <button onClick={() => handleGenderSelect("Women")}>
              <FontAwesomeIcon icon={faFemale} /> Women
            </button>
            <button onClick={() => handleGenderSelect("Kids")}>
              <FontAwesomeIcon icon={faChild} /> Kids
            </button>
          </div>
        )}
        {selectedGender && (
          <div className="gender-section">
            <h2 className="gender-title">{selectedGender}</h2>
            {renderShoesForGender(selectedGender)}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
