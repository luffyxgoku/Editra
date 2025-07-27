import React, { useEffect, useState } from "react";
import axios from "axios";

function Enquiries({ userLoggedIn }) {
  const [enquiries, setEnquiries] = useState([]);
  const [msg, setMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/enquiries",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setEnquiries(response.data.enquiries || []);
        }
        if (!response.data.enquiries) {
          setMsg("No Enquiries so far...");
        }
      } catch (error) {
        console.log(error);
        setMsg("Enquiry Failed!!!");
      }
    };
    fetchEnquiries();
  }, []);

  const handleDeleteEnquiry = (id) => {
    setShowConfirm(true);
  };

  const confirmDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/enquiries/${id}`, {
        withCredentials: true,
      });
      setEnquiries((prevEnquiries) =>
        prevEnquiries.filter((enquiry) => enquiry._id !== id)
      );
      setShowConfirm(false);
    } catch (error) {
      console.error("Error deleting enquiry:", error);
    }
  };

  return (
    <>
      <h1 className="enquiries-heading">All Enquiries ({enquiries.length})</h1>
      {msg && userLoggedIn ? (
        <p className="enquiries-msg">{msg}</p>
      ) : (
        <div className="enquiries-container">
          {enquiries &&
            enquiries.map((enquiry, index) => (
              <div className="enquiries-box" key={index}>
                <div className="enquiry-details-container">
                  <p className="enquiry-name">
                    #{index + 1} &nbsp; Name: {enquiry.name}
                  </p>
                  <p className="enquiry-email">Email: {enquiry.email}</p>
                  <p className="enquiry-phone">Phone: {enquiry.phone} </p>
                </div>
                <div className="enquiry-message-container">
                  <p className="enquiry-message">
                    <strong>Message: </strong>
                    {enquiry.msg}
                  </p>
                </div>
                <div className="button-group">
                  {!showConfirm && (
                    <button
                      className="enquiry-dlt-btn"
                      onClick={() => handleDeleteEnquiry(enquiry._id)}
                    >
                      Delete
                    </button>
                  )}
                  {showConfirm && (
                    <div className="confirm-delete-container">
                      <p>Are you sure you want to delete this Enquiry?</p>
                      <div className="button-group">
                        <button
                          onClick={() => confirmDelete(enquiry._id)}
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
            ))}
        </div>
      )}
    </>
  );
}

export default Enquiries;
