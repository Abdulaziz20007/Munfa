const express = require("express");
const config = require("config");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const mainRouter = require("./routes/index.routes");
const app = express();

const PORT = config.get("port") || 3300;

app.use(
  cors({
    origin: "*",
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
      "Content-Type",
      "Authorization",
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
