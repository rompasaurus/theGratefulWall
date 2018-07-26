var express = require("express"),
    Gratitude = require("../models/gratitudeSchema"),
    passport =  require("passport"),
    router = express.Router();
//Sorted Views
router.get("/sort/:id&:page", function(req, res, next) {
    var perPage = 10;
    var page = req.params.page;
    //var pages = Math.ceil(gratitude.length/perPage)
    var id = req.params.id;
    var      sortingActiveItem={
        today:"item",
        dateA:"item",
        dateD:"item",
        upvote:"item",
        downvote:"item",
        popularity:"item"
    }
    var isLoggedIn = req.isAuthenticated();

    switch(req.params.id){
        case "dateDescend":
            sortingActiveItem.dateD = "active item"
            Gratitude.find({}).sort({ created: 'desc' }).skip((perPage * page) - perPage)
                .limit(perPage).exec(function(err,gratitudes){
                    Gratitude.count().exec(function(err, count) {
                        if (err) return next(err)
                        res.render('sorted', {
                            gratitudes: gratitudes,
                            title: "Gratitudes by Date Descending",
                            sortingActiveItem: sortingActiveItem,
                            isLoggedIn: isLoggedIn,
                            current: page,
                            pages: Math.ceil(count / perPage),
                            id: id
                        })
                });
            });
            break;
        case "dateAscend":
            sortingActiveItem.dateA = "active item"
            Gratitude.find({}).sort({ created: 'asc' }).skip((perPage * page) - perPage)
                .limit(perPage).exec(function(err,gratitudes){
                Gratitude.count().exec(function(err, count) {
                    if (err) return next(err)
                    res.render('sorted', {
                        gratitudes: gratitudes,
                        title:"Gratitudes By Date Ascending",
                        sortingActiveItem: sortingActiveItem,
                        isLoggedIn: isLoggedIn,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        id: id
                    })
                });
            });
            break;
        case "downvote":
            sortingActiveItem.downvote = "active item"
            Gratitude.find({}).sort({ downvote: -1 }).skip((perPage * page) - perPage)
                .limit(perPage).exec(function(err,gratitudes){
                Gratitude.count().exec(function(err, count) {
                    if (err) return next(err)
                    res.render('sorted', {
                        gratitudes: gratitudes,
                        title:"Most Downvoted Gratitudes",
                        sortingActiveItem: sortingActiveItem,
                        isLoggedIn: isLoggedIn,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        id: id
                    })
                });
            });
            break;
        case "upvote":
            sortingActiveItem.upvote = "active item"
            Gratitude.find({}).sort({ upvote: -1 }).skip((perPage * page) - perPage)
                .limit(perPage).exec(function(err,gratitudes){
                Gratitude.count().exec(function(err, count) {
                    if (err) return next(err)
                    res.render('sorted', {
                        gratitudes: gratitudes,
                        title:"Most Upvoted Gratitudes",
                        sortingActiveItem: sortingActiveItem,
                        isLoggedIn: isLoggedIn,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        id: id
                    })
                });
            });
            break;
        case "today":
            sortingActiveItem.today = "active item"
            Gratitude.find({}).sort({ created: 'desc' }).skip((perPage * page) - perPage)
                .limit(perPage).exec(function(err,gratitudes){
                Gratitude.count().exec(function(err, count) {
                    if (err) return next(err)
                    res.render('sorted', {
                        gratitudes: gratitudes,
                        title:"Today's Top Gratitudes",
                        sortingActiveItem: sortingActiveItem,
                        isLoggedIn: isLoggedIn,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        id: id
                    })
                });
            });
            break;
        case "popular":
            sortingActiveItem.popularity = "active item"
            Gratitude.find({}).sort({ lastVote: -1, upvote: -1 }).skip((perPage * page) - perPage)
                .limit(perPage).exec(function(err,gratitudes){
                Gratitude.count().exec(function(err, count) {
                    if (err) return next(err)
                    res.render('sorted', {
                        gratitudes: gratitudes,
                        title:"Most Popular Gratitudes",
                        sortingActiveItem: sortingActiveItem,
                        isLoggedIn: isLoggedIn,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        id: id
                    })
                });
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