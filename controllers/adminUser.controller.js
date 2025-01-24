const User = require("../schemas/User");

const getUsers = async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  res.status(200).send(users);
};

const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -refreshToken"
  );
  res.status(200).send(user);
};

const updateUserById = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-password -refreshToken");
  res.status(200).send(user);
};

const deleteUserById = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id).select(
    "-password -refreshToken"
  );
  res.status(200).send(user);
};

const getUserPassword = async (req, res) => {
  const user = await User.findById(req.params.id).select("password");
  res.status(200).send({ password: user.password });
};

const updateUserPassword = async (req, res) => {
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
};

module.exports = {
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserPassword,
  updateUserPassword,
};
