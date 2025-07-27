import React, { useEffect, useState } from "react";
import axios from "axios";
import FooterColumnOne from "./FooterColumn1";
import FooterColumnTwo from "./FooterColumn2";
import FooterColumnThree from "./FooterColumn3";

function Footer({ userLoggedIn }) {
  const [heading, setHeading] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isExist, setIsExist] = useState(false);

  useEffect(() => {
    const fetchHeading = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/headings");
        if (response.data.success && response.data.data?.copyrightHeading) {
          setHeading(response.data.data.copyrightHeading || "");
          setIsExist(true);
        } else {
          setHeading("");
          setIsExist(false);
        }
      } catch (error) {
        console.error("Error fetching heading:", error);
      }
    };
    fetchHeading();
  }, []);

  const handleChange = (e) => {
    setHeading(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/headings", {
        field: "copyrightHeading",
        value: heading,
      });
      if (response.data.success) {
        setHeading(response.data.data.copyrightHeading || "");
        setIsEditing(false);
        setIsExist(!!response.data.data.copyrightHeading);
      }
    } catch (error) {
      console.error("Error updating heading:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/headings/copyrightHeading`
      );
      if (response.data.success) {
        setHeading("");
        setIsExist(false);
      }
    } catch (error) {
      console.error("Error deleting heading:", error);
    }
  };

  return (
    <>
      <footer className="footer">
        <FooterColumnOne userLoggedIn={userLoggedIn} />
        <FooterColumnTwo userLoggedIn={userLoggedIn} />
        <FooterColumnThree userLoggedIn={userLoggedIn} />
      </footer>

      <div className="footer-copyright">
        {isEditing ? (
          <input
            type="text"
            value={heading}
            onChange={handleChange}
            className="banner-file-input"
          />
        ) : (
          <p style={{ fontSize: "1.2rem" }}>
            &copy; {heading || "No copyright heading set."}
          </p>
        )}

        {userLoggedIn && (
          <>
            {isEditing ? (
              <div className="button-group">
                <button className="banner-button" onClick={handleSubmit}>
                  Submit
                </button>
                <button
                  className="banner-button-close"
                  onClick={() => setIsEditing(false)}
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="button-group">
                <button
                  className="banner-button"
                  onClick={() => setIsEditing(true)}
                >
                  {isExist ? "Edit" : "Add"}
                </button>
                {isExist && (
                  <button className="banner-button-dlt" onClick={handleDelete}>
                    Delete
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Footer;

{
  /* <p className="footer-copyright">
        &copy; 2025 Sami Corporation. All rights reserved.
      </p> */
}
