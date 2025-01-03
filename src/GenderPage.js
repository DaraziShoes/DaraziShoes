import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import logo from "./assets/images/logo.png";
import { Link } from "react-router-dom";
import { db } from "./firebaseConfig";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import "./style/HomePage.css";
import "./style/App.css";

function GenderPage() {
  const [shoes, setShoes] = useState([]);
  const { gender } = useParams();

  useEffect(() => {
    const fetchShoes = async () => {
      const shoesCollection = collection(db, "shoes");
      const shoesSnapshot = await getDocs(shoesCollection);
      const shoesList = shoesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((shoe) => shoe.gender === gender);
      setShoes(shoesList);
    };

    fetchShoes();
  }, [gender]);

  const groupedShoesByCategory = shoes.reduce((acc, shoe) => {
    const { category } = shoe;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shoe);
    return acc;
  }, {});

  return (
    <div className="gender-page">
      <div className="App">
        <SearchBar />
        <header className="header">
          <div className="logo-container">
            <img src={logo} alt="Darazi Shoes Logo" className="logo" />
          </div>
        </header>
        <div className="gender-section">
          <h2 className="gender-title">{gender}</h2>
          {shoes.length === 0 ? (
            <p>Loading...</p>
          ) : (
            Object.keys(groupedShoesByCategory).map((category) => (
              <div key={category} className="gender-categories">
                <h3 className="category-title">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
                <div className="category-row">
                  {groupedShoesByCategory[category].slice(0, 5).map((shoe) => (
                    <div className="shoe-card">
                      <img
                        src={shoe.link}
                        alt={shoe.caption}
                        title={shoe.caption}
                      ></img>
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
            ))
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default GenderPage;
