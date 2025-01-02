import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
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
      const shoesCollection = collection(db, "shoes");
      const shoesSnapshot = await getDocs(shoesCollection);
      const shoesList = shoesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (shoe) =>
            shoe.category === category && (!gender || shoe.gender === gender)
        );
      setShoes(shoesList);
    };

    fetchShoes();
  }, [category, gender]);

  return (
    <div className="App">
      <SearchBar />
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
        <Footer />
      </div>
    </div>
  );
}

export default CategoryPage;
