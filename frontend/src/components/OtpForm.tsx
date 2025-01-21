import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OtpForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const otpValue = otp.join("");
      const response = await axios.post(
        "http://localhost:8080/api/user/verify-otp",
        {
          email: localStorage.getItem("emailForOtp"), // Assuming email is stored in localStorage
          otp: otpValue,
          newPassword: "yourNewPassword", // You would replace this with a form state to capture the password input
        }
      );
      setMessage(response.data.message);

      // Navigate to the next page after successful OTP verification
      navigate("/your-next-page-path"); // Change this to your next route
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to verify OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Enter OTP
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 flex justify-center items-center"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              maxLength={1}
              className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoComplete="off"
              required
            />
          ))}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 mt-4"
          >
            Verify OTP
          </button>
        </form>
        {message && (
          <div className="mt-4">
            <p
              className={`text-center ${
                message.includes("success") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpForm;
