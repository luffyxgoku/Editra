import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar({ userLoggedIn, userName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const [logoUrl, setLogoUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/footerOne");
        if (res.data.footerPath) {
          setLogoUrl(`http://localhost:5001/${res.data.footerPath}`);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/footerOne",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setLogoUrl(`http://localhost:5001/${res.data.footer.footerPath}`);
      setSelectedFile(null);
      setEditing(false);
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };

  return (
    <div className="navbar">
      <div className="logo-container">
        <img className="logo-img" src={logoUrl} alt="logo" />
      </div>
      {userLoggedIn && !editing && (
        <button className="nav-edit-button" onClick={() => setEditing(true)}>
          Edit
        </button>
      )}
      {editing && (
        <div className="edit-logo">
          <input
            type="file"
            onChange={handleFileChange}
            className="nav-input"
          />
          <button className="nav-submit-button" onClick={handleUpload}>
            Submit
          </button>
          <button
            onClick={() => setEditing(false)}
            className="nav-close-button"
          >
            Close
          </button>
        </div>
      )}

      {/* <div className="logo-container">
        <img className="logo-img" src={logo} alt="logo" />
      </div> */}

      {isMobile ? (
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </div>
      ) : null}

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/" className="link" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/about" className="link" onClick={() => setMenuOpen(false)}>
          About
        </Link>
        <Link to="/blog" className="link" onClick={() => setMenuOpen(false)}>
          Blog
        </Link>
        <Link to="/contact" className="link" onClick={() => setMenuOpen(false)}>
          Contact
        </Link>

        {userLoggedIn ? (
          <>
            <Link
              to="/write"
              className="link"
              onClick={() => setMenuOpen(false)}
            >
              Write
            </Link>
            <Link
              to="/enquiries"
              className="link"
              onClick={() => setMenuOpen(false)}
            >
              Enquiries
            </Link>
            <Link
              to="/signout"
              className="link"
              onClick={() => setMenuOpen(false)}
            >
              Signout
            </Link>
          </>
        ) : (
          <Link
            to="/signin"
            className="link"
            onClick={() => setMenuOpen(false)}
          >
            Signin
          </Link>
        )}
      </div>

      {userLoggedIn && !isMobile && (
        <div className="nav-user-container">
          <p className="nav-userName">Welcome {userName?.split(" ")[0]}</p>
        </div>
      )}
    </div>
  );
}

export default Navbar;
