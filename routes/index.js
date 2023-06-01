var express = require('express');
var router = express.Router();
let userModel=require("./users");
let recentPlayed=require('./recentPlayed');
let album=require("./album");
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
  res.render("register");
})
router.post("/register",function(req,res,next){
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
router.get("/profile",isLoggedIn, async function(req,res,next){
   let user=await userModel.findOne({username:req.session.passport.user}).populate("album").limit(4);
   console.log(user);
   res.render("profile",{user:user});

})
router.post("/uploadPic",isLoggedIn,config.single("profile"), async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
  user.profilePic=req.file.filename,
  user.save();
  res.redirect("/profile");
})
router.get("/follow/:id",isLoggedIn, async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
   const id=req.params.id;
   if(user.follow.indexOf(id)===-1){
    user.follow.push(id);
   }else{
     user.follow.splice(user.follow.indexOf(id),1);
   }
    let myuser=await user.save();
   console.log(myuser);
   res.redirect("back");
})
router.get("/like/:id",isLoggedIn, async function(req,res,next){
    let user=await userModel.findOne({username:req.session.passport.user});
    const id=req.params.id;
    if(user.likeSongs.indexOf(id)===-1){
      user.likeSongs.push(id);
    }else{
      user.likeSongs.splice(user.likeSongs.indexOf(id),1);
    }
   let myuser=await user.save();
   console.log(myuser);
    res.redirect("back");
})
/*--------------------------------------------------------Secondary Routes---------------------------------------* */
router.get("/dashboard", isLoggedIn,async function(req,res,next){
    let user= await userModel.findOne({username:req.session.passport.user}).populate("library");
    let userMusic= await userModel.findOne({username:req.session.passport.user}).populate("recentSong");
    console.log(userMusic);
    let music=await musicSchema.find().limit(1).populate("albumName");
    let sponsored=await musicSchema.find().limit(1);
    let allAlbum=await album.find().limit(4).populate("mymusic");
    //  console.log(allAlbum);
    // console.log(user);
    // console.log(music);
    // let currentSongId=user.recentSong._id;
    // console.log(currentSongId);
    // let recent =await recentPlayed.findOne({_id:currentSongId}).populate("musicPlayed");
    // console.log(recent);
    res.render("dashboard",{music:music,user:user,allAlbum:allAlbum,sponsored:sponsored,userMusic:userMusic});
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
  /*let user=await userModel.findOne({username:req.session.passport.user});
    const id=req.params.id;
    user.recentSong.push(id);
  const myuser=await user.save();*/
   /*let musicFile=await musicSchema.findOne({_id:req.params.id});
   let data={
    userPlayed:user._id,
    musicPlayed:musicFile._id,
   }
   let mymusic=await recentPlayed.create(data);
   console.log(mymusic);
   user.recentSong=mymusic._id,
   user.save();*/
   let user=await userModel.findOne({username:req.session.passport.user});
   const id=req.params.id;
   user.recentSong=id;
   user.isMusic=true;
   user.save();
   res.redirect("/dashboard");
});
router.get("/albumDetails/:id",isLoggedIn, async function(req,res,next){
  /*let user=await userModel.findOne({username:req.session.passport.user});
    const id=req.params.id;
    user.recentSong.push(id);
  const myuser=await user.save();*/
   /*let musicFile=await musicSchema.findOne({_id:req.params.id});
   let data={
    userPlayed:user._id,
    musicPlayed:musicFile._id,
   }
   let mymusic=await recentPlayed.create(data);
   console.log(mymusic);
   user.recentSong=mymusic._id,
   user.save();*/
   let user=await userModel.findOne({username:req.session.passport.user});
   const id=req.params.id;
   user.recentSong=id;
   user.isMusic=true;
   user.save();
   res.redirect("back");
});

router.get("/viewAllSongsForYou",isLoggedIn, async function(req,res,next){
     let user=await userModel.findOne({username:req.session.passport.user});
     res.render("songsForYou");
})
router.get("/viewAllAlbum",isLoggedIn,function(req,res,next){
    res.status(200).json({
      message:"isme saari album dikhna ok"
    })
})
router.get("/albumUpload",isLoggedIn,function(req,res,next){
    res.status(200).render("albumUpload");
})
router.post("/albumUpload",
config.single("albumPoster"),isLoggedIn,async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
   let data={
    albumName:req.body.albumName,
    albumPoster:req.file.filename,
    albumCategory:req.body.albumCategory
   }
   let myalbum=await album.create(data);
   user.album.push(myalbum._id);
   user.save();
   res.redirect("/profile");
})
router.get("/albumMusicUpload/:id",isLoggedIn, async function(req,res,next){
  let user=await userModel.findOne({username:req.session.passport.user});
  console.log(req.params.id);
  let id=req.params.id;
  res.render("albumMusic",{id:id});
});
router.post("/UploadAlbumMusic/:id",isLoggedIn,config.array("file",2),async function(req,res,next){
    let myalbum=await album.findById(req.params.id);
    const id=req.params.id;
    console.log(myalbum);
    let uploadedData={
      songName:req.body.songName,
      songAlbum:req.body.songAlbum,
      songArtist:req.body.songArtist,
      songPosterFile:req.files.map((file)=>file.filename),
      albumName:id
     };
     let musicFile=await musicSchema.create(uploadedData);
     console.log(musicFile);
     myalbum.mymusic.push(musicFile._id);
     myalbum.save();
     res.redirect("/dashboard");
})
//this router is for detail of album
router.get("/album/:id",isLoggedIn,async function(req,res,next){
     let user=await userModel.findOne({username:req.session.passport.user}).populate("library");
     let userMusic=await userModel.findOne({username:req.session.passport.user}).populate("recentSong");
    let myalbum=await album.findById(req.params.id).populate("mymusic");
    console.log(userMusic);
    const id=req.params.id;
    res.render("albumDetail",{myalbum:myalbum,id:id,user:user,userMusic:userMusic});
});

router.get("/userLibrary/:id",isLoggedIn, async function(req,res,next){
    let user=await userModel.findOne({username:req.session.passport.user});
    user.library.push(req.params.id);
    user.save();
    res.redirect("/dashboard");
})
router.get("/deletePlaylist/:id",isLoggedIn, async function(req,res,next){
    let user=await userModel.findOne({username:req.session.passport.user});
    const id=  user.library.indexOf(req.params.id);
    console.log(id);
    user.library.splice(id,1);
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

