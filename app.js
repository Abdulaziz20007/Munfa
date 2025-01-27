const express = require("express");
const config = require("config");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const mainRouter = require("./routes/index.routes");
const app = express();

const PORT = config.get("port") || 3300;

// Define allowed origins
const allowedOrigins = [
  "https://munfa.netlify.app", // Production frontend
  "http://10.10.3.250:5173", // Development IP frontend
  "http://localhost:5173", // Local development frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
      "Accept-Language",
      "Content-Language",
    ],
  })
);

// Serve static files from uploads directory using absolute path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(cookieParser());
app.use("/api", mainRouter);

app.listen(PORT, async () => {
  try {
    await mongoose.connect(config.get("dbUri"));
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
