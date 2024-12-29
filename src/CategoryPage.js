import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./style/CategoryPage.css";
import { convertToPreviewLink } from "./CommonFunctions";

function CategoryPage() {
  const { category } = useParams();
  const [shoes, setShoes] = useState([]);

  useEffect(() => {
    const fetchShoes = async () => {
      const shoesCollection = collection(db, "shoes");
      const shoesSnapshot = await getDocs(shoesCollection);
      const shoesList = shoesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((shoe) => shoe.category === category);
      setShoes(shoesList);
    };

    fetchShoes();
  }, [category]);

  return (
    <div className="category-page">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)} - All Items</h1>
      <div className="category-grid">
        {shoes.map((shoe) => (
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
    </div>
  );
}

export default CategoryPage;
