import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Signout({ setUserLoggedIn, setUserName }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSignout = async () => {
      try {
        await axios.post(
          "http://localhost:5001/api/users/signout",
          {},
          { withCredentials: true }
        );
        Cookies.remove("userLoggedIn");
        setUserLoggedIn(false);

        Cookies.remove("userName");
        setUserName("");

        navigate("/signin");
      } catch (error) {
        console.error("Signout failed:", error);
      }
    };

    handleSignout();
  }, [navigate, setUserLoggedIn]);

  return <h2>Signing out...</h2>;
}

export default Signout;
