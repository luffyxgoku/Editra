import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/blogs", {
          withCredentials: true,
        });

        if (response.data.blogs.length === 0) {
          setError("No blogs found!");
        } else {
          setBlogs(response.data.blogs);
        }
      } catch (error) {
        setError("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getVisibleBlogs = () => {
    if (blogs.length < 3) return blogs;
    let visibleBlogs = [];
    if (window.innerWidth <= 1024) {
      for (let i = 0; i < 1; i++) {
        visibleBlogs.push(blogs[(startIndex + i) % blogs.length]);
      }
    } else {
      for (let i = 0; i < 3; i++) {
        visibleBlogs.push(blogs[(startIndex + i) % blogs.length]);
      }
    }
    return visibleBlogs;
  };

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setStartIndex((prevIndex) => (prevIndex + 1) % blogs.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [blogs, isHovered]);

  const handlePrev = () => {
    setStartIndex((prevIndex) =>
      prevIndex - 1 < 0 ? blogs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % blogs.length);
  };

  return (
    <>
      <div id="blog-section" className="container">
        <h1 className="about-heading">Latest Blogs</h1>

        {loading && <p className="loading">Loading Blogs...</p>}
        {error && <p className="error">{error}</p>}

        <div className="carousel">
          <div className="blog-card-container">
            <button className="carousel-btn left" onClick={handlePrev}>
              &#10094;
            </button>
            {getVisibleBlogs().map((blog) => (
              <div
                key={blog._id}
                className="singleblog-card"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="blog-img-container">
                  <img
                    src={`http://localhost:5001${blog.blogImageLink}`}
                    alt={blog.blogTitle}
                  />
                </div>
                <div className="blog-content">
                  <h2>
                    {blog.blogTitle.length > 15
                      ? blog.blogTitle.substr(0, 40) + "..."
                      : blog.blogTitle}
                  </h2>
                </div>
                <Link to={`/view/${blog._id}`}>
                  <button className="blog-view-btn">View</button>
                </Link>
              </div>
            ))}
            <button className="carousel-btn right" onClick={handleNext}>
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
