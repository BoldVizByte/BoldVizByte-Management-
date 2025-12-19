import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/magiclink.css";
import { FaEnvelopeOpenText } from "react-icons/fa";
import API from "../api/api";
import { useEffect } from "react";


const MagicLink = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleResendMagicLink = async () => {
    try {
      await API.post("/auth/send-magic-link", { email });
      alert("Magic link sent again to " + email);
    } catch (error) {
      alert("Failed to resend magic link");
    }
  };


  return (
    <div className="magic-overlay">
      <div className="magic-card">
        <div className="magic-header">
          <h2 className="magic-title">Check your email</h2>
          <button
            className="magic-close"
            onClick={() => navigate("/login")}
          >
            ×
          </button>
        </div>

        <div className="magic-icon">
          <FaEnvelopeOpenText />
        </div>

        <p className="magic-text">
          We’ve sent a magic login link to
        </p>

        <p className="magic-email">{email}</p>

        <p className="magic-subtext">
          Click the link in your email to continue resetting your password.
        </p>

        <button
          className="magic-button"
          disabled
        >
          Open the link from your email

        </button>

        <button
          className="magic-resend"
          onClick={handleResendMagicLink}
        >
          Resend link
        </button>
      </div>
    </div>
  );
};

export default MagicLink;
