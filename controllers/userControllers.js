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
        message:"sorry Wrong Credentials"

      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        message:"sorry Wrong Credentials"
      });
    }
    const jwtKey = process.env.JWT_SECRET;
    delete user.password;
    const userEmail= user.toObject().email
    const token = jwt.sign({userEmail}, jwtKey, { expiresIn: "2d" });
    // console.log(token);
    res.status(200).send({
      email: user.email,
      name: user.name,
      token: token,
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
    console.log("email inside update",email)
    const updatedUserData = req.body;
    console.log(req.body);
    console.log(req.tokendata);
    if(email===req.tokendata.userEmail){ 
      const user = await User.findOneAndUpdate({email},updatedUserData);
      if (!user) {
        console.log("Error finding the user");
      }
      return res.status(200).send("user updated successfully");
    }else{
      return res.status(401).end("Unauthorized Access");  
    }
    
  } 
  catch (err) {
    console.log("error", err);
    return res.status(500).end("Internal Server Error");
  }
};

module.exports.userFetcher = async (req, res) => {
  try {
    const email =req.params.id
    const results =   await User.findOne({ email }, { password: 0 });
    console.log("trying")
    console.log("userFetcher",results)
    delete results.password
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
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        message:"sorry Wrong Credentials"

      });
    }

    const accessToken = req.body.data.accessToken;
    const clientId = req.body.data.clientId;
    const googleResponse = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`)
    console.log(googleResponse);
    if (googleResponse.data.aud === clientId) {
      // Token is valid, you can trust it.
      // You can access user information from googleResponse.data.
      // Perform the necessary actions or grant access based on your application's requirements.
      console.log("done");
      res.status(200).json({ message: 'Authentication successful' });
    } else {
      // The token is not valid or doesn't belong to your app.
      console.log("not done")
      res.status(401).json({ message: 'Invalid access token' });
    }
    const jwtKey = process.env.JWT_SECRET;
    delete user.password;
    const userEmail= user.toObject().email
    const token = jwt.sign({userEmail}, jwtKey, { expiresIn: "2d" });
    // console.log(token);
    res.status(200).send({
      email: user.email,
      name: user.name,
      token: token,
      message: "You have been successfully logged in",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).end("Internal Server Error bye bye");
  }
};
