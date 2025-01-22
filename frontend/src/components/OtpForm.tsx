import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "./OtpInput"; // Import the OTP component
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Import spinner
import { getCurrentUser } from "./tokenUtils";

const OtpForm = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(600); // Timer in seconds (10 minutes)
  const [canResend, setCanResend] = useState(false); // Resend availability
  const navigate = useNavigate();

  useEffect(() => {
    // Start the countdown timer
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true); // Allow resending OTP when timer hits zero
    }
    return () => clearInterval(countdown); // Cleanup on unmount
  }, [timer]);

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const user = await getCurrentUser();
      if (user) {
        const response = await axios.post(
          "http://localhost:8080/api/user/verify-otp",
          {
            email: user.email,
            otp,
          }
        );

        setLoading(false);
        setMessage(response.data.message || "Verification successful!");

        if (response.data.message === "OTP verified successfully.") {
          setTimeout(() => navigate("/change-password"), 100);
        }
      }
    } catch (error) {
      setLoading(false);
      setMessage(
        error.response?.data?.message || "Verification failed. Try again."
      );
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const user = await getCurrentUser();
      if (user) {
        const response = await axios.post(
          "http://localhost:8080/api/user/resend-otp",
          {
            email: user.email,
          }
        );
        setLoading(false);
        setMessage(response.data.message || "OTP resent successfully!");
        setTimer(600); // Reset timer to 10 minutes
        setCanResend(false); // Disable resend until timer expires
      }
    } catch (error) {
      setLoading(false);
      setMessage(
        error.response?.data?.message || "Failed to resend OTP. Try again."
      );
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-700">Verify OTP</h2>
        <OtpInput length={6} onChange={handleOtpChange} />
        <div className="text-sm text-gray-500">
          {timer > 0
            ? `OTP expires in ${formatTime(timer)}`
            : "OTP expired, you can resend now."}
        </div>
        <button
          type="submit"
          className="mt-4 px-6 py-2 flex items-center justify-center text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none disabled:opacity-50"
          disabled={loading || timer === 0}
        >
          {loading ? <ClipLoader color="#ffffff" size={20} /> : "Verify OTP"}
        </button>
        <button
          type="button"
          onClick={handleResendOtp}
          className="mt-2 px-4 py-2 text-indigo-500 hover:text-indigo-600 focus:outline-none"
          disabled={!canResend}
        >
          Resend OTP
        </button>
        {message && (
          <p
            className={`mt-2 text-center ${
              message.includes("successful") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default OtpForm;
