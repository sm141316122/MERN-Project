const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models/index").user;
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.use((req, res, next) => {
  console.log("正在接收跟auth有關的請求");
  next();
});

// 註冊帳號
router.post("/register", async (req, res) => {
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { username, email, password, role } = req.body;
  try {
    let emailExist = await User.findOne({ email }).exec();
    if (emailExist) {
      return res.status(400).send("信箱已註冊，請更換信箱或登入");
    }

    let newUser = new User({
      username,
      email,
      password,
      role,
    });
    let saveUser = await newUser.save();

    return res.send({ msg: "已成功註冊", saveUser });
  } catch (e) {
    return res.status(500).send("資料庫註冊失敗");
  }
});

// 登入帳號
router.post("/login", async (req, res) => {
  let foundUser;
  try {
    foundUser = await User.findOne({ email: req.body.email }).exec();
  } catch (e) {
    return res.status(500).send("資料庫異常，無法登入");
  }
  if (!foundUser) {
    return res.status(400).send("信箱未註冊");
  }

  // 驗證密碼是否正確
  foundUser.comparePassword(req.body.password, (err, isMatch) => {
    if (err) {
      return res.status(500).send("資料庫驗證異常");
    }
    if (isMatch) {
      // 製作JWT
      const jwtObject = { _id: foundUser._id, email: foundUser.email };
      const token = jwt.sign(jwtObject, process.env.PASSPORT_SECRET);
      return res.send({ msg: "登入成功", token: "JWT " + token, foundUser });
    } else {
      return res.status(401).send("密碼錯誤");
    }
  });
});

module.exports = router;
