const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: String,
    surname: String,
    phone: { type: String, unique: true },
    password: String,
    refreshToken: String,
    otp: String,
    otpId: String,
    otpSentAt: String,
    otpExpiry: String,
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
