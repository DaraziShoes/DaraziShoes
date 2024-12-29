import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./style/App.css";
import logo from "./assets/images/logo.png";
import { Link } from "react-router-dom";
import { convertToPreviewLink } from "./CommonFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMale, faFemale, faChild } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [shoes, setShoes] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);

  useEffect(() => {
    const fetchShoes = async () => {
      const shoesCollection = collection(db, "shoes");
      const shoesSnapshot = await getDocs(shoesCollection);
      const shoesList = shoesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShoes(shoesList);
    };

    fetchShoes();
  }, []);

  // Group shoes by gender and category
  const groupedShoesByGender = shoes.reduce((acc, shoe) => {
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
    return (
      <div className="gender-categories">
        {Object.keys(shoesForGender).map((category) => (
          <div key={category} className="category-section">
            <h3 className="category-title">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            <div className="category-row">
              {shoesForGender[category]
                .slice(0, 5)
                .map((shoe) => (
                  <div key={shoe.id} className="shoe-card">
                   <iframe
                    src={convertToPreviewLink(shoe.link)}
                    title={shoe.caption}
                  ></iframe>
                    <h3>{shoe.caption}</h3>
                    <p>{shoe.description}</p>
                  </div>
                ))}
            </div>
            <Link to={`/category/${category}`} className="show-all-button">
              Show All
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="Darazi Shoes Logo" className="logo" />
          <h1 className="title">Darazi Shoes</h1>
        </div>
      </header>

      {/* Gender selection buttons */}
      {!selectedGender && (
        <div className="gender-buttons">
        <button onClick={() => handleGenderSelect("Men")}>
          <FontAwesomeIcon icon={faMale} /> Men
        </button>
        <button onClick={() => handleGenderSelect("Women")}>
          <FontAwesomeIcon icon={faFemale} /> Women
        </button>
        <button onClick={() => handleGenderSelect("Boys")}>
          <FontAwesomeIcon icon={faChild} /> Boys
        </button>
        <button onClick={() => handleGenderSelect("Girls")}>
          <FontAwesomeIcon icon={faChild} /> Girls
        </button>
      </div>
      )}

      {/* Render shoes for selected gender */}
      {selectedGender && (
        <div className="gender-section">
          <h2 className="gender-title">{selectedGender}</h2>
          {renderShoesForGender(selectedGender)}
        </div>
      )}
    </div>
  );
}

export default App;
