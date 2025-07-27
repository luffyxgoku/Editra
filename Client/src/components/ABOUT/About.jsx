import React from "react";
import ReuseAboutOne from "./ReuseAboutOne";
import ReuseAboutTwo from "./ReuseAboutTwo";

function About({ userLoggedIn }) {
  return (
    <>
      <h1 className="about-heading">About Us</h1>

      <ReuseAboutOne sectionId="1" userLoggedIn={userLoggedIn} />
      <ReuseAboutTwo sectionId="2" userLoggedIn={userLoggedIn} />
      <ReuseAboutOne sectionId="3" userLoggedIn={userLoggedIn} />
      <ReuseAboutTwo sectionId="4" userLoggedIn={userLoggedIn} />
    </>
  );
}

export default About;
