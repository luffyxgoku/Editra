import React, { useEffect, useState } from "react";
import axios from "axios";
import SocialMedia from "./SocialMedia";

function Contact({ userLoggedIn }) {
  const [enter, setEnter] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [inputs, setInputs] = useState({
    address: "",
    phone: "",
    email: "",
  });
  const [filePreviews, setFilePreviews] = useState({
    contactPath: "",
    addressPath: "",
    phonePath: "",
    emailPath: "",
  });
  const [files, setFiles] = useState({
    contactPath: null,
    addressPath: null,
    phonePath: null,
    emailPath: null,
  });
  const [msg, setMsg] = useState("");
  const [contactExists, setContactExists] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/contact");
        if (response.data.contact) {
          const { contactPath, details } = response.data.contact;
          setInputs({
            address: details?.address || "",
            phone: details?.phone || "",
            email: details?.email || "",
          });
          setFilePreviews({
            contactPath: contactPath
              ? `http://localhost:5001/${contactPath}`
              : "",
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
          setContactExists(true);
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        setMsg("No contact found. You can upload a new one.");
        setContactExists(false);
        MessageTimeout();
      }
    };

    fetchContact();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setEnter((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/enquiries",
        {
          name: enter.name,
          email: enter.email,
          phone: enter.phone,
          msg: enter.message,
        },
        { withCredentials: true }
      );
      if (response.status === 201) {
        setMsg("Enquiry Posted");
        setEnter({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      console.log(error);
      setMsg("Enquiry Failed!!!");
    }
  };

  const MessageTimeout = () => {
    setTimeout(() => setMsg(""), 3000);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prev) => ({ ...prev, [name]: files[0] }));
    setFilePreviews((prev) => ({
      ...prev,
      [name]: URL.createObjectURL(files[0]),
    }));
  };

  const uploadContact = async () => {
    if (
      !inputs.address &&
      !inputs.phone &&
      !inputs.email &&
      !files.contactPath &&
      !files.addressPath &&
      !files.phonePath &&
      !files.emailPath
    ) {
      setMsg("⚠️ Please provide at least one field to update.");
      MessageTimeout();
      return;
    }

    const formData = new FormData();
    formData.append("address", inputs.address || "");
    formData.append("phone", inputs.phone || "");
    formData.append("email", inputs.email || "");
    Object.keys(files).forEach((key) => {
      if (files[key]) formData.append(key, files[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:5001/api/contact",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (response.status === 201 || response.status === 200) {
        setMsg("✅ Contact updated successfully!");
        setContactExists(true);
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      setMsg("❌ Failed to update Contact. Please try again.");
    }
    MessageTimeout();
  };

  const handleDeleteContact = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete("http://localhost:5001/api/contact", {
        withCredentials: true,
      });
      setInputs({ address: "", phone: "", email: "" });
      setFilePreviews({
        contactPath: "",
        addressPath: "",
        phonePath: "",
        emailPath: "",
      });
      setContactExists(false);
      setMsg("Contact Deleted");
    } catch (error) {
      console.error("Error deleting contact:", error);
      setMsg("❌ Failed to delete contact.");
    }
    MessageTimeout();
  };

  const handleEmailSubmit = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <h1 className="contact-page-title">Contact Us</h1>

      {msg && <p className="contact-response-message">{msg}</p>}
      <div className="contact-section">
        {/* Left Side - Contact Information */}
        <div className="contact-info-container">
          {filePreviews.contactPath && (
            <img
              src={filePreviews.contactPath}
              alt="Contact Illustration"
              className="contact-info-image"
            />
          )}

          <div className="contact-details-list">
            <div className="contact-detail">
              {filePreviews.addressPath && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    inputs.address
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
              <p className="contact-texts">{inputs.address}</p>
            </div>
            <div className="contact-detail">
              {filePreviews.phonePath && (
                <a
                  href={`https://wa.me/${inputs.phone.replace(/\D/g, "")}`}
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
              <p className="contact-texts">{inputs.phone}</p>
            </div>
            <div className="contact-detail">
              {filePreviews.emailPath && (
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${inputs.email}`}
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
              <p className="contact-texts">{inputs.email}</p>
            </div>

            {userLoggedIn &&
              (contactExists && !isEditing ? (
                <div className="button-group">
                  {!showConfirm && (
                    <>
                      <button
                        className="banner-button"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </button>

                      <button
                        className="banner-button-dlt"
                        onClick={handleDeleteContact}
                      >
                        Delete
                      </button>
                    </>
                  )}

                  {showConfirm && (
                    <div className="confirm-delete-container">
                      <p className="confirmdeletemsg">
                        Are you sure you want to delete this Contact?
                      </p>
                      <div className="button-group">
                        <button
                          onClick={confirmDelete}
                          className="banner-button-dlt"
                        >
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
                      type="file"
                      name="contactPath"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="footer-file-input"
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
                      value={inputs.address}
                      onChange={handleChange}
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
                      value={inputs.phone}
                      onChange={handleChange}
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
                      value={inputs.email}
                      onChange={handleChange}
                      className="footer-text-input"
                    />
                  </div>
                  <div className="button-group">
                    <button
                      className="footer-submit-button"
                      onClick={uploadContact}
                    >
                      {contactExists ? "Save" : "Upload"}
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
          <SocialMedia userLoggedIn={userLoggedIn} />
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="contact-input"
              value={enter.name}
              onChange={handleChangeInput}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="contact-input"
              value={enter.email}
              onChange={handleChangeInput}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Your Phone"
              className="contact-input"
              value={enter.phone}
              onChange={handleChangeInput}
            />
            <textarea
              name="message"
              placeholder="Your Message"
              className="contact-textarea"
              value={enter.message}
              onChange={handleChangeInput}
              required
            />
            <button className="contact-submit-btn" type="submit">
              Send Message
            </button>
          </form>
          {/* {userLoggedIn && (
            <div>
              <input
                type="email"
                placeholder="Email"
                onChange={handleEmailSubmit}
                value={email}
              />
              <button type="submit">Submit</button>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}

export default Contact;
