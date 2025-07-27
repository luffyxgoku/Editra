import React, { useEffect, useState } from "react";
import axios from "axios";

function FooterColumnThree({ userLoggedIn }) {
  const [columnThree, setColumnThree] = useState({
    heading: "",
    address: "",
    phone: "",
    email: "",
  });

  const [filePreviews, setFilePreviews] = useState({
    addressPath: "",
    phonePath: "",
    emailPath: "",
  });

  const [files, setFiles] = useState({
    addressPath: null,
    phonePath: null,
    emailPath: null,
  });

  const [msg, setMsg] = useState("");
  const [footerExists, setFooterExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/footerThree"
        );
        if (response.data.footer) {
          const { heading, details } = response.data.footer;
          setColumnThree({
            heading: heading || "",
            address: details?.address || "",
            phone: details?.phone || "",
            email: details?.email || "",
          });

          setFilePreviews({
            addressPath: details?.addressPath
              ? `http://localhost:5001/${details.addressPath}`
              : "",
            phonePath: details?.phonePath
              ? `http://localhost:5001/${details.phonePath}`
              : "",
            emailPath: details?.emailPath
              ? `http://localhost:5001/${details.emailPath}`
              : "",
          });

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
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files[0] }));
    setFilePreviews((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(files[0]),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setColumnThree((prev) => ({ ...prev, [name]: value }));
  };

  const MessageTimeout = () => {
    setTimeout(() => setMsg(""), 3000);
  };

  const UploadFooter = async () => {
    if (
      !columnThree.heading &&
      !columnThree.address &&
      !columnThree.phone &&
      !columnThree.email &&
      !files.addressPath &&
      !files.phonePath &&
      !files.emailPath
    ) {
      setMsg("⚠️ Please provide at least one field to update.");
      MessageTimeout();
      return;
    }

    const formData = new FormData();
    if (files.addressPath) formData.append("addressPath", files.addressPath);
    if (files.phonePath) formData.append("phonePath", files.phonePath);
    if (files.emailPath) formData.append("emailPath", files.emailPath);

    formData.append("heading", columnThree.heading);
    formData.append(
      "details",
      JSON.stringify({
        address: columnThree.address,
        phone: columnThree.phone,
        email: columnThree.email,
      })
    );

    try {
      await axios.post("http://localhost:5001/api/footerThree", formData, {
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

  const confirmDelete = async () => {
    try {
      await axios.delete("http://localhost:5001/api/footerThree", {
        withCredentials: true,
      });
      setColumnThree({ heading: "", address: "", phone: "", email: "" });
      setFilePreviews({ addressPath: "", phonePath: "", emailPath: "" });
      setFooterExists(false);
      setMsg("Footer Deleted");
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting footer:", error);
      setMsg("❌ Failed to delete footer.");
    }
    MessageTimeout();
  };

  const handleDeleteFooter = async () => {
    setShowConfirm(true);
  };

  return (
    <div className="footer-column">
      {msg && <p className="msg-text">{msg}</p>}

      <h3 className="footer-heading">{columnThree.heading}</h3>

      <div className="footer-contact">
        {filePreviews.addressPath && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              columnThree.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={filePreviews.addressPath}
              alt="Address"
              className="footer-icon"
            />
          </a>
        )}
        <p className="footer-text">{columnThree.address}</p>
      </div>

      <div className="footer-contact">
        {filePreviews.phonePath && (
          <a
            href={`https://wa.me/${columnThree.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={filePreviews.phonePath}
              alt="Phone"
              className="footer-icon"
            />
          </a>
        )}
        <p className="footer-text">{columnThree.phone}</p>
      </div>

      <div className="footer-contact">
        {filePreviews.emailPath && (
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${columnThree.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={filePreviews.emailPath}
              alt="Email"
              className="footer-icon"
            />
          </a>
        )}
        <p className="footer-text">{columnThree.email}</p>
      </div>

      {userLoggedIn &&
        (footerExists && !isEditing ? (
          <div className="button-group">
            {!showConfirm ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="banner-button"
                >
                  Edit
                </button>
                <button
                  className="banner-button-dlt"
                  onClick={handleDeleteFooter}
                >
                  Delete
                </button>
              </>
            ) : (
              <div className="confirm-delete-container">
                <p className="confirmdeletemsg">
                  Are you sure you want to delete this Footer 3?
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
          </div>
        ) : (
          <div className="editformcontainer">
            <div className="editformcontainer-Contact">
              <input
                type="text"
                name="heading"
                placeholder="Enter Heading"
                value={columnThree.heading}
                onChange={handleInputChange}
                className="footer-text-input"
              />
            </div>
            <div className="editformcontainer-details">
              <input
                type="file"
                name="addressPath"
                onChange={handleFileChange}
                accept="image/*"
                className="footer-file-input"
              />
              <input
                type="text"
                name="address"
                placeholder="Enter Address"
                value={columnThree.address}
                onChange={handleInputChange}
                className="footer-text-input"
              />
            </div>
            <div className="editformcontainer-details">
              <input
                type="file"
                name="phonePath"
                onChange={handleFileChange}
                accept="image/*"
                className="footer-file-input"
              />
              <input
                type="text"
                name="phone"
                placeholder="Enter Phone"
                value={columnThree.phone}
                onChange={handleInputChange}
                className="footer-text-input"
              />
            </div>
            <div className="editformcontainer-details">
              <input
                type="file"
                name="emailPath"
                onChange={handleFileChange}
                accept="image/*"
                className="footer-file-input"
              />
              <input
                type="text"
                name="email"
                placeholder="Enter Email"
                value={columnThree.email}
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
        ))}
    </div>
  );
}

export default FooterColumnThree;
