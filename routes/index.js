var express = require('express');
var router = express.Router();
let userModel=require("./users");
const LocalStrategy = require("passport-local").Strategy;
const passport=require("passport");
passport.use(new LocalStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get("/register",function(req,res,next){
  res.render("index");
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
router.get("/dashboard", isLoggedIn, function(req,res,next){
    res.render("dashboard");
})

//LOGGED FUNCTION
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/");
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

