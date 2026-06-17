const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  securityQuestion: {
    type: String,
    required: false,
  },
  securityQuestionAnswer: {
    type: String,
    required: false,
  },
  token: {
    type: String,
  },
});
const registeredData = mongoose.model("register", registerSchema);
module.exports = registeredData;
