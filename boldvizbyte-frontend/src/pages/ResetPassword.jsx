import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../api/api";
import "../styles/resetpassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");


  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken;
  const email = location.state?.email;


  useEffect(() => {
    if (!location.state?.resetToken) {
      navigate("/login");
    }
  }, [location, navigate]);

  const getPasswordStrength = () => {
    if (!password) return "";

    
    if (password.length < 8) return "Invalid";

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*?&#^(){}[\]/.,]/.test(password);
    const onlyNumbers = /^[0-9]+$/.test(password);
    const repeatedChars = /^(\d)\1+$/.test(password);

    const emailName = email?.split("@")[0]?.toLowerCase();
    const isEmailBased = emailName && password.toLowerCase().includes(emailName);

    // 🔴 Weak rules
    if (
      onlyNumbers ||
      repeatedChars ||
      isEmailBased
    ) {
      return "Weak";
    }

    // 🟢 Strong rules
    if (hasLetter && hasNumber && hasSpecial) {
      return "Strong";
    }

    // 🟡 Medium rules
    if (hasLetter && hasNumber) {
      return "Medium";
    }

    return "Weak";
  };

  const handleSavePassword = async () => {
    setError("");
    setSuccess("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }


    if (!password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
    await API.post("/auth/reset-password", {
      token: resetToken,
      password,
    });

    setSuccess("Your password has been reset successfully.");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
    } catch (error) {
    if (error.response) {
      setError(error.response.data.message);
    } else {
      setError("Server error");
    }
  }

  };

  return (
    <div className="reset-overlay">
      <div className="reset-card">
        <div className="reset-header">
          <h2 className="reset-title">Reset Password</h2>
          <button className="reset-close" onClick={() => navigate("/login")} >
            × </button>
        </div>
        {error && <p className="reset-error">{error}</p>}
        {success && (
          <p className="reset-success">
            {success}
          </p>
        )}
        <p className="reset-subtitle"> Create a new password for <b>{email}</b> </p>
        {/* New Password */}
        <div className="reset-input-wrapper">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="reset-input"
          />
          <span
            className="reset-eye"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {password && password.length >= 8 && (
          <p className={`reset-strength ${getPasswordStrength().toLowerCase()}`}>
            Strength: {getPasswordStrength()}
          </p>
        )}

        <div className="reset-input-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="reset-input"
          />
          <span
            className="reset-eye"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="reset-button" onClick={handleSavePassword}> Save Password </button>
      </div>
    </div >
  );
}
export default ResetPassword;
