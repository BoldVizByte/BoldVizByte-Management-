import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/otpverification.css";
import API from "../api/api";


const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

 
  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  // ⏱ OTP Timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOTP = async() => {
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
    const res = await API.post("/auth/verify-otp", {
      email,
      otp,
    });
    const resetToken = res.data.resetToken;
    navigate("/reset-password", {
      state: {
        email,
        resetToken,
      },
    });
  } catch (error) {
    if (error.response) {
      setError(error.response.data.message);
    } else {
      setError("Server error");
    }
  }
  };

  const handleResendOTP = async () => {
  try {
    await API.post("/auth/send-otp", { email });

    setTimer(60);
    setOtp("");
    setError("");

    alert("New OTP sent to " + email);
  } catch (error) {
    alert("Failed to resend OTP");
  }
};


  return (
    <div className="otp-overlay">
      <div className="otp-card">
        <div className="otp-header">
          <h2 className="otp-title">OTP Verification</h2>
          <button className="otp-close" onClick={() => navigate("/login")}>
            ×
          </button>
        </div>

        {error && <p className="otp-error">{error}</p>}

        <p className="otp-subtitle">
          Enter the 6-digit OTP sent to <b>{email}</b>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          maxLength={6}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="otp-input"
        />

        {timer > 0 ? (
          <p className="otp-timer">
            OTP expires in <b>{timer}s</b>
          </p>
        ) : (
          <button className="otp-resend" onClick={handleResendOTP}>
            Resend OTP
          </button>
        )}

        <button className="otp-button" onClick={handleVerifyOTP} disabled={timer === 0}>
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
