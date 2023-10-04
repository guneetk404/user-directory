const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.signup = async (req, res) => {
  try {
    console.log(req.body);
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      const password = bcrypt.hashSync(req.body.password, 8);
      req.body.password = password;
      console.log(req.body);
      const newUser = User.create(req.body);
      return res.json(200, {
        ...newUser,
        message: "User created successfully",
        success: true,
      });
    } else {
      return res.json(500, {
        message: "User Already Present!",
        success: false,
      });
    }
  } catch (error) {
    return res.json(400, {
      message: "Sorry try again",
      success: false,
      error: error,
    });
  }
};

module.exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("invalid Cred");
    }
    const jwtKey = process.env.JWT_SECRET;
    delete user.password;
    const token = jwt.sign(user.toObject(), jwtKey, { expiresIn: "2d" });
    return res.status(200).send(token);
  } catch (error) {
    console.log(error);
    return res.status(500).end("Internal Server Error bye bye");
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const email = req.user.email;
    const updatedUserData = req.body;
    console.log(email);

    const user = await User.findOneAndUpdate({email},updatedUserData);
    if (!user) {
      console.log("Error finding the user");
    }
    return res.status(200).send("user updated successfully");
  } 
  catch (err) {
    console.log("error", err);
    return res.status(500).end("Internal Server Error");
  }
};


