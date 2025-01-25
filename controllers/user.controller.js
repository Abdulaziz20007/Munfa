const User = require("../schemas/User");
const { validatePhone } = require("../helpers/phone_validation");
const { generateTokens } = require("../helpers/jwt");
const config = require("config");
const { sendOtp } = require("../service/sendOtp");
const { createOtp } = require("../helpers/createOtp");
const { errorHandler } = require("../helpers/error_handler");
const checkIsRegistered = require("../helpers/isRegistered");

const identify = async (req, res) => {
  try {
    const { phone } = req.body;
    const { isValid, message } = validatePhone(phone);
    if (!isValid) return res.status(400).send({ msg: message });

    const user = await User.findOne({ phone });
    if (user)
      return res.status(302).send({
        found: true,
        isVerified: user.isVerified,
        isRegistered: await checkIsRegistered(phone, res),
      });

    res.status(404).send({ found: false });
  } catch (error) {
    errorHandler(error, res);
  }
};

const create = async (req, res) => {
  try {
    const { phone } = req.body;
    const { isValid, message } = validatePhone(phone);
    if (!isValid) return res.status(400).send({ msg: message });

    const user = await User.findOne({ phone });
    if (user)
      return res
        .status(400)
        .send({ msg: "Telefon raqam avval ro'yxatdan o'tgan" });

    const { otp, otpId, otpSentAt, otpExpiry } = createOtp();

    await sendOtp(phone, otp);

    await User.create({
      phone,
      otp,
      otpId,
      otpSentAt,
      otpExpiry,
    });
    res.status(201).send({ msg: "Tasdiqlash kodi yuborildi", otpId });
  } catch (error) {
    errorHandler(error, res);
  }
};

const register = async (req, res) => {
  try {
    const { phone, password, name, surname } = req.body;
    const { isValid, message } = validatePhone(phone);
    if (!isValid) return res.status(400).send({ msg: message });

    if (!password || password.length < 4)
      return res
        .status(400)
        .send({ msg: "Parol kamida 4 ta belgidan iborat bo'lishi kerak" });

    if (!name || name.length < 3)
      return res
        .status(400)
        .send({ msg: "Ism kamida 3 ta belgidan iborat bo'lishi kerak" });

    if (!surname || surname.length < 3)
      return res.status(400).send({
        msg: "Familiya kamida 3 ta belgidan iborat bo'lishi kerak",
      });

    const user = await User.findOne({ phone });
    if (!user)
      return res
        .status(400)
        .send({ msg: "Telefon raqam avval ro'yxatdan o'tmagan" });
    if (!user.isVerified)
      return res
        .status(400)
        .send({ msg: "Telefon raqam avval tasdiqlanmagan" });

    await User.findOneAndUpdate({ phone }, { password, name, surname });
    res
      .status(201)
      .send({ msg: "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const authenticate = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const { isValid, message } = validatePhone(phone);
    if (!isValid) return res.status(400).send({ msg: message });

    const user = await User.findOne({ phone });
    if (!user)
      return res
        .status(401)
        .send({ msg: "Telefon raqam yoki parol noto'g'ri" });

    if (!user.password)
      return res.status(401).send({ msg: "Parol qo'yilmagan" });

    if (user.password !== password)
      return res
        .status(401)
        .send({ msg: "Telefon raqam yoki parol noto'g'ri" });
    if (!user.isVerified)
      return res.status(401).send({ msg: "Telefon raqam tasdiqlanmagan" });

    const payload = {
      id: user._id,
      phone: user.phone,
      name: user.name,
      surname: user.surname,
    };

    const { accessToken, refreshToken } = generateTokens(payload, "User");

    await User.findByIdAndUpdate(user._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookieExpiryTime"),
    });

    res.status(200).send({ accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });

    res.clearCookie("refreshToken");
    res.status(200).send({ msg: "Foydalanuvchi tizimdan chiqdi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(401).send({ msg: "Token topilmadi" });

    const user = verifyRefreshToken(refreshToken, "User");
    if (!user) return res.status(401).send({ msg: "Foydalanuvchi topilmadi" });

    const payload = {
      id: user._id,
      phone: user.phone,
      name: user.name,
      surname: user.surname,
    };

    const tokens = generateTokens(payload, "User");

    await User.findByIdAndUpdate(user._id, {
      refreshToken: tokens.refreshToken,
    });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookieExpiryTime"),
    });

    res.status(200).send({ accessToken: tokens.accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const requestOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const { isValid, message } = validatePhone(phone);
    if (!isValid) return res.status(400).send({ msg: message });

    const user = await User.findOne({ phone });
    if (!user)
      return res
        .status(400)
        .send({ msg: "Telefon raqam avval ro'yxatdan o'tmagan" });
    if (user.isVerified)
      return res.status(400).send({ msg: "Telefon raqam avval tasdiqlangan" });

    if (new Date() < new Date(user.otpExpiry))
      return res
        .status(400)
        .send({ msg: "Tasdiqlash kodi avval yuborilgan", otpId: user.otpId });

    const { otp, otpId, otpSentAt, otpExpiry } = createOtp();

    await sendOtp(phone, otp);

    await User.findOneAndUpdate(
      { phone },
      { otp, otpId, otpSentAt, otpExpiry }
    );

    res.status(200).send({
      msg: "Tasdiqlash kodi yuborildi",
      otpId,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp, otpId } = req.body;
    const user = await User.findOne({ phone });

    if (!user) return res.status(401).send({ msg: "Foydalanuvchi topilmadi" });
    if (user.otpId !== otpId)
      return res.status(401).send({ msg: "OTP ID noto'g'ri" });
    if (user.otp !== otp)
      return res.status(401).send({ msg: "Tasdiqlash kodi noto'g'ri" });
    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(401).send({ msg: "Tasdiqlash kodi eskirgan" });
    }

    user.isVerified = true;
    user.otp = "";
    user.otpId = "";
    user.otpSentAt = "";
    user.otpExpiry = "";
    await user.save();

    res.status(200).send({ msg: "Telefon raqam tasdiqlandi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const changePassword = async (req, res) => {
  try {
    const { phone, oldPassword, newPassword } = req.body;
    const user = await User.findOne({ phone });

    if (!user) return res.status(401).send({ msg: "Foydalanuvchi topilmadi" });
    if (user.password !== oldPassword) {
      return res.status(401).send({ msg: "Joriy parol noto'g'ri" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).send({ msg: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, surname } = req.body;
    const { id } = req.user;

    const user = await User.findOne({ id });
    if (!user) return res.status(401).send({ msg: "Foydalanuvchi topilmadi" });

    await User.findByIdAndUpdate(id, { name, surname });
    res.status(200).send({ msg: "Foydalanuvchi muvaffaqiyatli o'zgartirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserById = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).select("-password -refreshToken -otp -otpId -otpSentAt -otpExpiry");
  res.status(200).send(user);
};

module.exports = {
  identify,
  create,
  register,
  authenticate,
  logoutUser,
  refreshUserToken,
  requestOtp,
  verifyOtp,
  changePassword,
  updateUser,
  getUserById,
};
