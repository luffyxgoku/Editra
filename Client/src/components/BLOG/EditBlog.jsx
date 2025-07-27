import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    blogTitle: "",
    blogBody: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/blogs/${id}`,
          { withCredentials: true }
        );
        if (response.data.blog)
          setInputs({
            blogTitle: response.data.blog.blogTitle,
            blogBody: response.data.blog.blogBody,
          });
      } catch (msg) {
        setMsg("Failed to load blog details.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleEdit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("blogTitle", inputs.blogTitle);
    formData.append("blogBody", inputs.blogBody);
    if (file) formData.append("file", file);

    try {
      const response = await axios.put(
        `http://localhost:5001/api/blogs/${id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMsg("Blog Updated Successfully");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (msg) {
      if (msg.response?.status === 403) {
        setMsg("You do not have permission to edit this blog.");
      } else {
        setMsg("Failed to update the blog.");
      }
      setMsg("Failed to update the blog.");
    }
  };

  return (
    <>
      <h1 className="edit-blog-title">Edit Blog</h1>
      <div className="edit-blog-container">
        {loading && <p className="loading-text">Loading...</p>}
        {msg && <p className="msg-text">{msg}</p>}
        {!loading && (
          <form className="edit-blog-form" onSubmit={handleEdit}>
            <input
              type="text"
              name="blogTitle"
              value={inputs.blogTitle}
              onChange={handleChange}
              placeholder="Blog Title"
              required
              className="edit-blog-input"
            />
            <input
              type="file"
              name="blogImageLink"
              onChange={handleFileChange}
              accept="image/*"
              required
              className="edit-blog-input"
            />
            <textarea
              name="blogBody"
              value={inputs.blogBody}
              onChange={handleChange}
              placeholder="Blog Content"
              required
              className="edit-blog-textarea"
            />
            <button type="submit" className="edit-blog-button">
              Update Blog
            </button>
            <Link to={`/`}>
              <button className="banner-button-close">Close</button>
            </Link>
          </form>
        )}
      </div>
    </>
  );
}

export default EditBlog;
