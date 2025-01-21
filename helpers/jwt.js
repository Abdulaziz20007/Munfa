const jwt = require("jsonwebtoken");
const config = require("config");

const generateTokens = (payload, role) => {
  const accessToken = jwt.sign(payload, config.get(`jwt${role}Secret`), {
    expiresIn: config.get(`accessTokenTime`),
  });
  const refreshToken = jwt.sign(payload, config.get(`jwt${role}Secret`), {
    expiresIn: config.get(`refreshTokenTime`),
  });
  return { accessToken, refreshToken };
};

const verifyAccessToken = (token, role) => {
  try {
    return jwt.verify(token, config.get(`jwt${role}Secret`));
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token, role) => {
  try {
    return jwt.verify(token, config.get(`jwt${role}Secret`));
  } catch (error) {
    return null;
  }
};

module.exports = { generateTokens, verifyAccessToken, verifyRefreshToken };
