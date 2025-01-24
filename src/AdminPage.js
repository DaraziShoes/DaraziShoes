import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import AddData from "./AddData";
import AddParagraph from "./AddParagraph";
import AddBarcode from "./AddBarcode";
import bcrypt from "bcryptjs";
import "./style/AdminPage.css";

const AdminPage = () => {
  const [paragraphs, setParagraphs] = useState([]);
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
              <div className="vertical-line"></div>
              <div
                id="barcode"
                className={`barcode-icon ${
                  activeTab === "barcode" ? "active" : ""
                }`}
                onClick={() => setActiveTab("barcode")}
              >
                <span class="material-symbols-outlined">barcode</span>
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
              {activeTab === "barcode" && (
                <div id="barcode-content" className="content-barcode"></div>
              )}
            </div>
          </nav>
          <div>
            {activeTab === "photo_library" && (
              <div>
                <h2>Edit Images</h2>
                <AddData
                  shoe={shoes}
                  setShoe={setShoes}
                  onAddComplete={fetchShoes}
                />
              </div>
            )}
            {activeTab === "keyboard" && (
              <div>
                <h2>Edit Paragraphs</h2>
                <AddParagraph
                  paragraphs={paragraphs}
                  setParagraphs={setParagraphs}
                />
              </div>
            )}
            {activeTab === "barcode" && (
              <div>
                <h2>Manage Barcodes</h2>
                <AddBarcode />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
