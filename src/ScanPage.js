import React, { useState, useEffect, useRef } from "react";
import Quagga from "quagga";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";
import logo from "./assets/images/logo.png";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import "./style/ScanPage.css";

const ScanPage = () => {
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState(null);
  const [error, setError] = useState("");
  const [database, setDatabase] = useState({});
  const scannerRef = useRef(null);

  const fetchDatabase = async () => {
    try {
      const barcodeCollection = collection(db, "barcodes");
      const snapshot = await getDocs(barcodeCollection);
      const barcodeData = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        barcodeData[data.barcode] = `$${data.price.toFixed(2)}`;
      });
      setDatabase(barcodeData);
    } catch (err) {
      console.error("Error fetching barcodes:", err);
    }
  };

  useEffect(() => {
    fetchDatabase();
  }, []);

  useEffect(() => {
    if (scannerRef.current) {
      Quagga.init(
        {
          inputStream: {
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              facingMode: "environment",
            },
          },
          decoder: {
            readers: ["ean_reader", "code_128_reader"],
          },
        },
        (err) => {
          if (err) {
            console.error("Error initializing Quagga:", err);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        setBarcode(code);

        if (database[code]) {
          setPrice(database[code]);
          setError("");
        } else {
          setPrice(null);
          setError("Item not found.");
        }
      });

      return () => {
        Quagga.stop();
      };
    }
  }, [database]);

  return (
    <div className="home-page">
      <SearchBar />
      <div className="App">
        <header className="header">
          <div className="logo-container">
            <a href="/">
              <div className="logo-background"></div>
              <img src={logo} alt="Darazi Shoes Logo" className="logo-home" />
            </a>
          </div>
        </header>
        <div className="scan-page">
          <div className="scanner-container" ref={scannerRef}></div>
          <div className="result-container">
            {barcode && (
              <p className="barcode-text">Scanned Barcode: {barcode}</p>
            )}
            {price && <p className="price-text">Price: {price}</p>}
            {error && <p className="error-text">{error}</p>}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ScanPage;
