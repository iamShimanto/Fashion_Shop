require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const dbConfig = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route");
require("./config/cloudinary");

// ====== db config
dbConfig();

//============= middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());

// ========== routes
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
