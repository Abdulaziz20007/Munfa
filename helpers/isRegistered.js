const User = require("../schemas/User");
const { errorHandler } = require("./error_handler");

const isRegistered = async (phone, res) => {
  try {
    const user = await User.findOne({ phone });
    return !user || !user.password || !user.name ? false : true;
  } catch (err) {
    errorHandler(err, res);
  }
};

module.exports = isRegistered;
