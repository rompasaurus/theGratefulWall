//import and initialize npm frameworks 
//Body parser allows for the parsing of crud commands pulling the body data of the url requested
var bodyParser              = require("body-parser"),
    //mongoose interfaces with mongoDB and allows for schema creation and db manipulation
    mongoose                = require("mongoose"),
    //express handles the http server and requests via easy to use notation
    express                 = require("express"),
    //app initilizes the express frameworks and is the variable in which all express commands are acted upon
    app                     = express(),
    // user db and schema information
    User                    = require("./models/user"),
    //authentication framework
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    Gratitude               = require("./models/gratitudeSchema"),
    methodOverride          = require("method-override");
    seedDB                  = require("./seed");
    flash                   = require("connect-flash");
    dotenv                  = require('dotenv');
    GoogleStrategy          = require( 'passport-google-oauth2' ).Strategy;
    FacebookStrategy        = require('passport-facebook');

//seedDB();
//import routes
app.use(flash());
app.enable('trust proxy');
//Make sure to place a .env in the root folder and apply all the values needed anywhere in the code with process.env ie
dotenv.config();
var auth = require("./routes/auth"),
    gratitude = require("./routes/gratitude"),
    landing = require("./routes/landing"),
    sorted = require("./routes/sorted");
    user = require("./routes/user");
    comment = require("./routes/comment");
    password = require("./routes/password");
//Connect to DB (DB exists locally for now) named the_grateful_wall_gratitudes if db non-existant it will be created
//this string used connection env vars provided from the  herokus site need to set that up again
//mongoose.connect("mongodb://tgw:"+process.env.DPASS+"@ds245150.mlab.com:45150/the_grateful_wall_gratitudes_v2", { useNewUrlParser: true });
//mongoose.connect("mongodb+srv://TheGratefulWallClusterAdmin:Y05qmCkFQswyhVBF@thegratefulwallcluster.rtikqcl.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true });
mongoose.connect(process.env.MONGCONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true});


//establishes ejs as the primary format the will be used to present web data allowing the .ejs to be excluded when rendering
app.set("view engine", "ejs");
//establishes the public folder as a root folder this will contain css stylesheets
app.use(express.static("public"));
//Boiler initializaes formats for bodyparser
app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: process.env.SECRET
    //resave: false,
    //saveUninitialized: false,
    //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
//initializes method overide to allow for put and delete requests
app.use(methodOverride("_method"));
//initilize User as auth db and establishes encryption serialization methods
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Google OAUTH Passport COnfig
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
    }, 
    function(request, accessToken, refreshToken, profile, done) {
        console.log("Profile Authed : ", profile)
        User.findOrCreate({
            username: profile.displayName,
            email: profile.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
            googleId: profile.id
        }, function (err, user) {
          return done(err, user);
        });
      }
));

//Facebook OAUTH Config
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log("Profile Authed : ", profile)
    User.findOrCreate({ 
      username: profile.displayName,
      email: profile.email,
      firstName: profile.given_name,
      lastName: profile.family_name,
      facebookId: profile.id 
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.use(function(req,res,next) {
    res.locals.currentUser=req.user;
    next();
})
app.use(function(request, response, next) {

    if (process.env.NODE_ENV != 'development' && !request.secure) {
       return response.redirect("https://" + request.headers.host + request.url);
    }

    next();
})

//Initialize routes
app.use(auth);
app.use(gratitude);
app.use(sorted);
app.use(landing);
app.use(user);
app.use(comment);
app.use(password);

///uncomment to use as app on heroku
app.listen(process.env.PORT||8080, process.env.IP, function(){
//app.listen(8080, function(){
    console.log("Grateful wall has started and is listening on port " + (process.env.PORT || "8080")+ " and IP: " + process.env.IP);
});
