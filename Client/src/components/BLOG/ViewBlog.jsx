import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

function ViewBlog({ userLoggedIn }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/blogs/${id}`,
          { withCredentials: true }
        );

        if (!response.data.blog) {
          setMsg("Blog not found");
        } else {
          setBlog(response.data.blog);
        }
      } catch (error) {
        setMsg("Server Error: Failed to load Blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/blogs/${id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setBlog(null);
        setMsg("Blog deleted successfully!");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        alert(
          "Not Found: Blog does not exist or you do not have permission to delete it"
        );
      } else {
        alert("Server error: Unable to delete the blog");
      }
    }
  };

  return (
    <div className="viewblog-container">
      {loading ? (
        <p className="viewblog-loading">Loading Blog...</p>
      ) : msg ? (
        <p className="viewblog-msg">{msg}</p>
      ) : (
        blog && (
          <>
            <h1 className="viewblog-heading">Viewing {blog.blogTitle} Blog!</h1>
            <div className="viewblog-content">
              <div className="viewblog-image-container">
                <img
                  className="viewblog-image"
                  src={`http://localhost:5001${blog.blogImageLink}`}
                  alt={blog.blogTitle}
                />
              </div>
              <h2 className="viewblog-title">{blog.blogTitle}</h2>
              <p className="viewblog-body">{blog.blogBody}</p>
              {userLoggedIn && (
                <>
                  <div className="viewblog-btn-container">
                    {!showConfirmDelete && (
                      <>
                        <Link to={`/edit/${blog._id}`}>
                          <button className="viewblog-edit-btn">Edit</button>
                        </Link>
                        <button
                          className="viewblog-delete-btn"
                          onClick={() => setShowConfirmDelete(true)}
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {showConfirmDelete && (
                      <div className="confirm-delete-container">
                        <p className="confirmdeletemsg">
                          Are you sure you want to delete this Blog?
                        </p>
                        <div className="button-group">
                          <button
                            onClick={() => handleDelete(blog._id)}
                            className="banner-button-dlt"
                          >
                            Yes, Delete
                          </button>
                          <button
                            onClick={() => setShowConfirmDelete(false)}
                            className="banner-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}

export default ViewBlog;
