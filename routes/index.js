const express = require("express");

const router = express.Router();
const User = require("../models/user");
// const multer = require("multer");
const {
  signup,
  login,
  updateUser,
  userFetcher,
} = require("../controllers/userControllers");
const jwtAuth = require("../middlewares/auth");
const { getAllUsers, deleteUser , updateUsers } = require("../controllers/adminControllers");
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
router.post("/login", login);
router.put("/update", jwtAuth, updateUser);

router.put("/adminUpdate", jwtAuth, updateUsers);

router.get("/allUsers", jwtAuth, getAllUsers);
router.get("/user/:id", jwtAuth, userFetcher);
router.delete("/delete", jwtAuth, deleteUser);

module.exports = router; 
