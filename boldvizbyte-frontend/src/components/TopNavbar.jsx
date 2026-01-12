import React from "react";
import "../styles/topnavbar.css";
import logo from "../bvb.png";

const TopNavbar = () => {
  return (
    <nav className="top-navbar">
      <div className="navbar-left">
        <img src={logo} alt="Company Logo" className="top-navbar-logo" />
        <span className="navbar-brand">Dashboard</span>
      </div>
      
      <div className="navbar-right">
        <div className="user-info">
          <div className="user-avatar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;