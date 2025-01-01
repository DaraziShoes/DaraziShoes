import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { categories, genders } from "./CommonComponent";
import { db } from "./firebaseConfig";
import AddData from "./AddData";
import bcrypt from "bcryptjs";
import "./style/AdminPage.css";

const AdminPage = () => {
  const [shoes, setShoes] = useState({
    link: "",
    caption: "",
    description: "",
    category: "",
    gender: "",
  });
  const [password, setPassword] = useState(""); // State for password input
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Flag for authentication
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

  // Function to check password
  const checkPassword = async (passwordInput) => {
    try {
      // Get the hashed password from Firestore
      const passwordDocRef = doc(db, "admin", "password");
      const passwordDoc = await getDoc(passwordDocRef);

      if (passwordDoc.exists()) {
        const hashedPassword = passwordDoc.data().password;
        // Compare the input password with the hashed password
        const isMatch = await bcrypt.compare(passwordInput, hashedPassword);

        if (isMatch) {
          setIsAuthenticated(true); // Set to true if password matches
        } else {
          alert("Incorrect password!");
        }
      } else {
        console.error("No password document found!");
      }
    } catch (error) {
      console.error("Error checking password: ", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkPassword(password);
    }
  };

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

      {!isAuthenticated ? (
        <div className="password-section">
          <div className="password-input-container">
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span
              className="eye-icon"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? "👁️" : "👁️‍🗨️"}
            </span>
          </div>
          <button
            onClick={() => checkPassword(password)}
            disabled={password === ""}
          >
            Submit
          </button>
        </div>
      ) : (
        <div>
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
      )}
    </div>
  );
};

export default AdminPage;
