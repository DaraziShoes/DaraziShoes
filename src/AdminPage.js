import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { categories, genders } from "./CommonComponent";
import { db } from "./firebaseConfig";
import AddData from "./AddData";
import "./style/AdminPage.css";

const AdminPage = () => {
  const [shoes, setShoes] = useState({
    link: "",
    caption: "",
    description: "",
    category: "",
    gender: "",
  });

  useEffect(() => {
    const fetchShoes = async () => {
      const shoesCollection = collection(db, "shoes");
      const shoesSnapshot = await getDocs(shoesCollection);
      const shoesList = shoesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const categorizedShoes = shoesList.reduce((acc, shoe) => {
        const category = shoe.category || "Uncategorized";
        const gender = shoe.gender || "Uncategorized";

        if (!acc[category]) acc[category] = {};
        if (!acc[category][gender]) acc[category][gender] = [];

        acc[category][gender].push(shoe);

        return acc;
      }, {});

      setShoes(categorizedShoes);
    };

    fetchShoes();
  }, []);

  const handleDelete = async (id, category, gender) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "shoes", id));
        setShoes((prevShoes) => {
          const updatedGenderCategory = prevShoes[category][gender].filter(
            (shoe) => shoe.id !== id
          );
          return {
            ...prevShoes,
            [category]: {
              ...prevShoes[category],
              [gender]: updatedGenderCategory,
            },
          };
        });
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      <div className="preview">
        <AddData shoe={shoes} setShoe={setShoes} />
        <div className="shoe-card">
          <img src={shoes.link} title={shoes.caption}></img>
          <div className="shoe-info">
            <h3>{shoes.caption}</h3>
            <p>{shoes.description}</p>
          </div>
        </div>
      </div>
      {categories.map((category) =>
        genders.map((gender) =>
          shoes[category]?.[gender]?.length > 0 ? (
            <div key={`${category}-${gender}`}>
              <h2>{`${category} (${gender})`}</h2>
              <div className="admin-gallery">
                {shoes[category][gender].map((shoe) => (
                  <div
                    key={shoe.id}
                    className="admin-card"
                    onClick={() => handleDelete(shoe.id, category, gender)}
                  >
                    <img src={shoe.link} title={shoe.caption}></img>
                    <div className="hover-overlay">
                      <div className="delete-icon">X</div>
                    </div>
                    <h3>{shoe.caption}</h3>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )
      )}
      {shoes["Uncategorized"]?.["Uncategorized"]?.length > 0 && (
        <div>
          <h2>Uncategorized</h2>
          <div className="admin-gallery">
            {shoes["Uncategorized"]["Uncategorized"].map((shoe) => (
              <div
                key={shoe.id}
                className="admin-card"
                onClick={() =>
                  handleDelete(shoe.id, "Uncategorized", "Uncategorized")
                }
              >
                <img src={shoe.link} title={shoe.caption}></img>
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
