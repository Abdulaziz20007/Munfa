const User = require("../schemas/User");

const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).send(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).send(user);
};

const updateUserById = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).send(user);
};

const deleteUserById = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.status(200).send(user);
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

