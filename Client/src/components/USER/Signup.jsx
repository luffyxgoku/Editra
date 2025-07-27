import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [inputs, setInputs] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/users/register",
        { name: inputs.name, email: inputs.email, password: inputs.password },
        { withCredentials: true }
      );

      if (response.status === 201) {
        Cookies.set("userName", inputs.name);
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
        setMsg("Register Successful");
      }
    } catch (error) {
      setMsg("Register Failed");
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="signup-title">Signup</h1>
      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={inputs.email}
            onChange={handleChange}
            className="signup-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            className="signup-input"
          />
          <button type="submit" className="signup-button">
            Register
          </button>
          <p className="register-text">
            Already have an account?
            <button
              className="register-btn"
              onClick={() => navigate("/signin")}
            >
              Sign in
            </button>
          </p>
          <Link to={`/`}>
            <button className="banner-button-close">Close</button>
          </Link>
        </form>
        {msg && <p className="signup-message">{msg}</p>}
      </div>
    </>
  );
}

export default Signup;
