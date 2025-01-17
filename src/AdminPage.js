import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { categories, genders } from "./CommonComponent";
import { db } from "./firebaseConfig";
import AddData from "./AddData";
import bcrypt from "bcryptjs";
import "./style/AdminPage.css";

const AdminPage = () => {
  const [paragraphs, setParagraphs] = useState([]);
  const [newParagraph, setNewParagraph] = useState("");
  const [shoes, setShoes] = useState({
    link: "",
    caption: "",
    description: "",
    category: "",
    gender: "",
  });
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("photo_library");

  const paragraphsCollection = collection(db, "paragraphs");

  const checkPassword = async (passwordInput) => {
    try {
      passwordInput = passwordInput.replace(/\s+/g, "");
      const passwordDocRef = doc(db, "admin", "password");
      const passwordDoc = await getDoc(passwordDocRef);

      if (passwordDoc.exists()) {
        const hashedPassword = passwordDoc.data().password;
        const isMatch = await bcrypt.compare(passwordInput, hashedPassword);

        if (isMatch) {
          setIsAuthenticated(true);
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

  useEffect(() => {
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

  const handleResizeTextarea = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const fetchParagraphs = async () => {
    try {
      const querySnapshot = await getDocs(paragraphsCollection);
      const paragraphsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const textWithNewlines = data.text.replace(/__NEWLINE__/g, "\n");
        return { id: doc.id, text: textWithNewlines };
      });

      setParagraphs(paragraphsData);
    } catch (error) {
      console.error("Error fetching paragraphs:", error);
      alert("Failed to load paragraphs. Please try again.");
    }
  };

  useEffect(() => {
    fetchShoes();
    fetchParagraphs();
    // eslint-disable-next-line
  }, []);

  const handleAddParagraph = async () => {
    if (newParagraph.trim() === "") {
      alert("Paragraph cannot be empty.");
      return;
    }

    const textWithPlaceholder = newParagraph.replace(/\n/g, "__NEWLINE__");

    try {
      const docRef = await addDoc(paragraphsCollection, {
        text: textWithPlaceholder,
      });

      setParagraphs((prev) => [
        ...prev,
        { id: docRef.id, text: textWithPlaceholder },
      ]);

      setNewParagraph("");

      const textarea = document.querySelector(".add-paragraph textarea");
      if (textarea) {
        textarea.style.height = "auto";
      }
    } catch (error) {
      console.error("Error adding paragraph:", error);
      alert("Failed to add the paragraph. Please try again.");
    }
  };

  const handleUpdateParagraph = async (id, updatedText) => {
    if (updatedText.trim() === "") {
      alert("Paragraph cannot be empty.");
      return;
    }

    const textWithPlaceholder = updatedText.replace(/\n/g, "__NEWLINE__");

    try {
      await updateDoc(doc(db, "paragraphs", id), { text: textWithPlaceholder });

      setParagraphs((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, text: textWithPlaceholder.replace(/__NEWLINE__/g, "\n") }
            : p
        )
      );
    } catch (error) {
      console.error("Error updating paragraph:", error);
      alert("Failed to update the paragraph. Please try again.");
    }
  };

  const handleDeleteParagraph = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this paragraph?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "paragraphs", id));
        setParagraphs((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting paragraph:", error);
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
          <nav>
            <div className="navbar">
              <div
                id="photo_library"
                className={`photo_library-icon ${
                  activeTab === "photo_library" ? "active" : ""
                }`}
                onClick={() => setActiveTab("photo_library")}
              >
                <span className="material-icons">photo_library</span>
              </div>
              <div className="vertical-line"></div>
              <div
                id="keyboard"
                className={`keyboard-icon ${
                  activeTab === "keyboard" ? "active" : ""
                }`}
                onClick={() => setActiveTab("keyboard")}
              >
                <span className="material-icons">keyboard</span>
              </div>
            </div>

            <div className="content">
              {activeTab === "keyboard" && (
                <div id="keyboard-content" className="content-keyboard"></div>
              )}
              {activeTab === "photo_library" && (
                <div
                  id="photo_library-content"
                  className="content-photo-library"
                ></div>
              )}
            </div>
          </nav>
          <div>
            {activeTab === "photo_library" && (
              <div>
                <h2>Edit Images</h2>
                <div className="preview">
                  <AddData
                    shoe={shoes}
                    setShoe={setShoes}
                    onAddComplete={fetchShoes}
                  />
                  <div className="shoe-card">
                    <img src={shoes.link} alt="" title={shoes.caption}></img>
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
                              onClick={() =>
                                handleDelete(shoe.id, category, gender)
                              }
                            >
                              <img
                                src={shoe.link}
                                alt={shoe.caption}
                                title={shoe.caption}
                              ></img>
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
                            handleDelete(
                              shoe.id,
                              "Uncategorized",
                              "Uncategorized"
                            )
                          }
                        >
                          <img
                            src={shoe.link}
                            alt={shoe.caption}
                            title={shoe.caption}
                          ></img>
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
            {activeTab === "keyboard" && (
              <div>
                <h2>Edit Paragraphs</h2>
                <div className="boxes-page">
                  {paragraphs.map((p) => (
                    <div key={p.id} className="box-admin">
                      <textarea
                        value={p.text}
                        onChange={(e) =>
                          setParagraphs((prev) =>
                            prev.map((par) =>
                              par.id === p.id
                                ? { ...par, text: e.target.value }
                                : par
                            )
                          )
                        }
                        onBlur={(e) =>
                          handleUpdateParagraph(p.id, e.target.value)
                        }
                        onClick={(e) => handleResizeTextarea(e)}
                        onInput={(e) => handleResizeTextarea(e)}
                        className="editable-textarea"
                      />
                      <button onClick={() => handleDeleteParagraph(p.id)}>
                        Delete
                      </button>
                    </div>
                  ))}
                  <div className="add-paragraph">
                    <textarea
                      value={newParagraph}
                      onChange={(e) => setNewParagraph(e.target.value)}
                      onInput={(e) => handleResizeTextarea(e)}
                      placeholder="Add new paragraph"
                    />
                    <button onClick={handleAddParagraph}>Add Paragraph</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
