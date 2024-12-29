import React, { useState } from "react";
import { db } from "./firebaseConfig"; // Import your firebase configuration
import { collection, addDoc } from "firebase/firestore";

const AddData = () => {
  const [shoe, setShoe] = useState({
    link: "",
    caption: "",
    description: "",
    category: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Sports",
    "Football",
    "Sport Chic",
    "Formal",
    "Sandals",
    "Flip-flops",
  ];

  const genders = ["Men", "Women", "Boys", "Girls"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShoe({ ...shoe, [name]: value });
  };

  const isFormValid = () => {
    return (
      shoe.link !== "" &&
      shoe.caption !== "" &&
      shoe.description !== "" &&
      shoe.category !== "" &&
      shoe.gender !== ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !isFormValid()) return; // Do not submit if form is not valid

    setIsLoading(true);

    try {
      const docRef = await addDoc(collection(db, "shoes"), shoe);
      console.log("Document written with ID: ", docRef.id);
      setShoe({
        link: "",
        caption: "",
        description: "",
        category: "",
        gender: "",
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="link"
        value={shoe.link}
        onChange={handleChange}
        placeholder="Image link"
        required
      />
      <input
        type="text"
        name="caption"
        value={shoe.caption}
        onChange={handleChange}
        placeholder="Image Caption"
        required
      />
      <input
        type="text"
        name="description"
        value={shoe.description}
        onChange={handleChange}
        placeholder="Shoe Description"
        required
      />
      <select
        name="category"
        value={shoe.category}
        onChange={handleChange}
        required
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
        value={shoe.gender}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Select Gender
        </option>
        {genders.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button id="addshoe" type="submit" disabled={isLoading || !isFormValid()}>
        {isLoading ? "Adding..." : "Add Shoe"}
      </button>
    </form>
  );
};

export default AddData;
