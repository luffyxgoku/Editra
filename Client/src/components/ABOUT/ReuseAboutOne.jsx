import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function ReuseAboutOne({ userLoggedIn, sectionId }) {
  const [isvisible, setIsVisible] = useState(false);
  const aboutRef = useRef(null);
  const [images, setImages] = useState("");
  const [file, setFile] = useState(null);
  const [sectionData, setSectionData] = useState({
    heading: "",
    paragraph: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [msg, setMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchImages();
    fetchAboutSectionContent();
  }, [sectionId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (aboutRef.current) {
      observer.observe(aboutRef.current);
    }
    return () => {
      if (aboutRef.current) {
        observer.unobserve(aboutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const requiredWidth = 547;
        const requiredHeight = 320;

        if (img.width < requiredWidth || img.height < requiredHeight) {
          setMsg(
            `Image must be at least ${Math.round(
              requiredWidth
            )}x${requiredHeight} pixels.`
          );
        } else {
          setFile(e.target.files[0]);
          setMsg("");
        }
      };
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/about/${sectionId}`
      );
      if (response.data.filePath) {
        setImages(`http://localhost:5001${response.data.filePath}`);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleImageUpload = async () => {
    if (!file) {
      setMsg("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("sectionId", sectionId);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/upload/about",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImages(`http://localhost:5001${response.data.filePath}`);
      setMsg("About Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setMsg("Failed to upload About Image.");
    }
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  const fetchAboutSectionContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/aboutContent/${sectionId}`
      );
      if (response.data) {
        setSectionData({
          heading: response.data.heading || "",
          paragraph: response.data.paragraph || "",
        });
      }
    } catch (error) {
      console.error("Error fetching About Content data:", error);
    }
    setIsEditing(false);
  };

  const handleAboutContentUpdate = async () => {
    if (!sectionData.heading || !sectionData.paragraph) {
      setMsg("Please enter heading and paragraph.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/aboutContent",
        {
          sectionId,
          heading: sectionData.heading,
          paragraph: sectionData.paragraph,
        },
        { withCredentials: true }
      );
      setSectionData(response.data.section);
      setMsg("About Content updated successfully!");
    } catch (error) {
      console.error("Error updating section:", error);
      setMsg("Failed to update About Content .");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteImage = async () => {
    if (images.length === 0) {
      setMsg("No banner image to delete.");
      return;
    }

    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/upload/about/${sectionId}`
      );

      setImages("");
      setMsg(response.data.message ?? "File deleted successfully!"); // Ensure message is set properly
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting image:", error);
      setMsg(error.response?.data?.message || "Failed to delete the image.");
    }
  };

  return (
    <>
      {msg && <p className="message">{msg}</p>}

      <div ref={aboutRef} className="about-container">
        {userLoggedIn && (
          <div className="banner-upload-container">
            <input
              type="file"
              onChange={handleFileChange}
              className="banner-file-input"
            />
            <div className="button-group">
              {!showConfirm && (
                <>
                  <button onClick={handleImageUpload} className="banner-button">
                    Upload
                  </button>
                  {images && !showConfirm && (
                    <button
                      onClick={handleDeleteImage}
                      className="banner-button-dlt"
                    >
                      Delete
                    </button>
                  )}
                  <button onClick={enableEditing} className="banner-button">
                    {sectionData.heading || sectionData.paragraph
                      ? "Edit"
                      : "Add "}
                  </button>
                </>
              )}
              {showConfirm && (
                <div className="confirm-delete-container">
                  <p className="confirmdeletemsg">
                    Are you sure you want to delete this About Image?
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
          </div>
        )}
        {isEditing && (
          <div className="editformcontainer">
            <input
              type="text"
              value={sectionData.heading}
              onChange={(e) =>
                setSectionData({ ...sectionData, heading: e.target.value })
              }
              placeholder="Heading"
              className="file-input"
            />
            <input
              value={sectionData.paragraph}
              onChange={(e) =>
                setSectionData({ ...sectionData, paragraph: e.target.value })
              }
              placeholder="Paragraph"
              className="file-input"
            />
            <div className="button-group">
              <button
                onClick={handleAboutContentUpdate}
                className="banner-button"
              >
                Submit
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

        {images && (
          <img
            src={images}
            alt="image"
            className={`about-img ${isvisible ? "visible" : ""}`}
          />
        )}

        <div className="about-right-container">
          <h1 className="about-right-title">{sectionData.heading}</h1>
          <p className="about-right-body">{sectionData.paragraph}</p>
        </div>
      </div>
    </>
  );
}

export default ReuseAboutOne;
