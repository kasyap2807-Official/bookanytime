const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const https = require("https");

dotenv.config();
const connectDB = require("./config/db");

const app = express();

const allowedOrigins = [
  "https://coruscating-churros-40f467.netlify.app",
  "http://localhost:5173",
  "https://fantastic-nasturtium-d1d70b.netlify.app",
  "http://bookanytime.in",
  "https://bookanytime.in"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);


app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/properties", require("./routes/propertyRoutes"));
app.use("/api/offers", require("./routes/offerRoutes"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/trackdata", require("./routes/trackDataRoute"));
app.use("/api/ratings", require("./routes/ratingsRoutes"));
app.use("/api/list-property", require("./routes/ListPropertyRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));

// 🔒 Load SSL Certificate & Key from Let's Encrypt
// const options = {
//   key: fs.readFileSync("/etc/letsencrypt/live/api.bookanytime.in/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/api.bookanytime.in/cert.pem"),
//   ca: fs.readFileSync("/etc/letsencrypt/live/api.bookanytime.in/chain.pem"),
// };

// Start HTTPS Server
const PORT = process.env.PORT || 5000;
// https
//   .createServer(options, app)
//   .listen(PORT, () => console.log(`🔒 HTTPS Server running on https://api.bookanytime.in:${PORT}`));

app.listen(3000,()=>{
  console.log("Server started!!")
})
