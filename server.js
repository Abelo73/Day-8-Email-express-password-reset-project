const express = require("express");
const cors = require("cors");
const router = express.Router();
require("dotenv").config();
const authRouter = require("./routes/auth");

const connectDB = require("./config/db");

connectDB();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// CORS middleware to allow requests from any origin
app.use(
  cors({
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Enable credentials (like cookies)
  })
);

app.use("/api/user", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
