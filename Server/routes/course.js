const { findOne } = require("../models/course-model");
const { find } = require("../models/user-model");

const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("正在通過course route");
  next();
});

// 顯示課程
router.get("/", async (req, res) => {
  try {
    let foundCourses = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send({ msg: "所有課程", foundCourses });
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 搜尋課程
router.get("/search/:search_name", async (req, res) => {
  let { search_name } = req.params;
  if (req.user.isInstructor()) {
    return res.send("只有學生才可註冊課程");
  }

  try {
    let searchResult = await Course.find({ title: search_name })
      .populate("instructor", ["username", "email"])
      .exec();

    return res.send(searchResult);
  } catch (e) {
    return res.status(500).send("搜尋課程失敗");
  }
});

// 註冊課程
router.post("/enroll/:enroll_id", async (req, res) => {
  let { enroll_id } = req.params;
  if (req.user.isInstructor()) {
    return res.status(400).send("只有學生可註冊課程");
  }

  try {
    let foundCourse = await Course.findOne({ _id: enroll_id }).exec();
    foundCourse.students.push(req.user._id);
    await foundCourse.save();
    return res.send("成功註冊");
  } catch (e) {
    return res.status(500).send("註冊課程失敗");
  }
});

// 以學生id顯示課程
router.get("/student/:student_id", async (req, res) => {
  let { student_id } = req.params;
  if (req.user.isInstructor()) {
    return res.status(400).send("欲查看已註冊課程，請以學生帳號登入");
  }

  try {
    let foundCourses = await Course.find({ students: student_id })
      .populate("instructor", ["username", "email"])
      .exec();

    return res.send(foundCourses);
  } catch (e) {
    return res.status(500).send("獲取課程失敗");
  }
});

// 以講師id顯示課程
router.get("/instructor/:instructor_id", async (req, res) => {
  let { instructor_id } = req.params;

  if (req.user.isStudent()) {
    return res.status(400).send("只有講師可查看發布的課程");
  }

  try {
    let foundCourses = await Course.find({ instructor: instructor_id })
      .populate("instructor", ["username", "email"])
      .exec();
    return res.send(foundCourses);
  } catch (e) {
    return res.status(500).send("獲取課程失敗");
  }
});

// 新增課程
router.post("/", async (req, res) => {
  // 確認使用者是否為講師
  if (req.user.isStudent())
    return res
      .status(400)
      .send("只有講師才可發布新課程，若你已是講師，請透過講師帳號登入");

  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { title, description, price } = req.body;
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    let savbeCourse = await newCourse.save();
    return res.send({ msg: "成功新增課程", savbeCourse });
  } catch (e) {
    return res.status(500).send("新增課程失敗");
  }
});

// 刪除課程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourse = await Course.findOne({ _id }).exec();
    if (foundCourse) {
      // 確認是否為此課程講師
      if (foundCourse.instructor._id.equals(req.user._id)) {
        await Course.deleteOne({ _id });
        return res.send("成功刪除課程");
      } else {
        return res.status(403).send("此課程講師才可刪除");
      }
    } else {
      return res.status(400).send("查無此課程");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send("刪除課程失敗");
  }
});

// 編輯課程
router.patch("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let foundCourse = await Course.findOne({ _id }).exec();
    if (foundCourse) {
      // 確認是否為此課程講師
      if (foundCourse.instructor._id.equals(req.user._id)) {
        let updateCourse = await Course.findOneAndUpdate({ _id }, req.body, {
          new: true,
          runValidators: true,
        });
        return res.send({ msg: "成功刪除課程", updateCourse });
      } else {
        return res.status(403).send("此課程講師才可編輯此課程");
      }
    } else {
      return res.status(400).send("查無此課程");
    }
  } catch (e) {
    console.log(e);
    return res.status(500).send("編輯課程失敗");
  }
});

module.exports = router;
