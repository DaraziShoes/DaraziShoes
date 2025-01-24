import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import "./style/AddBarcode.css";

const AddBarcode = ({ onSaveComplete }) => {
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState("");
  const [barcodes, setBarcodes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleBarcodeChange = (e) => {
    setBarcode(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const isFormValid = () => {
    return barcode.trim() !== "" && !isNaN(price) && parseFloat(price) > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Please enter a valid barcode and price.");
      return;
    }

    setSubmitting(true);
    try {
      const barcodeCollection = collection(db, "barcodes");
      await addDoc(barcodeCollection, {
        barcode,
        price: parseFloat(price),
        timestamp: serverTimestamp(),
      });

      setBarcode("");
      setPrice("");

      alert("Barcode and price saved successfully!");
      if (onSaveComplete) {
        onSaveComplete();
      }
      fetchBarcodes();
    } catch (error) {
      console.error("Error saving barcode and price:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchBarcodes = async () => {
    try {
      const barcodeCollection = collection(db, "barcodes");
      const barcodeSnapshot = await getDocs(barcodeCollection);
      const barcodeList = barcodeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBarcodes(barcodeList);
    } catch (error) {
      console.error("Error fetching barcodes:", error);
    }
  };

  useEffect(() => {
    fetchBarcodes();
  }, []);

  return (
    <div className="save-barcode-page">
      <form onSubmit={handleSubmit}>
        <h3>Barcode:</h3>
        <input
          type="text"
          id="barcode"
          name="barcode"
          value={barcode}
          onChange={handleBarcodeChange}
          placeholder="Enter barcode"
          required
        />
        <h3>Price (USD):</h3>
        <input
          type="number"
          id="price"
          name="price"
          value={price}
          onChange={handlePriceChange}
          placeholder="Enter price"
          required
          step="0.01"
        />
        <button type="submit" disabled={!isFormValid() || submitting}>
          {submitting ? "Saving..." : "Save Barcode"}
        </button>
      </form>

      <div className="barcode-list">
        <h2>Saved Barcodes</h2>
        {barcodes.length > 0 ? (
          <div className="barcode-cards">
            {barcodes.map((barcodeData) => (
              <div key={barcodeData.id} className="barcode-card">
                <img
                  src={`https://barcodeapi.org/api/128/${barcodeData.barcode}`}
                  alt={`Barcode for ${barcodeData.barcode}`}
                  title={`Barcode for ${barcodeData.barcode}`}
                />
                <p>Barcode: {barcodeData.barcode}</p>
                <p>Price: ${barcodeData.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No barcodes available.</p>
        )}
      </div>
    </div>
  );
};

export default AddBarcode;
