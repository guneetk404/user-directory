const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { sendOtp } = require("../config/nodeMailer");

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
      return res.json(202, {
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
      return res.status(401).send({
        message: "sorry Wrong Credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        message: "sorry Wrong Credentials",
      });
    }
    const jwtKey = process.env.JWT_SECRET;
    delete user.password;
    const userEmail = user.toObject().email;
    const token = jwt.sign({ userEmail }, jwtKey, { expiresIn: "2d" });
    // console.log(token);
    res.status(200).send({
      email: user.email,
      name: user.name,
      token: token,
      admin: user.isAdmin,
      message: "You have been successfully logged in",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).end("Internal Server Error bye bye");
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const email = req.body.email;
    console.log("email inside update", email);
    const updatedUserData = req.body;
    const tokenEmail = req.tokendata.userEmail;
    console.log("tokenEmail", req.tokendata.userEmail);
    const admin = await User.findOne({ email: tokenEmail });
    console.log(admin);
    // console.log(req.tokendata);
    if (email === tokenEmail || admin.isAdmin) {
      const user = await User.findOneAndUpdate({ email }, updatedUserData);
      // const user1 = await User.findOne({email});

     const data = await user.save();
      if (!user) {
        console.log("Error finding the user");
      }
      return res.status(200).json({
        user:data,
        message: "user data updated Successfully",
        success: true,
      });
    } else {
      return res.status(401).end("Unauthorized Access");
    }
  } catch (err) {
    console.log("error", err);
    return res.status(500).end("Internal Server Error");
  }
};

module.exports.userFetcher = async (req, res) => {
  try {
    const email = req.params.id;
    const results = await User.findOne({ email }, { password: 0 });
    console.log("trying");
    console.log("userFetcher", results);
    delete results.password;
    return res.status(200).json({
      message: "Success",
      body: results,
      success: true,
    });
  } catch (error) {
    return res.json(400, {
      message: error,
      success: false,
    });
  }
};

module.exports.googleLogin = async (req, res) => {
  try {
    console.log(req.body.data.email);
    const email = req.body.data.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        message: "sorry Wrong Credentials",
      });
    }

    const accessToken = req.body.data.accessToken;
    const clientId = req.body.data.clientId;
    console.log("at", accessToken);

    const googleResponse = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`
    );
    //  console.log(googleResponse);
    if (googleResponse.data.aud === clientId) {
      console.log("done");
      const jwtKey = process.env.JWT_SECRET;
      const userEmail = user.toObject().email;
      const token = jwt.sign({ userEmail }, jwtKey, { expiresIn: "2d" });
      res.status(200).json({
        email: user.email,
        name: user.name,
        token: token,
        message: "You have been successfully logged in",
        success: true,
      });
    } else {
      console.log("not done");
      res.status(401).json({ message: "Invalid access token" });
    }
  } catch (error) {
    //console.log(error);
    return res.status(500).end("Internal Server Error bye bye");
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const email = req.body?.email;
    console.log(req.body.email);
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    const user = await User.findOneAndUpdate({ email }, { otp: otp });
    console.log(user);
    await sendOtp(email, otp);
    res.status(200).send({
      email: email,
      message: "otp sent",
      success: true,
    });
  } catch (error) {
    return res.json(500, {
      message: "Some error in sending OTP",
      success: false,
      error: error,
    });
  }
};

module.exports.validatePassword = async (req, res) => {
  try {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const hashPassword = bcrypt.hashSync(password, 8);

    const otp = req.body.otp;
    const user = await User.findOne({ email });
    console.log(user.otp);
    console.log(req.body.otp);
    console.log(user.otp == otp);
    if (user.otp == otp) {
      const user = await User.findOneAndUpdate(
        { email },
        { otp: null, password: hashPassword }
      );
      console.log(user);
      return res.status(200).send({
        message: "Password reset successfully",
        success: true,
      });
    } else {
      return res.status(402).send({
        message: "please enter a valid otp",
        success: false,
      });
    }
  } catch (err) {
    return res.status(500).end("Internal Server Error");
  }
};
