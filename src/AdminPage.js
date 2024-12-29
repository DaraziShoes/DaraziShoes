import React, { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import "./style/AdminPage.css";
import AddData from "./AddData";
import { convertToPreviewLink } from "./CommonFunctions";

const AdminPage = () => {
  const [shoes, setShoes] = useState({});
  const categories = [
    "Sports",
    "Football",
    "Sport Chic",
    "Formal",
    "Sandals",
    "Flip-flops",
  ];

  useEffect(() => {
    const fetchShoes = async () => {
      const shoesCollection = collection(db, "shoes");
      const shoesSnapshot = await getDocs(shoesCollection);
      const shoesList = shoesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Group shoes by category
      const categorizedShoes = shoesList.reduce((acc, shoe) => {
        const category = shoe.category || "Uncategorized"; // Default category
        if (!acc[category]) acc[category] = [];
        acc[category].push(shoe);
        return acc;
      }, {});
      setShoes(categorizedShoes);
    };

    fetchShoes();
  }, []);

  const handleDelete = async (id, category) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "shoes", id));
        setShoes((prevShoes) => {
          const updatedCategory = prevShoes[category].filter(
            (shoe) => shoe.id !== id
          );
          return { ...prevShoes, [category]: updatedCategory };
        });
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <AddData />
      {categories.map((category) =>
        shoes[category]?.length > 0 ? ( // Only display categories with shoes
          <div key={category}>
            <h2>{category}</h2>
            <div className="admin-gallery">
              {shoes[category]?.map((shoe) => (
                <div
                  key={shoe.id}
                  className="admin-card"
                  onClick={() => handleDelete(shoe.id, category)}
                >
                  <iframe
                    src={convertToPreviewLink(shoe.link)}
                    title={shoe.caption}
                  ></iframe>
                  <div className="hover-overlay">
                    <div className="delete-icon">X</div>
                  </div>
                  <h3>{shoe.caption}</h3>
                </div>
              ))}
            </div>
          </div>
        ) : null
      )}
      {shoes["Uncategorized"]?.length > 0 && ( // Check for Uncategorized shoes
        <div>
          <h2>Uncategorized</h2>
          <div className="admin-gallery">
            {shoes["Uncategorized"].map((shoe) => (
              <div
                key={shoe.id}
                className="admin-card"
                onClick={() => handleDelete(shoe.id, "Uncategorized")}
              >
                <iframe
                  src={convertToPreviewLink(shoe.link)}
                  title={shoe.caption}
                ></iframe>
                <div className="hover-overlay">
                  <div className="delete-icon">X</div>
                </div>
                <h3>{shoe.caption}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
