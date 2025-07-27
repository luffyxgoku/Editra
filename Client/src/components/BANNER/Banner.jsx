import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Banner({ userLoggedIn }) {
  const [images, setImages] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [heading, setHeading] = useState("");
  const [tagline, setTagline] = useState("");
  const [tag, setTag] = useState("");
  const [head, setHead] = useState("");
  const [msg, setMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchImages();
    FetchBannerEditText();
  }, []);

  useEffect(() => {
    if (images.length > 0 && !isHovered) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [images, isHovered]);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        setMsg("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const requiredWidth = window.innerWidth * 0.9;
        const requiredHeight = 30 * 16;

        if (img.width < requiredWidth || img.height < requiredHeight) {
          setMsg(
            `Image must be at least ${Math.round(
              requiredWidth
            )}x${requiredHeight} pixels.`
          );
        } else {
          setSelectedFile(file);
          setMsg("");
        }
      };
    }
  };

  const handleHeadingChange = (event) => {
    setHeading(event.target.value);
  };

  const handleTaglineChange = (event) => {
    setTagline(event.target.value);
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/banners");
      const newImages = response.data.map(
        (path) => `http://localhost:5001${path}`
      );
      setImages(newImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMsg("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/upload/banner",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const newImage = `http://localhost:5001${response.data.filePath}`;
      setImages((prevImages) => [...prevImages, newImage]);
      setMsg("Banner uploaded successfully!");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error uploading banner:", error);
      setMsg("Failed to upload banner.");
    }
  };

  const enableEditing = () => {
    setIsEditing(true);
    setHeading(head);
    setTagline(tag);
  };

  const handleBannerEditText = async (event) => {
    event.preventDefault();
    if (!heading || !tagline) {
      setMsg("Heading and tagline cannot be empty!");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5001/api/bannerContent",
        { heading, tagline },
        { withCredentials: true }
      );
      setMsg("Banner content updated successfully!");
      FetchBannerEditText();
    } catch (error) {
      console.error("Error updating banner content:", error);
      setMsg("Failed to update banner content.");
    } finally {
      setIsEditing(false);
    }
  };

  const FetchBannerEditText = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5001/api/bannerContent"
      );
      if (response.data) {
        setHead(response.data.heading || "Default Heading");
        setTag(response.data.tagline || "Default Tagline");
      }
    } catch (error) {
      console.error("Error fetching banner content:", error);
    }
    setIsEditing(false);
  };

  const handleDeleteBanner = async () => {
    if (images.length === 0) {
      setMsg("No banner image to delete.");
      return;
    }

    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (images.length === 0) return;

    const imageToDelete = images[currIndex].replace(
      "http://localhost:5001",
      ""
    );

    try {
      await axios.delete(`http://localhost:5001/api/delete/banner`, {
        data: { filePath: imageToDelete },
        withCredentials: true,
      });

      setMsg("Banner deleted successfully!");
      setShowConfirm(false);

      const updatedImages = images.filter((_, index) => index !== currIndex);
      setImages(updatedImages);
      setCurrIndex(0);
    } catch (error) {
      console.error("Error deleting banner:", error);
      setMsg("Failed to delete banner.");
    }
  };

  return (
    <>
      {msg && <p className="message">{msg}</p>}
      {userLoggedIn && (
        <div
          className="banner-upload-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {!showConfirm && (
            <>
              <input
                type="file"
                onChange={handleFileChange}
                className="banner-file-input"
              />
              <div className="button-group">
                <button onClick={handleUpload} className="banner-button">
                  Upload
                </button>

                <button
                  onClick={handleDeleteBanner}
                  className="banner-button-dlt"
                >
                  Delete
                </button>
                <button onClick={enableEditing} className="banner-button">
                  {head || tag ? "Edit" : "Add"}
                </button>
              </div>
            </>
          )}

          {showConfirm && (
            <div className="confirm-delete-container">
              <p className="confirmdeletemsg">
                Are you sure you want to delete this Banner Image?
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

          {isEditing && (
            <div className="banner-text-edit-container">
              <form onSubmit={handleBannerEditText} className="banner-form">
                <input
                  type="text"
                  placeholder="Heading"
                  onChange={handleHeadingChange}
                  value={heading}
                  className="file-input"
                />
                <input
                  type="text"
                  placeholder="Tagline"
                  onChange={handleTaglineChange}
                  value={tagline}
                  className="file-input"
                />
                <div className="button-group">
                  <button className="banner-button">Submit</button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="banner-button-close"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      <div className="banner-container">
        <h1 className="banner-text">{head || "Heading"}</h1>
        <p className="banner-text tagline">{tag || "Tagline"}</p>

        <AnimatePresence custom={direction} mode="popLayout">
          {images.length > 0 && (
            <motion.img
              key={currIndex}
              src={images[currIndex]}
              alt="banner"
              className="banner-img"
              initial={{ x: direction * 100 + "%" }}
              animate={{ x: "0%" }}
              exit={{ x: -direction * 100 + "%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
