import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareWhatsapp,
  faSquareInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faSquarePhone,
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import "./style/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="contact-info">
        <p>
          <FontAwesomeIcon icon={faMapLocationDot} />
          Location:{" "}
          <a
            href="https://maps.app.goo.gl/8CPcFGLTTyzV9oqv9"
            target="_blank"
            rel="noreferrer"
          >
            Saida-Awkaf street-Down Town
          </a>
        </p>
        <p>
          <FontAwesomeIcon icon={faSquarePhone} />
          Telephone: <span>07/721693</span> - <span>07/720209</span>
        </p>
        <p>
          <FontAwesomeIcon icon={faSquareWhatsapp} />
          WhatsApp:{" "}
          <a href="https://wa.me/+96176761318" target="_blank" rel="noreferrer">
            76/761318
          </a>
        </p>
        <p>
          <FontAwesomeIcon icon={faSquareInstagram} />
          Instagram:{" "}
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
