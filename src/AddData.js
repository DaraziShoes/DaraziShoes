import React from "react";
import { categories, genders } from "./CommonComponent";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

const AddData = ({ shoe, setShoe }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShoe((prevShoe) => ({ ...prevShoe, [name]: value }));
  };

  const isFormValid = () => {
    return shoe.link && shoe.description && shoe.category && shoe.gender;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data on submit:", shoe);
    if (!isFormValid()) {
      console.error("Form is not valid");
      return;
    }

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

      console.log("Shoe added to Firestore:", shoe);
    } catch (error) {
      console.error("Error adding shoe:", error);
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
        {genders.map((gender) => (
          <option key={gender} value={gender}>
            {gender}
          </option>
        ))}
      </select>
      <button id="addshoe" type="submit" disabled={!isFormValid()}>
        Add Shoe
      </button>
    </form>
  );
};

export default AddData;
