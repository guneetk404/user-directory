const express = require("express");

const router = express.Router();
const User = require("../models/user");
const multer = require("multer");

// image upload

// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "_" + Date.now() + "" + file.originalname);
//   },
// });

// let upload = multer({
//           storage:storage,
// }).single("image")

router.get("/", (req, res) => {
  res.send("hello Users!");
});

router.post("/signup", (req, res) => {
       console.log("req.body");
})

module.exports = router;
