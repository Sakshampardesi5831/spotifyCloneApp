var express = require('express');
var router = express.Router();
let userModel=require("./users");
const LocalStrategy = require("passport-local").Strategy;
const passport=require("passport");
var config=require("../config/config")
passport.use(new LocalStrategy(userModel.authenticate()));
var mongoose=require("mongoose");
const music = require('./music');
var mongooseUrl="mongodb://localhost/spotifyDb";
const conn = mongoose.createConnection(mongooseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "spotifySongsBucket",
  });
});
/*-----------------------------------------------------Authentication--------------------------------------* */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get("/register",function(req,res,next){
  res.render("index");
})
router.post("/register",function(req,res,next){
  try {
    var newUser=new userModel({
      username:req.body.username,
      name:req.body.name.name,
      email:req.body.email,
      gender:req.body.gender,
    })
    userModel.register(newUser,req.body.password).then(function(u){
       console.log(u);
       passport.authenticate("local")(req,res,function(){
          res.redirect("/dashboard");
       })
    })
  } catch (error) {
     res.json({
      message:error,
     })
  } 
})
router.get("/login",function(req,res){
    res.render("login");
});
router.post("/login",passport.authenticate("local",{
    successRedirect:"/dashboard",
    failureRedirect:"/login"
}),function(req,res,next){})
router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
/*--------------------------------------------------------Secondary Routes---------------------------------------* */
router.get("/dashboard", isLoggedIn, function(req,res,next){
    res.render("dashboard");
});
router.get("/upload",isLoggedIn, async function(req,res){
   let user=await userModel.findOne({username:req.session.passport.user});

   res.render("uploadMusic",{user:user});
});
router.post("/upload",isLoggedIn,config.array("file",2), async function(req,res,next){
   let user= await userModel.findOne({username:req.session.passport.user});
   let uploadedData={
    songName:req.body.songName,
    songAlbum:req.body.songAlbum,
    songArtist:req.body.songArtist,
    songPosterFile:req.files.map((file)=>file.filename)    
   };
   let musicFile=await music.create(uploadedData);
   console.log(musicFile);
   user.uploadFiles.push(musicFile._id);
   user.save();
   res.redirect("/dashboard");
});
//LOGGED FUNCTION
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}
function redirectToProfile(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    return next();
  }
}
module.exports = router;

