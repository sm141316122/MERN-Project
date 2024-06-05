const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
});

// instance methods
userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

// middleware
// 新註冊用戶或更改密碼的用戶
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    let hashPassword = await bcrypt.hash(this.password, 12);
    this.password = hashPassword;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
