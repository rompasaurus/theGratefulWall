var express = require("express"),
    Gratitude = require("../models/gratitudeSchema"),
    passport =  require("passport"),
    User = require("../models/user")
    router = express.Router();


router.get("/new",isLoggedIn, function (req, res) {
    var isLoggedIn = req.isAuthenticated();
    res.render("new",{isLoggedIn:isLoggedIn});
});

//About Page
router.get("/about", function (req, res) {
    var isLoggedIn = req.isAuthenticated();
    res.render("about",{isLoggedIn:isLoggedIn});
});
//presents the landing page for the root of the site
router.get('/',function(req,res){
    var isLoggedIn = req.isAuthenticated();
    Gratitude.find({}, function(err,gratitudes){
        if(err){
            console.log("we aint found shit in no db");
        }else{
            res.redirect("/sort/today&1")
            //res.render('landing',{gratitudes:gratitudes,title:"Today's Top Gratitudes",isLoggedIn:isLoggedIn});
        }
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    console.log("something went terribly wrong");
    res.redirect("login")
}

module.exports = router;