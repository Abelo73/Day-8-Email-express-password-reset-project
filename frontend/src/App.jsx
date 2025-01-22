import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import OtpForm from "./components/OtpForm";
import PasswordReset from "./components/PasswordReset";
import Register from "./components/Register";
import Home from "./components/Home";
import ChangePasswordForm from "./components/ChangePasswordForm";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route path="/otp-form" element={<OtpForm />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/change-password" element={<ChangePasswordForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
