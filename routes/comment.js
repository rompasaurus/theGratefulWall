var express = require("express"),
    Gratitude = require("../models/gratitudeSchema"),
    Comment = require("../models/commentSchema"),
    passport =  require("passport"),
    User = require("../models/user"),
    methodOverride = require("method-override"),
    router = express.Router();

//post gratitude comment
router.post("/gratitude/:id",isLoggedIn, function(req, res) {
    var comment = {
        comment:req.body.gratitude.comments,
        name : {
            id: req.user._id,
            username: req.user.username
        }
    }
//creates comment and associates id to the user
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
//Delete Route
router.delete("/comment/:id", checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.id,function(err){
        if(err) {
            console.log(err);
            //res.redirect("back");
        }else{
            res.redirect("/");
        }
    })
})
//comment edit form
router.get("/comment/:id/edit", function(req, res) {
    Comment.findById(req.params.id, function (err, foundComment) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("partials/commentEdit",{comment:foundComment});
        }
    });
})

// Edit a Comment
router.post("/comment/:id", checkCommentOwnership, function(req, res) {
    var commentU= {
        comment: req.body.description
    }
    Comment.findByIdAndUpdate(req.params.id,commentU,function(err,updatedGratitude){
        if(err) {
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("back");
        }
    })
})
//Vote Routes
router.post("/comment/downvote/:id",isLoggedIn, function(req, res) {
    Comment.findById(req.params.id, function(err, foundComment){
        if(err){
            console.log("cant find post to upvote");
        }else {
            User.findById(req.user._id, function (err, foundUser) {
                if (err) {
                    console.log(err);
                } else {
                    //Checks is user already voted removes or adds accordingly
                    var voteCheck = false;
                    foundUser.downvotedComment.forEach(function(value){
                        if(String(value._id)==String(foundComment._id)){
                            voteCheck = true;
                        }
                    })
                    if (!voteCheck){
                        foundUser.downvotedComment.push(foundComment.id);
                        foundComment.downvote++;
                        //foundComment.lastVote = new Date();
                    }else{
                        foundUser.downvotedComment.pop(foundComment.id);
                        foundComment.downvote--;
                        //foundComment.lastVote = new Date();
                    }
                    foundComment.save();
                    foundUser.save();
                    res.redirect('back');
                }
            })
        }
    })
});
router.post("/comment/upvote/:id",isLoggedIn, function(req, res) {
    Comment.findById(req.params.id, function(err, foundComment){
        if(err){
            console.log("cant find post to upvote");
        }else {
            User.findById(req.user._id, function (err, foundUser) {
                if (err) {
                    console.log(err);
                } else {
                    //Checks is user already voted removes or adds accordingly
                    var voteCheck = false;
                    foundUser.upvotedComment.forEach(function(value){
                        if(String(value._id)==String(foundComment._id)){
                            voteCheck = true;
                        }
                    })
                    if (!voteCheck){
                        foundUser.upvotedComment.push(foundComment.id);
                        foundComment.upvote++;
                        //foundComment.lastVote = new Date();
                    }else{
                        foundUser.upvotedComment.pop(foundComment.id);
                        foundComment.upvote--;
                        //foundComment.lastVote = new Date();
                    }
                    foundComment.save();
                    foundUser.save();
                    res.redirect('back');
                }
            })
        }
    })
});
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    console.log("something went terribly wrong");
    res.redirect("/login")
}
function checkCommentOwnership(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.id, function(err,foundComment) {
            if(err) {
                res.redirect("back");
            }else {
                if(foundComment.name.id.equals(req.user._id)) {
                    next();
                }else {
                    res.redirect("back");
                }
            }
        })
    }
}

module.exports = router;