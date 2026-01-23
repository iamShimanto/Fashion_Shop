require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const dbConfig = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route");
const productRoute = require("./routes/product.route");
const orderRoute = require("./routes/order.route");
const userRoute = require("./routes/user.route");
require("./config/cloudinary");

if (process.env.NODE_ENV === "production") {
  // Needed when behind a reverse proxy (Render/NGINX/etc.)
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");

// ====== db config
dbConfig();

//============= middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3001",
  process.env.ADMIN_URL || "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());

// ========== routes
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
