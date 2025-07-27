import React, { useEffect, useState } from "react";
import axios from "axios";

function FooterColumnOne({ userLoggedIn }) {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const [columnOne, setColumnOne] = useState({ heading: "", description: "" });
  const [msg, setMsg] = useState("");
  const [footerExists, setFooterExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/footerOne");
        if (response.data) {
          setColumnOne({
            heading: response.data.heading || "",
            description: response.data.description || "",
          });
          if (response.data.footerPath) {
            setFilePreview(`http://localhost:5001/${response.data.footerPath}`);
          }
          setFooterExists(true);
        }
      } catch (error) {
        console.error("Error fetching footer:", error);
        setMsg("No footer found. You can upload a new one.");
        setFooterExists(false);
        MessageTimeout();
      }
    };

    fetchFooter();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setColumnOne({ ...columnOne, [name]: value });
  };

  const MessageTimeout = () => {
    setTimeout(() => setMsg(""), 3000);
  };

  const UploadFooter = async () => {
    if (!file && !columnOne.heading && !columnOne.description) {
      setMsg("⚠️ Please provide at least one field to update.");
      MessageTimeout();
      return;
    }

    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append("heading", columnOne.heading);
    formData.append("description", columnOne.description);

    try {
      await axios.post("http://localhost:5001/api/footerOne", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setIsEditing(false);
      setMsg("✅ Footer updated successfully!");
      setFooterExists(true);
    } catch (error) {
      console.error("Error updating footer:", error);
      setMsg("❌ Failed to update footer. Please try again.");
    }
    MessageTimeout();
  };

  const handleDeleteFooter = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete("http://localhost:5001/api/footerOne", {
        withCredentials: true,
      });
      setColumnOne({ heading: "", description: "" });
      setFile(null);
      setFilePreview("");
      setFooterExists(false);
      setMsg("Footer Deleted");
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting footer:", error);
      setMsg("❌ Failed to delete footer.");
    }
    MessageTimeout();
  };

  return (
    <div className="footer-column">
      {msg && <p className="msg-text">{msg}</p>}

      <div className="footer-logo-heading">
        {filePreview && (
          <img src={filePreview} alt="Logo" className="footer-logo" />
        )}
        <h3 className="footer-headingOne">{columnOne.heading}</h3>
      </div>
      <p className="footer-textOne">{columnOne.description}</p>

      {!isEditing && footerExists && userLoggedIn && !showConfirm && (
        <div className="button-group">
          <button onClick={() => setIsEditing(true)} className="banner-button">
            Edit
          </button>
          <button className="banner-button-dlt" onClick={handleDeleteFooter}>
            Delete
          </button>
        </div>
      )}
      {showConfirm && (
        <div className="confirm-delete-container">
          <p className="confirmdeletemsg">
            Are you sure you want to delete this Footer 1?
          </p>
          <div className="button-group">
            <button onClick={confirmDelete} className="banner-button-dlt">
              Yes, Delete
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="banner-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {(isEditing || !footerExists) && userLoggedIn && (
        <div className="editformcontainer">
          <div className="editformcontainer-Contact">
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="footer-file-input"
            />
            <input
              type="text"
              name="heading"
              placeholder="Enter Heading"
              value={columnOne.heading}
              onChange={handleInputChange}
              className="footer-text-input"
            />
          </div>
          <div className="editformcontainer-details">
            <input
              type="text"
              name="description"
              placeholder="Enter Description"
              value={columnOne.description}
              onChange={handleInputChange}
              className="footer-text-input"
            />
          </div>
          <div className="button-group">
            <button onClick={UploadFooter} className="footer-submit-button">
              {footerExists ? "Save" : "Upload"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="banner-button-close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FooterColumnOne;
