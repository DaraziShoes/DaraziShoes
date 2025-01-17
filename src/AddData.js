import React, { useState } from "react";
import { categories, genders, API_KEYS } from "./CommonComponent";
import { collection, addDoc } from "firebase/firestore";
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
      const currentApiKeyIndex =
        localStorage.getItem("currentApiKeyIndex") || 0;
      const apiKey = API_KEYS[currentApiKeyIndex];

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );
      console.log(currentApiKeyIndex);

      const result = await response.json();

      if (result.success) {
        setImageUrl(result.data.url);
        setShoe((prevShoe) => ({ ...prevShoe, link: result.data.url }));

        const nextApiKeyIndex =
          (parseInt(currentApiKeyIndex) + 1) % API_KEYS.length;
        localStorage.setItem("currentApiKeyIndex", nextApiKeyIndex);
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

  return (
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
      <button
        id="addshoe"
        type="submit"
        ref={inputRefs.submit}
        disabled={!isFormValid() || submitting}
      >
        {submitting ? "Adding..." : "Add Shoe"}
      </button>
    </form>
  );
};

export default AddData;
