const Admin = require("../schemas/Admin");
const { generateTokens, verifyRefreshToken } = require("../helpers/jwt");
const config = require("config");

const createAdmin = async (req, res) => {
  const { name, surname, username, password } = req.body;
  const admin = new Admin({ name, surname, username, password });
  await admin.save();
  res.status(201).send({ msg: "Admin muvaffaqiyatli yaratildi", admin });
};

const loginAdmin = async (req, res) => {
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
    maxAge: config.get("refreshTokenTime"),
  });

  res.status(200).send({
    msg: "Admin muvaffaqiyatli tizimga kirdi",
    accessToken: tokens.accessToken,
  });
};

const logoutAdmin = async (req, res) => {
  const { refreshToken } = req.cookies;

  const admin = await Admin.findOne({ refreshToken });
  if (!admin) return res.status(401).send({ msg: "Admin topilmadi" });
  await Admin.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  res.clearCookie("refreshToken");
  res.status(200).send({ msg: "Admin muvaffaqiyatli tizimdan chiqdi" });
};

const refreshAdminToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  const admin = verifyRefreshToken(refreshToken, "Admin");
  if (!admin) return res.status(401).send({ msg: "Admin topilmadi" });
  const tokens = generateTokens(admin, "Admin");

  await Admin.findOneAndUpdate(
    { refreshToken },
    { refreshToken: tokens.refreshToken }
  );

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    maxAge: config.get("refreshTokenTime"),
  });

  res
    .status(200)
    .send({
      msg: "Admin muvaffaqiyatli tizimga kirdi",
      accessToken: tokens.accessToken,
    });
};

module.exports = {
  createAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
};
