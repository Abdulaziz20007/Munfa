const axios = require("axios");
const config = require("config");
const { errorHandler } = require("../helpers/error_handler");

const sendOtp = async (phone, otp) => {
  try {
    // const { baseUrl, email, password, senderId } = config.get("eskiz");

    // // Get auth token
    // const {
    //   data: {
    //     data: { token },
    //   },
    // } = await axios.post(`${baseUrl}/auth/login`, {
    //   email,
    //   password,
    // });

    // // Send SMS
    // const { data } = await axios.post(
    //   `${baseUrl}/message/sms/send`,
    //   {
    //     mobile_phone: phone.replace(/\D/g, ""),
    //     //   message: `Sizning tasdiqlash kodingiz: ${otp}`,
    //     message: `Bu Eskiz dan test`,
    //     from: senderId,
    //   },
    //   {
    //     headers: { Authorization: `Bearer ${token}` },
    //   }
    // );
    // return { success: true, otp, message: "OTP sent successfully" };
    return { success: true, otp: "123456", message: "OTP sent successfully" };
  } catch (error) {
    errorHandler(error);
  }
};

module.exports = { sendOtp };
