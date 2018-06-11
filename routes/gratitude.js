var express = require("express"),
    Gratitude = require("../models/gratitudeSchema"),
    Comment = require("../models/commentSchema"),
    passport =  require("passport"),
    User = require("../models/user")
    router = express.Router();
//Adds gratitude submitted via new form page
router.post("/",isLoggedIn, function(req,res){
    var gratitude={
        description: req.body.description,
        name:{
            id: req.user._id,
            username: req.user.username
        }
    }
    Gratitude.create(gratitude, function(err,newGratitude){
        if(err){
            res.render("new");
        }else{
            res.redirect("/");
        }
    });
});
//upvote a gratitude
router.post("/upvote/:id",isLoggedIn, function(req, res) {
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
router.post("/downvote/:id",isLoggedIn, function(req, res) {
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
    var isLoggedIn = req.isAuthenticated();
    Gratitude.findById(req.params.id).populate('comments').exec(function(err, foundGratitude) {
        if(err){
            console.log(err)
        }else {

            var commentDescriptions = [];
            console.log(foundGratitude)
            res.render("showGratitude", {
                gratitude: foundGratitude,
                isLoggedIn: isLoggedIn
            })
        }
        })
    })
    // var gratitude = await Gratitude.findById(req.param.id).exec()
    // var comments = []
    // console.log(gratitude)
    // gratitude.comments.forEach(async function(commentId){
    //     var description = await Comment.findById(commentId)
    //     comments.push(description.comment)
    // })
    // res.render("showGratitude", {gratitude:foundGratitude,isLoggedIn:isLoggedIn,comments:commentDescriptions})
//post gratitude comment
router.post("/gratitude/:id",isLoggedIn, function(req, res) {
    var comment = {
        comment:req.body.gratitude.comments,
        name : {
            id: req.user._id,
            username: req.user.username
        }
    }

    Comment.create(comment, function(err, newComment) {
        if (err) {
            console.log("cannot add comment")
        } else {
            User.findById(req.user._id, function(err, foundUser){
              if(err){
                  console.log(err);
              }else{
                  foundUser.submittedComment.push(newComment._id);
                  foundUser.save();
                  console.log("associated comment to "+ foundUser.username)
              }
            })
            Gratitude.findById(req.params.id, function (err, foundGratitude) {
                if (err) {
                    console("aint no gratitude information")
                } else {
                    foundGratitude.comments.push(newComment._id);
                    foundGratitude.save();
                    console.log("added comment to " + foundGratitude);
                    res.redirect('back');
                }
            })
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