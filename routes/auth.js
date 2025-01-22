const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail");
const { comparePassword, hashPassword } = require("../utils/passwordHelper");
const { generateToken } = require("../utils/authHelper");
const crypto = require("crypto");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User fetched successfully", data: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Registration route
router.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({ email, password: hashedPassword, name });
    console.log("USER:", newUser);
    await newUser.save();

    await sendEmail({
      to: newUser.email,
      subject: `Registration Confirmation`,
      text: `Dear ${newUser.name}, your registration successfully with email ${newUser.email}. thanks for using our system.`,
    });

    console.log(`Password reset OTP sent to ${newUser.email}`);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    console.error("Error in registration route", error);
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: `User not found with email ${email}` });
    }

    // Compare provided password with stored hashed password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);
    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
    console.error("Error in login route", error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: `User not found with id ${id}` });
    }
    res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    console.log("Error while fetching user by id");
    res.status(500).json({ message: "Server error ", error });
  }
});

// // Password reset request route
// router.post("/reset-password", async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: `User with email ${email} does not exist` });
//     }

//     // Send reset OTP via email

//     const otp = Math.floor(100000 + Math.random() * 900000); //generate 6-digit OTP
//     const otpExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

//     user.resetOtp = otp;
//     user.resetOtpExpires = otpExpires;
//     await user.save();

//     await sendEmail({
//       to: user.email,
//       subject: "Password Reset OTP",
//       text: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`,
//     });

//     console.log(`Password reset OTP sent to ${user.email}`);
//     res.status(200).json({ message: `Password reset OTP sent to ${email}` });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error sending password reset email",
//       error: error.message,
//     });
//     console.error("Error in reset-password route", error);
//   }
// });

// router.post("/verify-otp", async (req, res) => {
//   const { email, otp, newPassword } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Convert both to strings to ensure a proper comparison
//     const storedOtp = user.resetOtp.toString();
//     const receivedOtp = otp.toString();

//     // Check if the OTP matches and is not expired
//     if (storedOtp !== receivedOtp || user.resetOtpExpires < Date.now()) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     // Hash the new password and update the user record
//     user.password = await hashPassword(newPassword);
//     user.resetOtp = undefined; // Clear the OTP
//     user.resetOtpExpires = undefined; // Clear the expiration
//     await user.save();

//     res.status(200).json({ message: "Password reset successful" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error verifying OTP", error: error.message });
//   }
// });

// router.delete("/delete/:id", async (req, res) => {
//   const id = req.params.id;

//   try {
//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error deleting user", error: error.message });
//   }
// });

// NEW START

// Send OTP route
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP and expiration
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP to user
    user.resetOtp = otp;
    user.resetOtpExpires = otpExpires;
    await user.save();

    // Send email with OTP
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
});

// Verify OTP route
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP is correct and not expired
    if (
      user.resetOtp.toString() !== otp.toString() ||
      user.resetOtpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP verified successfully
    user.resetOtp = undefined; // Clear OTP
    user.resetOtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
});

// Set new password route
router.post("/set-password", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please provide all fields." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    user.password = await hashPassword(password);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error setting new password", error: error.message });
  }
});

// NEW END

module.exports = router;
