const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const users = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name : { type: String, required: true },
  roles : {type: String, required:true},
  createtime: {type: String, required:true},
  timeout: { type: String, required: true }
});

const Users = mongoose.model("Users", users);

module.exports = { Users };