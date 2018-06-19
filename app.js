//import and initialize npm frameworks 
//Body parser allows for the parsing of crud commands pulling the body data of the url requested
var bodyParser  = require("body-parser"),
    //mongoose interfaces with mongoDB and allows for schema creation and db manipulation
    mongoose    = require("mongoose"),
    //express handles the http server and requests via easy to use notation
    express     = require("express"),
    //app initilizes the express frameworks and is the variable in which all express commands are acted upon
    app         = express(),
    // user db and schema information
    User        = require("./models/user"),
    //authentication framework
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Gratitude   = require("./models/gratitudeSchema"),
    methodOverride = require("method-override");

//import routes
var auth = require("./routes/auth"),
    gratitude = require("./routes/gratitude"),
    landing = require("./routes/landing"),
    sorted = require("./routes/sorted");
    user = require("./routes/user");
    comment = require("./routes/comment");
//Connect to DB (DB exists locally for now) named the_grateful_wall_gratitudes if db non-existant it will be created
mongoose.connect("mongodb://tgw:tgwauth123@ds245150.mlab.com:45150/the_grateful_wall_gratitudes_v2");
//establishes ejs as the primary format the will be used to present web data allowing the .ejs to be excluded when rendering
app.set("view engine", "ejs");
//establishes the public folder as a root folder this will contain css stylesheets
app.use(express.static("public"));
//Boiler initializaes formats for bodyparser
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "this website sucks",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//initializes method overide to allow for put and delete requests
app.use(methodOverride("_method"));
//initilize User as auth db and establishes encryption serialization methods
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()        
    }
    console.log("something went terribly wrong");
    res.redirect("login")
}
app.use(function(req,res,next) {
    res.locals.currentUser=req.user;
    next();
})

//Initialize routes
app.use(auth);
app.use(gratitude);
app.use(sorted);
app.use(landing);
app.use(user);
app.use(comment);

///uncomment to use as app on heroku
app.listen(process.env.PORT, process.env.IP, function(){
//app.listen(8080, function(){
    console.log("Grateful wall has started and is listening on port " + process.env.PORT + "and IP " + process.env.IP);
});