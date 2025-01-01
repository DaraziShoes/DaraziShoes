import React from "react";
import "./style/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="contact-info">
        <p>Saida-Awkaf street-Down Town</p>
        <p>Tel: 07/721693 07/720209</p>
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
