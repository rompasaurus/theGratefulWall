var express = require("express"),
    Gratitude = require("../models/gratitudeSchema"),
    passport =  require("passport"),
    User = require("../models/user"),
    Gratitude = require("../models/gratitudeSchema"),
    Comment = require("../models/commentSchema"),
    router = express.Router();

router.get("/user",isLoggedIn, function (req,res) {
    res.redirect('/user/sort/details')
})

router.get("/user/sort/:id", isLoggedIn, function(req, res) {
    var sortingActiveItem = {
        details: "item",
        gratitudes: "item",
        comments: "item",
        upvoted: "item",
        favorites: "item",
    }
    var includePath = "./partials/user/"
    switch(req.params.id){
        case "details":
            includePath+="details"
            sortingActiveItem.details = "active item"
            res.render('user',{sortingActiveItem:sortingActiveItem,includePath:includePath})
            break;
        case "gratitudes":
            includePath+="gratitudes"
            sortingActiveItem.gratitudes = "active item"
            User.findById(req.user._id).populate('submittedGratitude').exec(function(err, userGrat) {
                if (err) {
                    console.log(err)
                } else {
                    res.render('user', {
                        sortingActiveItem: sortingActiveItem,
                        userGrat: userGrat
                    })
                }
            })
                break;
        case "comments":
            includePath+="comments"
            sortingActiveItem.comments = "active item"
            User.findById(req.user._id).populate('submittedComment').exec(function(err, userGrat) {
                if (err) {
                    console.log(err)
                } else {
                    res.render('user',{sortingActiveItem:sortingActiveItem,userGrat:userGrat})
                }
            })
            break;
        case "upvoted":
            includePath+="upvoted"
            sortingActiveItem.upvoted = "active item"
            User.findById(req.user._id).populate('upvotedGratitude').exec(function(err, userGrat) {
                if (err) {
                    console.log(err)
                } else {
                    res.render('user',{sortingActiveItem:sortingActiveItem,userGrat:userGrat})
                }
            })
            break;
        case "favorites":
            includePath+="favorites"
            sortingActiveItem.favorites = "active item"
            User.findById(req.user._id).populate('favoriteGratitude').exec(function(err, userGrat) {
                if (err) {
                    console.log(err)
                } else {
                    res.render('user',{sortingActiveItem:sortingActiveItem,userGrat:userGrat})
                }
            })
            break;
    }

})
// Gratitude.find({}).sort({ created: 'desc' }).exec(function(err,gratitudes){
//     if(err){
//         console.log("descension failed")
//     }else{
//         res.render('sorted',{gratitudes:gratitudes, title:"Gratitudes by Date Descending", sortingActiveItem:sortingActiveItem,isLoggedIn:isLoggedIn})
//     }
// });

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    console.log("something went terribly wrong");
    res.redirect("login")
}

module.exports = router;
