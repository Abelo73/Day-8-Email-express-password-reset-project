const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  resetOtp: {
    type: String,
  },
  resetOtpExpires: {
    type: Date,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpires: {
    type: Date,
  },
});

module.exports = mongoose.model("Users", userSchema);
