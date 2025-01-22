import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "./tokenUtils";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState({ label: "Weak", color: "red" });
  const navigate = useNavigate();

  const evaluateStrength = (password) => {
    if (!password) {
      return { label: "", color: "" };
    }
    if (password.length <= 4) {
      return { label: "Weak", color: "red" };
    }
    if (password.length >= 5 && password.length <= 7) {
      return { label: "Strong", color: "orange" };
    }
    if (password.length >= 8) {
      return { label: "Very Strong", color: "green" };
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setStrength(evaluateStrength(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setLoading(false);
      setMessage("Passwords do not match");
      return;
    }

    try {
      const user = await getCurrentUser();
      if (user) {
        const response = await axios.post(
          "http://localhost:8080/api/user/set-password",
          { email: user.email, password, confirmPassword }
        );
        setLoading(false);
        setMessage(response.data.message || "Password updated successfully!");
        if (response.data.message === "Password updated successfully.") {
          setTimeout(() => navigate("/home"), 1000);
        }
      }
    } catch (error) {
      setLoading(false);
      setMessage(
        error.response?.data?.message || "Password update failed. Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Change Your Password
        </h2>
        {/* New Password Input */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="flex mb-2 ml-1 text-gray-700 font-medium"
          >
            New Password
          </label>
          <div
            className={`flex items-center border rounded-lg p-2 ${
              password
                ? `border-${strength.color}-500 focus-within:ring-${strength.color}-300`
                : "border-gray-300"
            }`}
          >
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="flex-grow p-2 outline-none focus:ring-2"
              required
              minLength={1}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-2"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        {/* Confirm Password Input */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="flex mb-2 ml-1 text-gray-700 font-medium"
          >
            Confirm Password
          </label>
          <div className="flex items-center border rounded-lg p-2 border-gray-300">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="flex-grow p-2 outline-none focus:ring-2"
              required
              minLength={1}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-2"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Password Strength Text and Bar */}
        <div className="mt-4 mb-4 flex items-center">
          <span
            className="text-sm font-medium mr-2"
            style={{ color: strength.color }}
          >
            {strength.label}
          </span>
          <div className="relative flex-grow h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="absolute h-full rounded-full"
              style={{
                backgroundColor: strength.color,
                width: `${Math.min((password.length / 8) * 100, 100)}%`,
                transition: "width 0.3s",
              }}
            ></div>
          </div>
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading || password.length < 1 || confirmPassword.length < 1
          }
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg"
        >
          {loading ? <ClipLoader size={20} /> : "Change Password"}
        </button>
        {/* Message */}
        {message && (
          <div
            className={`mt-4 text-center ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ChangePasswordForm;
