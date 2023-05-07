var express = require('express');
var router = express.Router();
let userModel=require("./users");
let recentPlayed=require('./recentPlayed');
const LocalStrategy = require("passport-local").Strategy;
const passport=require("passport");
var config=require("../config/config")
passport.use(new LocalStrategy(userModel.authenticate()));
var mongoose=require("mongoose");
const musicSchema=require("./music");
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
router.get("/dashboard", isLoggedIn,async function(req,res,next){
    let user= await userModel.findOne({username:req.session.passport.user}).populate("recentSong");
    let music=await musicSchema.find().limit(4)
    let currentSongId=user.recentSong._id;
    // console.log(currentSongId);
    let recent =await recentPlayed.findOne({_id:currentSongId}).populate("musicPlayed");
    console.log(recent);
    res.render("dashboard",{music:music,recent:recent});
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
   let musicFile=await musicSchema.create(uploadedData);
   console.log(musicFile);
   user.uploadFiles.push(musicFile._id);
   user.save();
   res.redirect("/dashboard");
});
router.get("/audioPosterFile/:filename", (req, res) => {
  const file = gfs
    .find({
      filename: req.params.filename,
    })
    .toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no files exist",
        });
      }
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    });
  // console.log(file);
});
router.get("/musicDetails/:id",isLoggedIn, async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
   let musicFile=await musicSchema.findOne({_id:req.params.id});
   let data={
    userPlayed:user._id,
    musicPlayed:musicFile._id,
   }
   let mymusic=await recentPlayed.create(data);
   console.log(mymusic);
   user.recentSong=mymusic._id,
   user.save();
   res.redirect("/dashboard");
})
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

