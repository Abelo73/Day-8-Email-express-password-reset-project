const express = require("express");
const router = express.Router();
require("dotenv").config();
const authRouter = require("./routes/auth");

const connectDB = require("./config/db");

connectDB();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/user", authRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
