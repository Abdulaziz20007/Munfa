const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  name: String, // name
  surname: String, // surname
  username: String, // username
  password: String, // hashed password
  refreshToken: String, // refresh token
});

const Admin = model("Admin", adminSchema);

module.exports = Admin;
