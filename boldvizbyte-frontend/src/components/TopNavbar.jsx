import React from "react";
import "../styles/topnavbar.css";
import logo from "../bvb.png" // make sure the path matches your logo

const TopNavbar = () => {
  return (
    <div className="top-navbar">
      <img src={logo} className="top-navbar-logo" alt="company logo" />
      <p>Welcome, Admin</p>
    </div>
  );
};

export default TopNavbar;
