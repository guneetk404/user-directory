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
