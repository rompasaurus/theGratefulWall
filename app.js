//import and initialize npm frameworks 
//Body parser allows for the parsing of crud commands pulling the body data of the url requested
var bodyParser  = require("body-parser"),
//mongoose interfaces with mongoDB and allows for schema creation and db manipulation
    mongoose    = require("mongoose"),
//express handles the http server and requests via easy to use notation
    express     = require("express"),
//app initilizes the express frameworks and is the variable in which all express commands are acted upon
    app         = express();
//Connect to DB (DB exists locally for now) named the_grateful_wall_gratitudes if db non-existant it will be created
mongoose.connect("mongodb://tgw:tgwauth@ds121960.mlab.com:21960/the_grateful_wall_gratitudes");
//establishes ejs as the primary format the will be used to present web data allowing the .ejs to be excluded when rendering
app.set("view engine", "ejs");
//establishes the public folder as a root folder this will contain css stysheets
app.use(express.static("public"));
//Boiler initializaes formats for bodyparser
app.use(bodyParser.urlencoded({extended: true}));

//DB SCHEMA and initialization
var gratitudeSchema = new mongoose.Schema({
    description: String,
    name: String,
    created: {type: Date, default: Date.now},
    lastVote: {type: Date, default: Date.now},
    upvote: {type: Number, default: 1},
    downvote: {type: Number, default: 0},
    comments: [String]
});
var Gratitude = mongoose.model("Gratitude",gratitudeSchema);

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

//presents the landing page for the root of the site
app.get("/new", function (req, res) {
    res.render("new");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.post("/upvote/:id", function(req, res) {
    Gratitude.findById(req.params.id, function(err, foundGratitude){
        if(err){
            console.log("cant find post to upvote");
        }else{
            foundGratitude.upvote++;           
            console.log("downvoted post" + foundGratitude);
            foundGratitude.save();
            res.redirect("/");
        }
    })
});

app.post("/downvote/:id", function(req, res) {
    Gratitude.findById(req.params.id, function(err, foundGratitude){
        if(err){
            console.log("cant find post to upvote");
        }else{
            foundGratitude.downvote++;
            console.log("downvoted post" + foundGratitude);
            foundGratitude.save();
            res.redirect("/");
        }
    })
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

app.get('/',function(req,res){
    Gratitude.find({}, function(err,gratitudes){
        if(err){
            console.log("we aint found shit in no db");
        }else{
        res.render('landing',{gratitudes:gratitudes});
        }
    })
});



//start http server and listen on c9 defaul ip and port
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Grateful wall has started and is listening");
});