import React from "react";
import "../style/about.css";

const About = () => {
  return (
      <div className="about-card">
        <h1>About Yugen</h1>
        <p>
          We are three friends from Dehradun who started Yugen Clothing.
        </p>
        <p>
          Our mission is simple: to provide trendy, stylish pieces of wearable to out customers.
        </p>
        <p>
          Follow us on Instagram for the latest drops, behind-the-scenes stories,
          and styling inspiration.
        </p>
        <a
          className="about-link"
          href="https://www.instagram.com/official_yugen_clothing?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noreferrer"
        >
          @official_yugen_clothing
        </a>
      </div>
  );
};

export default About;
