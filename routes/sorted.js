var express = require("express"),
    Gratitude = require("../models/gratitudeSchema"),
    passport =  require("passport"),
    router = express.Router();
//Sorted Views
router.get("/sort/:id", function(req, res) {
    var      sortingActiveItem={
        today:"item",
        dateA:"item",
        dateD:"item",
        upvote:"item",
        downvote:"item",
        popularity:"item"
    }

    switch(req.params.id){
        case "dateDescend":
            sortingActiveItem.dateD = "active item"
            Gratitude.find({}).sort({ created: 'desc' }).exec(function(err,gratitudes){
                if(err){
                    console.log("descension failed")
                }else{
                    res.render('sorted',{gratitudes:gratitudes, title:"Gratitudes by Date Descending", sortingActiveItem:sortingActiveItem})
                }
            });
            break;
        case "dateAscend":
            sortingActiveItem.dateA = "active item"
            Gratitude.find({}).sort({ created: 'asc' }).exec(function(err,gratitudes){
                if(err){
                    console.log("naw man")
                }else{
                    res.render('sorted',{gratitudes:gratitudes, title:"Gratitudes By Date Ascending", sortingActiveItem:sortingActiveItem})
                }
            });
            break;
        case "downvote":
            sortingActiveItem.downvote = "active item"
            Gratitude.find({}).sort({ downvote: -1  }).exec(function(err,gratitudes){
                if(err){
                    console.log("naw man")
                }else{
                    res.render('sorted',{gratitudes:gratitudes, title:"Most Downvoted Gratitudes", sortingActiveItem:sortingActiveItem})
                }
            });
            break;
        case "upvote":
            sortingActiveItem.upvote = "active item"
            Gratitude.find({}).sort({ upvote: -1 }).exec(function(err,gratitudes){
                if(err){
                    console.log("naw man")
                }else{
                    res.render('sorted',{gratitudes:gratitudes, title:"Most Upvoted Gratitudes", sortingActiveItem:sortingActiveItem})
                }
            });
            break;
        case "today":
            sortingActiveItem.today = "active item"
            Gratitude.find({}).sort({ created: 'desc' }).exec(function(err,gratitudes){
                if(err){
                    console.log("naw man")
                }else{
                    res.render('sorted',{gratitudes:gratitudes, title:"Today's Top Gratitudes", sortingActiveItem:sortingActiveItem})
                }
            });
            break;
        case "popular":
            sortingActiveItem.popularity = "active item"
            Gratitude.find({}).sort({ lastVote: -1, upvote: -1 }).exec(function(err,gratitudes){
                if(err){
                    console.log("naw man")
                }else{
                    res.render('sorted',{gratitudes:gratitudes, title:"Most Popular Gratitudes", sortingActiveItem:sortingActiveItem})
                }
            });
            break;
    }
})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    console.log("something went terribly wrong");
    res.redirect("login")
}

module.exports = router;