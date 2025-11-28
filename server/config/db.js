const mongoose = require("mongoose");

const dbConfig = async (req, res) => {
  return await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("db connected"))
    .catch((err) => console.log(err));
};

module.exports = dbConfig;
