const User = require("../schemas/User");
const { errorHandler } = require("../helpers/error_handler");

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).send(users);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -refreshToken"
    );
    res.status(200).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password -refreshToken");
    res.status(200).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select(
      "-password -refreshToken"
    );
    res.status(200).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getUserPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("password");
    res.status(200).send({ password: user.password });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateUserPassword = async (req, res) => {
  try {
    if (!req.body.password)
      return res.status(400).send({ msg: "Parol kiritilishi majburiy" });
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: req.body.password },
      {
        new: true,
      }
    ).select("password");
    res.status(200).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserPassword,
  updateUserPassword,
};
