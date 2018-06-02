var express = require("express"),
    Gratitude = require("../models/gratitudeSchema"),
    passport =  require("passport"),
    User = require("../models/user")
    router = express.Router();


router.get("/new", function (req, res) {
    res.render("new");
});

//About Page
router.get("/about", function (req, res) {
    res.render("about");
});
//Adds gratitude submitted via new form page
router.post("/", function(req,res){
    Gratitude.create(req.body.gratitude, function(err,newGratitude){
        if(err){
            res.render("new");
        }else{
            res.redirect("/");
        }
    });
});
//presents the landing page for the root of the site
router.get('/',function(req,res){
    Gratitude.find({}, function(err,gratitudes){
        if(err){
            console.log("we aint found shit in no db");
        }else{
            res.render('landing',{gratitudes:gratitudes,title:"Today's Top Gratitudes"});
        }
    })
});
router.get("/user",isLoggedIn, function(req,res){
    res.render("user")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    console.log("something went terribly wrong");
    res.redirect("login")
}

module.exports = router;