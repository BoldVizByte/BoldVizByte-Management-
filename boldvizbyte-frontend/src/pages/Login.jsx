import React, { useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Sample accounts data
  const accounts = [
    { id: 1, name: "Manoj", email: "manoj76483@gmail.com", initial: "M" },
  ];

  // ✅ Email validation
  const validateEmail = (email) => {
    const emailRegex =
      /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.com$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    setEmailError("");
    setPasswordError("");

  
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email (example@gmail.com)");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    if (!isValid) return;
    try {
    const res = await API.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token",res.data.token)

    setShowPopup(true);
     setTimeout(() => {
      setShowPopup(false);
      navigate("/dashboard"); 
    }, 1500);

    setEmail("");
    setPassword("");
  }catch (error) {
    if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Server error");
    }
  }
  };

  const handleGoogleLogin = () => {
    setShowAccountModal(true);
  };

  const handleAccountSelect = () => {
    setShowPopup(true);
    setShowAccountModal(false);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleAddAccount = () => {
    alert("Redirecting to Google Sign In...");
  };

  return (
    <div className="login-container">
      <div className="login-page">
        <h1>Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
            }}
          />
          {emailError && (
            <p className="error-text">{emailError}</p>
          )}

          {/* Password Input */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
            <span
              className="password-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {passwordError && (
            <p className="error-text">{passwordError}</p>
          )}


          <button type="submit">Login</button>
        </form>

        <div className="forgot">
          <button
            className="forgot-password"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
        </div>

        <div className="continue">
          <div className="divider">
            <span className="divider-text">or</span>
          </div>
          <button className="continue-google" onClick={handleGoogleLogin}>
            Continue with Google
          </button>
        </div>

        {showPopup && (
          <div className="popup-message">
            Yeah!! Welcome to BoldVizByte
          </div>
        )}
      </div>

      {/* Google Account Modal */}
      {showAccountModal && (
        <div className="account-modal-overlay">
          <div className="account-modal">
            <div className="account-modal-header">
              <h2 className="account-modal-title">Choose an account</h2>
              <button
                className="close-button"
                onClick={() => setShowAccountModal(false)}
              >
                ×
              </button>
            </div>

            <p className="account-modal-subtitle">
              to continue to boldvizbyte
            </p>

            <div className="account-list">
              {accounts.map((account) => (
                <button
                  key={account.id}
                  className="account-item"
                  onClick={handleAccountSelect}
                >
                  <div className="account-avatar">{account.initial}</div>
                  <div className="account-info">
                    <p className="account-name">{account.name}</p>
                    <p className="account-email">{account.email}</p>
                  </div>
                </button>
              ))}

              <button
                className="add-account-button"
                onClick={handleAddAccount}
              >
                <div className="add-icon">+</div>
                <span className="add-account-text">
                  Add another account
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
