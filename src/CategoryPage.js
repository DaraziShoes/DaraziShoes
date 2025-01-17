import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { query, collection, getDocs, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";
import logo from "./assets/images/logo.png";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import "./style/CategoryPage.css";

function CategoryPage() {
  const { category } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const gender = queryParams.get("gender");
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const shoesCollection = collection(db, "shoes");
        const shoesQuery = query(shoesCollection, orderBy("timestamp", "desc"));
        const shoesSnapshot = await getDocs(shoesQuery);
        const shoesList = shoesSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (shoe) =>
              shoe.category === category && (!gender || shoe.gender === gender)
          );
        setShoes(shoesList);
      } catch (error) {
        console.error("Error fetching shoes:", error);
      }
    };

    fetchShoes();
  }, [category, gender]);

  return (
    <div className="App">
      <SearchBar />
      <header className="header">
        <div className="logo-container">
          <a href="/">
            <img src={logo} alt="Darazi Shoes Logo" className="logo" />
          </a>
        </div>
      </header>
      <div className="category-page">
        <h1>
          {category.charAt(0).toUpperCase() + category.slice(1)} for{" "}
          {gender || "All"}
        </h1>
        <div className="category-grid">
          {shoes.map((shoe) => (
            <div key={shoe.id} className="shoe-card">
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
      </div>
      <Footer />
    </div>
  );
}

export default CategoryPage;
