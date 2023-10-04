const express = require("express");

const router = express.Router();
const User = require("../models/user");
// const multer = require("multer");
const {signup, login, updateUser, } = require("../controllers/userControllers");
const jwtAuth = require("../middlewares/auth");
const { getAllUsers, deleteUser } = require("../controllers/adminControllers");
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

router.post("/signup", signup);
router.post("/login",login)
router.put("/update",jwtAuth,updateUser)
router.get("/allUsers",jwtAuth,getAllUsers)
router.delete("/delete",deleteUser)


module.exports = router;
