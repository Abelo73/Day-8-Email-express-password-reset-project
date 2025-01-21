const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function to generate JWT token

const generateToken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    return token;
  } catch (error) {
    throw new Error("Error generating token");
    console.log(error);
  }
};

module.exports = { generateToken };
