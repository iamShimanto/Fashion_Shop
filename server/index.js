require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const dbConfig = require("./config/db");

dbConfig()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
