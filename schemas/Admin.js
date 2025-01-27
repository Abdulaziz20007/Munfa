const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  name: String,
  surname: String,
  username: { type: String, unique: true },
  password: String,
  refreshToken: String,
},
{
  timestamps: true,
});

const Admin = model("Admin", adminSchema);

module.exports = Admin;
