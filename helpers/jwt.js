const jwt = require("jsonwebtoken");
const config = require("config");
const { errorHandler } = require("./error_handler");

const generateTokens = (payload, role) => {
  try {
    if (payload.exp) {
      delete payload.exp;
    }

    const accessToken = jwt.sign(payload, config.get(`jwt${role}Secret`), {
      expiresIn: config.get(`accessTokenTime`),
    });
    const refreshToken = jwt.sign(payload, config.get(`jwt${role}Secret`), {
      expiresIn: config.get(`refreshTokenTime`),
    });
    return { accessToken, refreshToken };
  } catch (error) {
    errorHandler(error, res);
  }
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
