const express = require("express");
const config = require("config");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.routes");
const app = express();

const PORT = config.get("port") || 3300;

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
