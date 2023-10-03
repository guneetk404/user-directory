require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001

// database configuration

mongoose.connect(process.env.DB_URI,{useNewUrlParser:true})
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open',()=> console.log('connected to the database'))


app.use(bodyParser.json());

app.use("/", require("./routes/index.js"));


// app.get("/", (req, res) => {
//           res.send("hello Users!");
// })

app.listen(PORT,() =>{
          console.log("app is running : ",PORT);
})