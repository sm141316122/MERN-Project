require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
const cors = require("cors");
require("./config/passport")(passport);

// 連結MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("Connecting to mongodb");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 和auth有關的request
app.use("/api/user", authRoute);
// 和course有關的request
app.use(
  "/course",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
