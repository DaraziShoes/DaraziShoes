import React from "react";
import "./style/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="contact-info">
        <p>Contact Us: 70 000000</p>
        <p>
          Follow us on Instagram{" "}
          <a
            href="https://www.instagram.com/darazishoes/"
            target="_blank"
            rel="noopener noreferrer"
          >
            @darazishoes
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
