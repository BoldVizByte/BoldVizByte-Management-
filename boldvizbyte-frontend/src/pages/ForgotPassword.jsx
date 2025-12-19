import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forgotpassword.css";
import { FaLink, FaMobile } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();

  // ✅ Email validation
  const validateEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.com$/;
    return emailRegex.test(email);
  };

  const handleMagicLink = () => {
  if (!email) {
    setEmailError("Email is required");
    return;
  }

  if (!validateEmail(email)) {
    setEmailError("Please enter a valid email (example@gmail.com)");
    return;
  }

  setEmailError("");

  // ✅ GO TO MAGIC LINK PAGE + PASS EMAIL
  navigate("/magic-link", { state: { email } });
};


  const handleOTP = () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email (example@gmail.com)");
      return;
    }

    setEmailError("");
    navigate("/otp-verification", { state: { email } });
  };

  return (
    <div className="forgot-overlay">
      <div className="forgot-modal">
        <div className="forgot-header">
          <h2 className="forgot-title">Reset Password</h2>
          <button
            className="forgot-close-button"
            onClick={() => navigate("/login")}
          >
            ×
          </button>
        </div>

        <p className="forgot-subtitle">
          Choose your authentication method
        </p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          className="forgot-email-input"
        />

        {/* Inline Email Error */}
        {emailError && (
          <p style={{ color: "#ff6b6b", marginBottom: "15px" }}>
            {emailError}
          </p>
        )}

        <div className="forgot-auth-options">
          <button className="forgot-auth-button" onClick={handleMagicLink}>
            <FaLink /> Magic Link
          </button>

          <button className="forgot-auth-button" onClick={handleOTP}>
            <FaMobile /> OTP Authentication
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
