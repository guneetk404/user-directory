const User = require("../models/user");

module.exports.getAllUsers = async (req, res) => {
  try {
    // const users = await User.find();
    const users = await User.find({}, { password: 0 });
    delete users.password;
    if (!users) {
      return res.status(404).send("No users found");
    }
    return res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).end("Internal Server Error");
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).send("user not found");
    }
    return res.status(200).send("User deleted Successfully");
  } catch (error) {
    console.error("Error in deleting", error);
    res.status(500).end("Internal Server Error");
  }
};

module.exports.updateUsers = async (req, res) => {
  try {
    const mail = req.tokendata.userEmail;
    const user = await User.findOne({ email: mail });

    const email = req.body.email;
    // console.log("email inside update",email)
    const updatedUserData = req.body;
    // console.log(req.body);
    // console.log(user.isAdmin)
    // console.log(req.tokendata.userEmail);
    if(user.isAdmin){ 
      const updateUser = await User.findOneAndUpdate({email},updatedUserData);
      if (!updateUser) {
        return res.status(400).send("user not found");

        // console.log("Error finding the user");
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