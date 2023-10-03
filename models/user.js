const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  address:{
    type:String,
    required:false
  },
  isAdmin:{
    type:Boolean,
    required:false,
    default:false
  },
},
  {timestamps:true}
);

const User = mongoose.model("User", userSchema);
module.exports = User;