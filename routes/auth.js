var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");

//Authentication Logic
router.get("/register", function(req,res){
    res.render("register");
});
//handle user signup
router.post("/register", function(req,res){
    User.register(new User({
        username: req.body.username,
        email: req.body.email,
        lastName: req.body.lastName,
        firstName: req.body.firstName
    }), req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.render('register');
        }else{
            console.log(user + " Succesfully registered");
            passport.authenticate("local")(req,res, function(){
                res.redirect("/user")
            })
        }
    })
});
//Login Routes
//render login form
router.get("/login", function(req,res){
    res.render("login");
});
//login Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/login"
}), function(req,res){

});

//logout
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/")
});

module.exports = router;
