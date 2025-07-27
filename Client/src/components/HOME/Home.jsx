import React from "react";
import Banner from "../BANNER/Banner";
import About from "../ABOUT/About";
import Blog from "../BLOG/Blog";

function Home({ userLoggedIn }) {
  return (
    <div>
      <Banner userLoggedIn={userLoggedIn} />
      <About userLoggedIn={userLoggedIn} />
      <Blog userLoggedIn={userLoggedIn} />
    </div>
  );
}

export default Home;
