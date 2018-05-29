//import and initialize npm frameworks 
//Body parser allows for the parsing of crud commands pulling the body data of the url requested
var bodyParser  = require("body-parser"),
//mongoose interfaces with mongoDB and allows for schema creation and db manipulation
    mongoose    = require("mongoose"),
//express handles the http server and requests via easy to use notation
    express     = require("express"),
//app initilizes the express frameworks and is the variable in which all express commands are acted upon
    app         = express(),
    User        = require("./models/user"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Gratitude   = require("./models/gratitudeSchema");
//Connect to DB (DB exists locally for now) named the_grateful_wall_gratitudes if db non-existant it will be created
mongoose.connect("mongodb://tgw:tgwauth@ds121960.mlab.com:21960/the_grateful_wall_gratitudes");
//establishes ejs as the primary format the will be used to present web data allowing the .ejs to be excluded when rendering
app.set("view engine", "ejs");
//establishes the public folder as a root folder this will contain css stysheets
app.use(express.static("public"));
//Boiler initializaes formats for bodyparser
app.use(bodyParser.urlencoded({extended: true}));

//import passport library and extend to app functionality
app.use(passport.initialize())
app.use(passport.session())
//initilize User as auth db and establishes encryption serialization methods
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use(require("express-session")({
    secret: "this website sucks",
    resave: false,
    saveUninitialized: false
}))

//Test Data adding with error catching
// Gratitude.create(
//     {
//     description:"wet shits",
//     comments: "This post blows ass, go die",
//     name: "Dick Buttlicker"
//     }, function(err, gratitude){
//         if(err){
//             console.log("I cant add this shit something is wrong");
//         }else{
//             console.log("new gratitude added");
//             console.log(gratitude);
//         }
//     })


app.get("/new", function (req, res) {
    res.render("new");
});

//About Page
app.get("/about", function (req, res) {
    res.render("about");
});
//Adds gratitude submitted via new form page 
app.post("/", function(req,res){
    Gratitude.create(req.body.gratitude, function(err,newGratitude){
        if(err){
            res.render("new");
        }else{
            res.redirect("/");
        }
    });
});
//Show Gratitude
app.get("/gratitude/:id", function(req, res) {
    Gratitude.findById(req.params.id, function(err, foundGratitude) {
        if(err){
            console("aint no gratitude information")
        }else{
            res.render("showGratitude", {gratitude:foundGratitude})
        }
    })
})
//post gratitude comment
app.post("/gratitude/:id", function(req, res) {
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

//upvote and downvote requests
app.post("/upvote/:id", function(req, res) {
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

app.post("/downvote/:id", function(req, res) {
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
//Sorted Views
app.get("/sort/:id", function(req, res) {
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

//presents the landing page for the root of the site
app.get('/',function(req,res){
    Gratitude.find({}, function(err,gratitudes){
        if(err){
            console.log("we aint found shit in no db");
        }else{
        res.render('landing',{gratitudes:gratitudes,title:"Today's Top Gratitudes"});
        }
    })
});
app.get("/user",isLoggedIn, function(req,res){
    res.render("user")
})
//Authentication Logic
//Signup Form
//Signup form
app.get("/register", function(req,res){
    res.render("register")
})
//handle user signup
app.post("/register", function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err,user){
        if(err){
            console.log(err)
            res.render('register')
        }else{
            console.log(user + " Succesfully registered")
            passport.authenticate("local")(req,res, function(){
                res.redirect("/user")
            })
        }
    })
})
//Login Routes
//render login form
app.get("/login", function(req,res){
    res.render("login")
})
//login Logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/login"
}), function(req,res){

})

//logout
app.get("/logout", function(req,res){
    req.logout()
    res.redirect("/")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()        
    }
    console.log("something went terribly wrong")
    res.redirect("login")
}

//start http server and listen on c9 defaul ip and port
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Grateful wall has started and is listening");
});