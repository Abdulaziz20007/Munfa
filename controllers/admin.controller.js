const Admin = require("../schemas/Admin");
const { generateTokens, verifyRefreshToken } = require("../helpers/jwt");
const config = require("config");
const { errorHandler } = require("../helpers/error_handler");

const createAdmin = async (req, res) => {
  try {
    const { name, surname, username, password } = req.body;
    if (await Admin.findOne({ username }))
      return res.status(400).send({ msg: "Username band" });
    const admin = new Admin({ name, surname, username, password });
    if (!name || !surname || !username || !password)
      return res.status(400).send({ msg: "Barcha maydonlar majburiy" });
    await admin.save();
    res.status(201).send({ msg: "Admin muvaffaqiyatli yaratildi", admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(401).send({ msg: "Username yoki parol noto'g'ri" });
    if (admin.password !== password)
      return res.status(401).send({ msg: "Username yoki parol noto'g'ri" });

    const payload = {
      id: admin._id,
      username: admin.username,
      name: admin.name,
      surname: admin.surname,
    };

    const tokens = generateTokens(payload, "Admin");

    await Admin.findOneAndUpdate(
      { username },
      { refreshToken: tokens.refreshToken }
    );

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookieExpiryTime"),
    });

    res.status(200).send({
      msg: "Admin muvaffaqiyatli tizimga kirdi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    const admin = await Admin.findOne({ refreshToken });
    console.log(admin);
    if (!admin) return res.status(401).send({ msg: "Admin topilmadi" });
    await Admin.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    res.clearCookie("refreshToken");
    res.status(200).send({ msg: "Admin muvaffaqiyatli tizimdan chiqdi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    const admin = verifyRefreshToken(refreshToken, "Admin");
    if (!admin) return res.status(401).send({ msg: "Admin topilmadi" });

    const payload = {
      id: admin._id,
      username: admin.username,
      name: admin.name,
      surname: admin.surname,
    };
    const tokens = generateTokens(payload, "Admin");

    await Admin.findOneAndUpdate(
      { username: admin.username },
      { refreshToken: tokens.refreshToken }
    );

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("cookieExpiryTime"),
    });

    res.status(200).send({
      msg: "Admin muvaffaqiyatli tizimga kirdi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
};
