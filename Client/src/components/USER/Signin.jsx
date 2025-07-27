import axios from "axios";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";

function Signin({ setUserLoggedIn, setUserName }) {
  const [inputs, setInputs] = useState({ email: "", password: "" });
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
        "http://localhost:5001/api/users/signin",
        {
          email: inputs.email,
          password: inputs.password,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        Cookies.set("userLoggedIn", "true", { expires: 1 });
        setUserLoggedIn(true);

        const userName = response.data.user.name;
        Cookies.set("userName", userName);
        setUserName(userName);

        setTimeout(() => {
          navigate("/");
        }, 1000);
        setMsg("Signin Successful");
      }
    } catch (error) {
      setMsg("Signin Failed");
      console.log(error);
    }
  };

  return (
    <>
      <h1 className="signin-title">Sign In</h1>
      <div className="signin-container">
        <div className="signin-form">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              className="signin-input"
              placeholder="Email"
              value={inputs.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              className="signin-input"
              placeholder="Password"
              value={inputs.password}
              onChange={handleChange}
            />
            <button className="signin-button" type="submit">
              Signin
            </button>
            <p className="register-text">
              Don't have an account?
              <button
                className="register-btn"
                onClick={() => navigate("/signup")}
              >
                Register
              </button>
            </p>
            <Link to={`/`}>
              <button className="banner-button-close">Close</button>
            </Link>
          </form>
        </div>
        {msg && <p className="signup-message">{msg}</p>}
      </div>
    </>
  );
}

export default Signin;
