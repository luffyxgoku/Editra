import React, { useEffect, useState } from "react";
import axios from "axios";

function FooterColumnTwo({ userLoggedIn }) {
  const [columnTwo, setColumnTwo] = useState({ heading: "", links: [] });
  const [footerTwoExists, setFooterTwoExists] = useState(false);
  const [isEditingColumnTwo, setIsEditingColumnTwo] = useState(false);
  const [msg, setMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchFooterTwo = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/footerTwo");
        if (response.data) {
          setColumnTwo({
            heading: response.data.heading || "",
            links: response.data.links || [],
          });
          setFooterTwoExists(true);
        }
      } catch (error) {
        console.error("Error fetching footer column two:", error);
        setMsg("No footer column two found. You can upload a new one.");
        setFooterTwoExists(false);
        setTimeout(() => setMsg(""), 3000);
      }
    };
    fetchFooterTwo();
  }, []);

  const handleColumnTwoChange = (e) => {
    setColumnTwo({ ...columnTwo, heading: e.target.value });
  };

  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...columnTwo.links];
    updatedLinks[index][field] = value;
    setColumnTwo({ ...columnTwo, links: updatedLinks });
  };

  const handleAddLink = () => {
    setColumnTwo({
      ...columnTwo,
      links: [...columnTwo.links, { name: "", url: "" }],
    });
  };

  const handleRemoveLink = (index) => {
    setColumnTwo((prevState) => {
      const updatedLinks = prevState.links.filter((_, i) => i !== index);
      return { ...prevState, links: updatedLinks };
    });
  };

  const MessageTimeout = () => {
    setTimeout(() => setMsg(""), 3000);
  };

  const uploadFooterTwo = async () => {
    try {
      const updatedFooterData = {
        heading: columnTwo.heading,
        links: columnTwo.links.filter((link) => link.name && link.url),
      };
      await axios.post(
        "http://localhost:5001/api/footerTwo",
        updatedFooterData,
        {
          withCredentials: true,
        }
      );
      setIsEditingColumnTwo(false);
      setMsg("✅ Footer Column Two updated successfully!");
      setFooterTwoExists(true);
    } catch (error) {
      console.error("Error updating Footer Column Two:", error);
      setMsg("❌ Failed to update Footer Column Two.");
    }
    MessageTimeout();
  };

  const handleDeleteFooterTwo = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete("http://localhost:5001/api/footerTwo", {
        withCredentials: true,
      });
      setColumnTwo({ heading: "", links: [] });
      setFooterTwoExists(false);
      setMsg("✅ Footer Column Two Deleted");
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting Footer Column Two:", error);
      setMsg("❌ Failed to delete Footer Column Two.");
    }
    MessageTimeout();
  };

  return (
    <div className="footer-column">
      {msg && <p className="msg-text">{msg}</p>}

      <h3 className="footer-heading">{columnTwo.heading}</h3>
      <ul className="footer-links">
        {columnTwo.links.map((link, index) => (
          <li key={index} className="footer-link-item">
            <a href={link.url} className="footer-link">
              {link.name}
            </a>
          </li>
        ))}
      </ul>
      {userLoggedIn &&
        (footerTwoExists && !isEditingColumnTwo ? (
          <div className="button-group">
            {!showConfirm && (
              <>
                <button
                  className="banner-button"
                  onClick={() => setIsEditingColumnTwo(true)}
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteFooterTwo}
                  className="banner-button-dlt"
                >
                  Delete
                </button>
              </>
            )}
            {showConfirm && (
              <div className="confirm-delete-container">
                <p className="confirmdeletemsg">
                  Are you sure you want to delete this Footer 2?
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
                placeholder="Enter Heading"
                value={columnTwo.heading}
                onChange={handleColumnTwoChange}
                className="footer-text-input"
              />
            </div>

            {columnTwo.links.map((link, index) => (
              <div key={index} className="editformcontainer-details">
                <input
                  className="footer-text-input"
                  type="text"
                  placeholder="Link Name"
                  value={link.name}
                  onChange={(e) =>
                    handleLinkChange(index, "name", e.target.value)
                  }
                />
                <input
                  className="footer-text-input"
                  type="text"
                  placeholder="URL"
                  value={link.url}
                  onChange={(e) =>
                    handleLinkChange(index, "url", e.target.value)
                  }
                />
                <button
                  className="banner-button-dlt"
                  onClick={() => handleRemoveLink(index)}
                >
                  -
                </button>
              </div>
            ))}
            <div className="button-group">
              <button onClick={handleAddLink} className="footer-submit-button">
                +
              </button>
              <button
                onClick={uploadFooterTwo}
                className="footer-submit-button"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingColumnTwo(false)}
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

export default FooterColumnTwo;
