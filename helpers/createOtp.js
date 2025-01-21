const { v4: uuidv4 } = require("uuid");

module.exports = {
  createOtp: () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpId = uuidv4();
    const otpSentAt = new Date().toISOString();
    const otpExpiry = new Date(Date.now() + 1000 * 60 * 5).toISOString();

    return { otp, otpId, otpSentAt, otpExpiry };
  },
};
