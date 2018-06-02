var express = require("express"),
    Gratitude = require("../models/gratitudeSchema"),
    passport =  require("passport"),
    router = express.Router();



//upvote a gratitude
router.post("/upvote/:id", function(req, res) {
    Gratitude.findById(req.params.id, function(err, foundGratitude){
        if(err){
            console.log("cant find post to upvote");
        }else{
            foundGratitude.upvote++;
            foundGratitude.lastVote = new Date();
            console.log("downvoted post" + foundGratitude);
            foundGratitude.save();
            res.redirect('back');
        }
    })
});
//downvote a gratitude
router.post("/downvote/:id", function(req, res) {
    Gratitude.findById(req.params.id, function(err, foundGratitude){
        if(err){
            console.log("cant find post to upvote");
        }else{
            foundGratitude.downvote++;
            foundGratitude.lastVote = new Date();
            console.log("downvoted post" + foundGratitude);
            foundGratitude.save();
            res.redirect('back');
        }
    })
});

//Show Gratitude
router.get("/gratitude/:id", function(req, res) {
    Gratitude.findById(req.params.id, function(err, foundGratitude) {
        if(err){
            console("aint no gratitude information")
        }else{
            res.render("showGratitude", {gratitude:foundGratitude})
        }
    })
})
//post gratitude comment
router.post("/gratitude/:id", function(req, res) {
    var comment = req.body.gratitude.comments
    Gratitude.findById(req.params.id, function(err, foundGratitude) {
        if(err){
            console("aint no gratitude information")
        }else{
            foundGratitude.comments.push(comment);
            foundGratitude.save();
            console.log("added comment to " + foundGratitude);
            res.redirect('back');
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    console.log("something went terribly wrong");
    res.redirect("login")
}

module.exports = router;