const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Plese enter your name"],
    maxLength: [20, "Cannot exceed 20 chracters"],
    minLength: [5, "Name should have more then 5 chracters"],
  },
  email: {
    type: String,
    required: [true, "Plese enter your email"],
    unique: true,
    validate: [validator.isEmail, "Plese Enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Plese enter your password"],
    minLength: [6, "Password should be greater then 6 chracters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "User",
  },
  resetPasswordToken: String,
  resetPasswordExpier: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
// JWT TOKEN
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
// Genrateing Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  //Genrating token
  const resetToken = crypto.randomBytes(20).toString("hex");
  //Hashing and adding to user scheme
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpier = Date.now() + 15 * 60 * 1000;
  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
