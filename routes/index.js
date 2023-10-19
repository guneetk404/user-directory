const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const {
  signup,
  login,
  updateUser,
  userFetcher,
  googleLogin,
  resetPassword,
  validatePassword
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


// router.post('/upload', upload, async (req, res) => {
//  try{
//   const email =  req.body.email;
//   image = req.file.filename;

//   const user = await User.findOneAndUpdate({ email }, image);
//   if (!user) {
//     console.log("Error finding the user");
//   }
//   return res.status(200).send("user picture successfully");
// }catch (err) {
// console.log("error", err);
// return res.status(500).end("Internal Server Error");
// }
  


// })


router.get("/", (req, res) => {
  res.send("hello Users!");
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login",googleLogin)
router.put("/update", jwtAuth, updateUser);

router.put("/adminUpdate", jwtAuth, updateUsers);

router.get("/allUsers", jwtAuth, getAllUsers);
router.get("/user/:id", jwtAuth, userFetcher);
router.delete("/delete/:email", jwtAuth, deleteUser);

router.put("/forget-password",resetPassword)
router.put("/reset-password",validatePassword)


module.exports = router; 
