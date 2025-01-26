import React, { useState } from "react";
import { genders, API_KEYS, categoryImages } from "./CommonComponent";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

const AddData = ({ shoe, setShoe, onAddComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputRefs = {
    caption: React.createRef(),
    description: React.createRef(),
    category: React.createRef(),
    gender: React.createRef(),
    submit: React.createRef(),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShoe((prevShoe) => ({ ...prevShoe, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const apiKeyDocRef = doc(db, "config", "apiKeyIndex");
      const apiKeyDocSnap = await getDoc(apiKeyDocRef);

      let currentApiKeyIndex = 0;

      if (apiKeyDocSnap.exists()) {
        currentApiKeyIndex = apiKeyDocSnap.data().currentIndex || 0;
      }

      const apiKey = API_KEYS[currentApiKeyIndex];

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        setImageUrl(result.data.url);
        setShoe((prevShoe) => ({ ...prevShoe, link: result.data.url }));

        const nextApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;

        await setDoc(apiKeyDocRef, { currentIndex: nextApiKeyIndex });
      } else {
        console.error("Image upload failed:", result);
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    } finally {
      setUploading(false);
    }
  };

  const isFormValid = () => {
    return shoe.link && shoe.description && shoe.category && shoe.gender;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      console.error("Form is not valid");
      return;
    }

    setSubmitting(true);
    try {
      const shoesCollection = collection(db, "shoes");
      await addDoc(shoesCollection, {
        link: shoe.link,
        caption: shoe.caption,
        description: shoe.description,
        category: shoe.category,
        gender: shoe.gender,
        timestamp: serverTimestamp(),
      });

      setShoe({
        link: "",
        caption: "",
        description: "",
        category: "",
        gender: "",
      });

      alert("Shoe added to Firestore successfully!");
      if (onAddComplete) {
        onAddComplete();
      }
    } catch (error) {
      console.error("Error adding shoe:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextField && nextField.current && nextField.current.focus();
    }
  };

  const handleDelete = async (id, category, gender) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "shoes", id));

        setShoe((prevShoe) => {
          const updatedCategoryGender = prevShoe[category][gender].filter(
            (shoe) => shoe.id !== id
          );

          const updatedCategory = {
            ...prevShoe[category],
            [gender]: updatedCategoryGender,
          };

          return {
            ...prevShoe,
            [category]: updatedCategory,
          };
        });

        alert("Shoe deleted successfully!");
      } catch (error) {
        console.error("Error deleting document:", error);
        alert("Failed to delete shoe.");
      }
    }
  };

  const categories =
    shoe.gender && categoryImages[shoe.gender]
      ? categoryImages[shoe.gender].map((item) => item.category)
      : [];

  return (
    <div>
      <div className="preview">
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            required
            onKeyDown={(e) => handleKeyDown(e, inputRefs.caption)}
          />
          <input
            type="text"
            name="caption"
            value={shoe.caption}
            onChange={handleChange}
            placeholder="Image Caption"
            ref={inputRefs.caption}
            onKeyDown={(e) => handleKeyDown(e, inputRefs.description)}
          />
          <input
            type="text"
            name="description"
            value={shoe.description}
            onChange={handleChange}
            placeholder="Shoe Description"
            required
            ref={inputRefs.description}
            onKeyDown={(e) => handleKeyDown(e, inputRefs.category)}
          />
          <select
            name="gender"
            value={shoe.gender || ""}
            onChange={handleChange}
            required
            ref={inputRefs.gender}
            onKeyDown={(e) => handleKeyDown(e, inputRefs.submit)}
          >
            <option value="" disabled>
              Select Gender
            </option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          <select
            name="category"
            value={shoe.category || ""}
            onChange={handleChange}
            required
            ref={inputRefs.category}
            onKeyDown={(e) => handleKeyDown(e, inputRefs.gender)}
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            id="addshoe"
            type="submit"
            ref={inputRefs.submit}
            disabled={!isFormValid() || submitting}
          >
            {submitting ? "Adding..." : "Add Shoe"}
          </button>
        </form>
        <div className="shoe-card">
          <img src={shoe.link} alt="" title={shoe.caption}></img>
          <div className="shoe-info">
            <h3>{shoe.caption}</h3>
            <p>{shoe.description}</p>
          </div>
        </div>
      </div>

      {Object.keys(categoryImages).map((gender) =>
        categoryImages[gender].map(({ category }) => {
          const shoesByCategoryAndGender = shoe[category]?.[gender]?.sort(
            (a, b) => b.timestamp - a.timestamp
          );

          return shoesByCategoryAndGender?.length > 0 ? (
            <div key={`${category}-${gender}`}>
              <h2>{`${category} (${gender})`}</h2>
              <div className="admin-gallery">
                {shoesByCategoryAndGender.map((shoe) => (
                  <div
                    key={shoe.id}
                    className="admin-card"
                    onClick={() => handleDelete(shoe.id, category, gender)}
                  >
                    <img
                      src={shoe.link}
                      alt={shoe.caption + " " + shoe.gender}
                      title={shoe.caption + " " + shoe.gender}
                    ></img>
                    <div className="hover-overlay">
                      <div className="delete-icon">X</div>
                    </div>
                    <h3>{shoe.caption}</h3>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })
      )}

      {shoe["Uncategorized"]?.["Uncategorized"]?.sort(
        (a, b) => b.timestamp - a.timestamp
      )?.length > 0 && (
        <div>
          <h2>Uncategorized</h2>
          <div className="admin-gallery">
            {shoe["Uncategorized"]["Uncategorized"].map((shoe) => (
              <div
                key={shoe.id}
                className="admin-card"
                onClick={() =>
                  handleDelete(shoe.id, "Uncategorized", "Uncategorized")
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
  );
};

export default AddData;
