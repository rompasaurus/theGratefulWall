var express = require("express"),
    Gratitude = require("../models/gratitudeSchema"),
    Comment = require("../models/commentSchema"),
    passport =  require("passport"),
    User = require("../models/user")
    methodOverride = require("method-override"),
        app = express();
    router = express.Router();

app.use(methodOverride("_method"));
//Adds gratitude submitted via new form page
router.post("/",isLoggedIn, function(req,res){
    var gratitude={
        description: req.body.description,
        name:{
            id: req.user._id,
            username: req.user.username
        }
    }
    // Create gratitude and associate id to user
    Gratitude.create(gratitude, function(err,newGratitude){
        if(err){
            res.render("new");
        }else{
            User.findById(req.user._id, function (err, foundUser) {
                if(err) {
                    console.log(err)
                }else{
                    foundUser.submittedGratitude.push(newGratitude._id)
                    foundUser.save()
                    res.redirect("/");
                }
            })
        }
    });
});
//upvote a gratitude
router.post("/upvote/:id",isLoggedIn, function(req, res) {
    Gratitude.findById(req.params.id, function(err, foundGratitude) {
        if (err) {
            console.log("cant find post to upvote");
        } else {
            User.findById(req.user._id, function (err, foundUser) {
                if (err) {
                    console.log(err);
                } else {
                    //checks if logged in user already voted
                    var voteCheck = false;
                    foundUser.upvotedGratitude.forEach(function(value){
                        if(String(value._id)==String(foundGratitude._id)){
                            voteCheck = true;
                        }
                    })
                    if (!voteCheck){
                        foundUser.upvotedGratitude.push(foundGratitude._id);
                        foundGratitude.upvote++;
                        foundGratitude.lastVote = new Date();
                    }else{
                        foundUser.upvotedGratitude.pop(foundGratitude._id);
                        foundGratitude.upvote--;
                        foundGratitude.lastVote = new Date();
                    }
                    foundGratitude.save();
                    foundUser.save();
                    res.redirect('back');
                }
            })
        }
    })
});
//downvote a gratitude
router.post("/downvote/:id",isLoggedIn, function(req, res) {
    Gratitude.findById(req.params.id, function(err, foundGratitude){
        if(err){
            console.log("cant find post to upvote");
        }else {
            User.findById(req.user._id, function (err, foundUser) {
                if (err) {
                    console.log(err);
                } else {
                    //Checks is user already voted removes or adds accordingly
                    var voteCheck = false;
                    foundUser.downvotedGratitude.forEach(function(value){
                        if(String(value._id)==String(foundGratitude._id)){
                            voteCheck = true;
                        }
                    })
                    if (!voteCheck){
                        foundUser.downvotedGratitude.push(foundGratitude.id);
                        foundGratitude.downvote++;
                        foundGratitude.lastVote = new Date();
                    }else{
                        foundUser.downvotedGratitude.pop(foundGratitude.id);
                        foundGratitude.downvote--;
                        foundGratitude.lastVote = new Date();
                    }
                    foundGratitude.save();
                    foundUser.save();
                    res.redirect('back');
                }
            })
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
            //console.log(foundGratitude)
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


// Edit Route
//Edit form request
router.get("/gratitude/:id/edit", function(req, res) {
    Gratitude.findById(req.params.id, function (err, foundGratitude) {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("gratitudeEdit",{gratitude:foundGratitude});
        }
    });
})

// Edit a gratitude
router.put("/gratitude/:id", checkGratitudeOwnership, function(req, res) {
    var gratitudeU= {
        description: req.body.description
    }
    Gratitude.findByIdAndUpdate(req.params.id,gratitudeU,function(err,updatedGratitude){
        if(err) {
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/gratitude/"+updatedGratitude._id);
        }
    })
})
//DELETE ROUTE
router.delete("/gratitude/:id", checkGratitudeOwnership, function(req,res){
    Gratitude.findByIdAndRemove(req.params.id,function(err){
        if(err) {
            console.log(err);
            //res.redirect("back");
        }else{
            res.redirect("/");
        }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    console.log("something went terribly wrong");
    res.redirect("/login")
}

function checkGratitudeOwnership(req,res,next){
    if(req.isAuthenticated()){
        Gratitude.findById(req.params.id, function(err,foundGratitude) {
            if(err) {
                res.redirect("back");
            }else {
                if(foundGratitude.name.id.equals(req.user._id)) {
                    next();
                }else {
                    res.redirect("back");
                }
            }
        })
    }
}
module.exports = router;