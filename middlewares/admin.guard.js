const { verifyAccessToken } = require("../helpers/jwt");

const AdminGuard = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ msg: "Token topilmadi" });
  if (token.split(" ")[0] !== "Bearer")
    return res.status(401).send({ msg: "Token formati noto'g'ri" });

  if (!token.split(" ")[1])
    return res.status(401).send({ msg: "Token topilmadi" });
  if (token.split(" ")[1].split(".").length !== 3)
    return res.status(401).send({ msg: "Token noto'g'ri" });
  if (!verifyAccessToken(token.split(" ")[1], "Admin"))
    return res.status(401).send({ msg: "Token noto'g'ri" });

  const admin = verifyAccessToken(token.split(" ")[1], "Admin");

  req.admin = admin;
  next();
};

module.exports = AdminGuard;
