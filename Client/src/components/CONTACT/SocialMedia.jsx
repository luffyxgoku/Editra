import React, { useEffect, useState } from "react";
import axios from "axios";

function SocialMedia({ userLoggedIn }) {
  const [msg, setMsg] = useState("");
  const [socialLinks, setSocialLinks] = useState([]);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [newLink, setNewLink] = useState({ file: null, link: "" });

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/socialLinks"
        );
        if (response.data) {
          setSocialLinks(response.data.links);
        }
      } catch (error) {
        console.error("Error fetching Social Links:", error);
      }
    };
    fetchSocialLinks();
  }, []);

  const handleLinkFileChange = (event) => {
    setNewLink({ ...newLink, file: event.target.files[0] });
  };

  const handleLinkChange = (event) => {
    setNewLink({ ...newLink, link: event.target.value });
  };

  const handleAddLink = async () => {
    if (!newLink.file || !newLink.link) {
      setMsg("⚠️ Please provide at least one field to Post.");
      MessageTimeout();
      return;
    }

    const formData = new FormData();
    formData.append("file", newLink.file);
    formData.append("link", newLink.link);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/socialLinks",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setSocialLinks(response.data.socialLinks.links);
      setNewLink({ file: null, link: "" });
      setMsg("✅ Social Link Posted successfully!");
    } catch (error) {
      console.error("Error uploading social link:", error);
      setMsg("❌ Failed to Post Social Link. Please try again.");
    }
    MessageTimeout();
  };

  const handleDeleteLink = async (index) => {
    try {
      const linkId = socialLinks[index]?._id;
      if (!linkId) {
        console.error("Error: No ID found for link at index", index);
        return;
      }

      console.log("Deleting link with ID:", linkId);

      await axios.delete(`http://localhost:5001/api/socialLinks/${linkId}`, {
        withCredentials: true,
      });

      setSocialLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
      setMsg("Social Link Deleted");
    } catch (error) {
      console.error(
        "Error deleting social link:",
        error.response?.data || error
      );
      setMsg("Failed to delete Social Link");
    }
    MessageTimeout();
  };

  const MessageTimeout = () => {
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div>
      {userLoggedIn ? (
        isEditingLink ? (
          <div className="editformcontainer">
            {socialLinks.map((link, index) => (
              <div key={index} className="editformcontainer-details">
                <img
                  src={`http://localhost:5001/${link.filePath}`}
                  alt="Social Link"
                  className="social-icon"
                />
                <input
                  className="footer-text-input"
                  type="text"
                  placeholder="Link URL"
                  value={link.link}
                  readOnly
                />
                <button
                  className="banner-button-dlt"
                  onClick={() => handleDeleteLink(index)}
                >
                  -
                </button>
              </div>
            ))}

            <div className="editformcontainer-details">
              <input
                type="file"
                onChange={handleLinkFileChange}
                className="footer-text-input"
              />
              <input
                type="text"
                placeholder="Enter Link"
                value={newLink.link}
                onChange={handleLinkChange}
                className="footer-text-input"
              />
            </div>

            {msg && <p className="contact-response-message">{msg}</p>}

            <div className="button-group">
              <button onClick={handleAddLink} className="footer-submit-button">
                Save
              </button>
              <button
                onClick={() => setIsEditingLink(false)}
                className="banner-button-close"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="social-links">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`http://localhost:5001/${link.filePath}`}
                    alt="Social Link"
                    className="social-icon"
                  />
                </a>
              ))}
            </div>
            <div className="button-group">
              <button
                className="banner-button"
                onClick={() => setIsEditingLink(true)}
              >
                Add Social Links
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="social-links">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={`http://localhost:5001/${link.filePath}`}
                alt="Social Link"
                className="social-icon"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default SocialMedia;
