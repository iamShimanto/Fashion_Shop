require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const dbConfig = require("./config/db");
const authRoute = require("./routes/auth.route");

// ====== db config
dbConfig();

//============= middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ========== routes
app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
