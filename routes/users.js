require("dotenv").config({path:"./.env"});
const mongoose=require("mongoose");
var plm=require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/spotifyDb").then(function(){
  console.log("Connected to db");
})

var userSchema= mongoose.Schema({
  username:String,
  name:String,
  email:String,
  password:String,
})
userSchema.plugin(plm);
module.exports=mongoose.model("user",userSchema);