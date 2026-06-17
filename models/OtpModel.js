const mongoose = require("mongoose");

 const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const otp = mongoose.model("Otp", otpSchema);
module.exports = otp;