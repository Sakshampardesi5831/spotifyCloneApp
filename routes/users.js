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
  gender:String,
  profilePic:{
    type:String,
  },
  uploadFiles:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"music"
  }],
  recentSong:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"recent"
  },
  album:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"album"
   }],
   library:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"album"
   }],
   likeSongs:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"album"
   }],
   follow:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"album"
   }]
})
userSchema.plugin(plm);
module.exports=mongoose.model("user",userSchema);