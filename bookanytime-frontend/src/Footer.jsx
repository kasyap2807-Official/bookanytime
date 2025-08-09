import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer style={{ backgroundColor: '#212529', color: '#fff', padding: '40px 0', width: '100%', margin: '0',}}>
      <div style={{ maxWidth: '100%', margin: '0 auto' }}>
        <div className="row text-center text-md-start px-3 px-md-5">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="text-white mb-3">BookAnytime</h5>
            <p className="text-white-50">Find your perfect stay anywhere in the world</p>
          </div>
          <div className="col-md-3 mb-4 mb-md-0">
            <h5 className="text-white mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white text-decoration-none">Home</a></li>
              <li><a href="/search" className="text-white text-decoration-none">Search</a></li>
              <li><a href="/list-property" className="text-white text-decoration-none">List Property</a></li>
            </ul>
          </div>
          <div className="col-md-5">
            <h5 className="text-white mb-3">Contact Us</h5>
            <p className="text-white-50"><i className="bi bi-envelope me-2"></i> info@bookanytime.com</p>
            <p className="text-white-50"><i className="bi bi-telephone me-2"></i> +1 (123) 456-7890</p>
            <div className="d-flex justify-content-center justify-content-md-start">
              <a href="#" className="text-white me-3"><FaFacebook /></a>
              <a href="#" className="text-white me-3"><FaTwitter /></a>
              <a href="#" className="text-white"><FaInstagram /></a>
            </div>
          </div>
        </div>

        <div className="row mt-4 m-0">
          <div className="col text-center text-white-50">
            <small>&copy; {new Date().getFullYear()} BookAnytime. All rights reserved.</small>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;