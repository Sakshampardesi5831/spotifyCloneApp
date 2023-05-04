var express = require('express');
var router = express.Router();
let userModel=require("./users");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/login",function(req,res){
    res.render("login");
})
module.exports = router;
