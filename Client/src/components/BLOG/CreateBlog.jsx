import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function CreateBlog() {
  const [inputs, setInputs] = useState({ title: "", body: "" });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const requiredWidth = 800;
        const requiredHeight = 400;

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMsg("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("blogTitle", inputs.title);
    formData.append("blogBody", inputs.body);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/blogs",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        setMsg("Blog Created Successfully");
        setTimeout(() => navigate("/"), 2000);
      }
    } catch (error) {
      setMsg("Blog Creation Failed");
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="create-blog-title">Create a New Blog</h1>
      {msg && <p className="msg-text">{msg}</p>}
      <div className="create-blog-container">
        <div className="create-blog-form">
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              name="file"
              className="create-blog-input"
              accept="image/*"
              onChange={handleFileChange}
              required
            />

            <input
              type="text"
              name="title"
              className="create-blog-input"
              placeholder="Title"
              value={inputs.title}
              onChange={handleChange}
              required
            />

            <textarea
              name="body"
              className="create-blog-textarea"
              placeholder="Body"
              value={inputs.body}
              onChange={handleChange}
              required
            />

            <button className="create-blog-button" type="submit">
              Post A Blog
            </button>
            <Link to={`/`}>
              <button className="banner-button-close">Close</button>
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateBlog;
