import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OtpInput from "./OtpInput"; // Import the OTP component
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Import spinner
import { getCurrentUser } from "./tokenUtils";

const OtpForm = () => {
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOtpChange = (value) => {
    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage(""); // Clear any previous messages

    try {
      const user = await getCurrentUser(); // Fetch user details using token utility
      if (user) {
        const response = await axios.post(
          "http://localhost:8080/api/user/verify-otp",
          {
            email: user.email, // Use email from the fetched user
            otp,
          }
        );

        setLoading(false); // Stop loading
        setMessage(response.data.message || "Verification successful!");

        if (response.data.message === "OTP verified successfully.") {
          setTimeout(() => navigate("/change-password"), 100); // Navigate after 1.5s
        }
      }
    } catch (error) {
      setLoading(false); // Stop loading
      setMessage(
        error.response?.data?.message || "Verification failed. Try again."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center space-y-4 bg-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-700">Verify OTP</h2>
        <OtpInput length={6} onChange={handleOtpChange} />
        <button
          type="submit"
          className="mt-4 px-6 py-2 flex items-center justify-center text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none disabled:opacity-50"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#ffffff" size={20} /> : "Verify OTP"}
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
