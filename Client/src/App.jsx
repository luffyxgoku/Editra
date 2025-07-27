import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/NAVBAR/Navbar";
import Home from "./components/HOME/Home";
import Banner from "./components/BANNER/Banner";
import About from "./components/ABOUT/About";
import Blog from "./components/BLOG/Blog";
import ViewBlog from "./components/BLOG/ViewBlog";
import CreateBlog from "./components/BLOG/CreateBlog";
import EditBlog from "./components/BLOG/EditBlog";
import Signup from "./components/USER/Signup";
import Signin from "./components/USER/Signin";
import Signout from "./components/USER/Signout";
import Contact from "./components/CONTACT/Contact";
import Enquiries from "./components/ENQUIRY/Enquiries";
import Footer from "./components/FOOTER/Footer";

import "./App.css";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    const checkLoginState = () => {
      const storedUser = Cookies.get("userLoggedIn");
      setUserLoggedIn(storedUser === "true");

      const storedName = Cookies.get("userName");
      setUserName(
        storedName && storedName !== "undefined" ? storedName : "Guest"
      );
    };

    checkLoginState();
    window.addEventListener("storage", checkLoginState);

    return () => {
      window.removeEventListener("storage", checkLoginState);
    };
  }, []);

  return (
    <>
      <BrowserRouter>
        <Navbar
          userLoggedIn={userLoggedIn}
          setUserLoggedIn={setUserLoggedIn}
          userName={userName}
        />
        <div className="main-content">
          <Routes>
            <Route
              path="/"
              element={<Home userLoggedIn={userLoggedIn} />}
            ></Route>
            <Route
              path="/banner"
              element={<Banner userLoggedIn={userLoggedIn} />}
            />
            <Route
              path="/about"
              element={<About userLoggedIn={userLoggedIn} />}
            ></Route>
            <Route
              path="/blog"
              element={<Blog userLoggedIn={userLoggedIn} />}
            ></Route>

            <Route
              path="/view/:id"
              element={<ViewBlog userLoggedIn={userLoggedIn} />}
            ></Route>
            <Route path="/write" element={<CreateBlog />}></Route>
            <Route path="/edit/:id" element={<EditBlog />}></Route>
            <Route
              path="/contact"
              element={<Contact userLoggedIn={userLoggedIn} />}
            ></Route>

            <Route
              path="/enquiries"
              element={<Enquiries userLoggedIn={userLoggedIn} />}
            ></Route>

            <Route path="/signup" element={<Signup />}></Route>
            <Route
              path="/signin"
              element={
                <Signin
                  setUserLoggedIn={setUserLoggedIn}
                  setUserName={setUserName}
                />
              }
            ></Route>
            <Route
              path="/signout"
              element={
                <Signout
                  setUserLoggedIn={setUserLoggedIn}
                  setUserName={setUserName}
                />
              }
            />
          </Routes>
        </div>
        <Footer userLoggedIn={userLoggedIn} />
      </BrowserRouter>
    </>
  );
}

export default App;
