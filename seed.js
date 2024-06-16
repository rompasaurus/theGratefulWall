var User        = require("./models/user"),
    Comment        = require("./models/commentSchema"),
    Gratitude        = require("./models/gratitudeSchema");
var users = [
    {email: "6fake@gmail.com", username:"Dick Buttlicker"},
    {email: "f7ake@gmail.com", username:"Debby Downer"},
    {email: "fak9sdae@gmail.com", username:"8Ricky Rickerson the third"},
    {email: "fassk9e@gmail.com", username:"Jalequa Jackson"},
    {email: "faske0@gmail.com", username:"Mike Hunt"},
    {email: "fakwfe4@gmail.com", username:"Haywood Jablowme"},
    {email: "fake@5gmail.com", username:"Phil Atio"},
    {email: "fake@g6mail.com", username:"Jen Nettles"},
    {email: "fakfdwe@gm7ail.com", username:"Hugh Janus"},
    {email: "fadfke@gma8il.com", username:"Iwana Dye"},
    {email: "fafdgke@gmai9l.com", username:"Mac"},
    {email: "fagke4@gmail.com", username:"Get-A-Job"},
    {email: "fak3e@gmail.com", username:"Boaty McBoatface"},
    {email: "fa2ke@gmail.com", username:"Liar"},
    {email: "f1afke@gmail.com", username:"You're-just-jealous"}
]
var data = [
    {
        description: "Wet Shits",
        name: {username: "Dick Buttlicker"},
    },
    {
        description: "The Waking Nightmare that is my life",
        name: {username: "Debby Downer"},
    },
    {
        description: "chronic back pain and indigestion",
        name: {username: "Ricky Rickerson the third"},
    },
    {
        description: "that random noise that only sounds when you least expect it and always while you are trying to sleep",
        name: {username: "Jalequa Jackson"},
    },
    {
        description: "the meat sweats",
        name: {username: "Mike Hunt"},
    },
    {
        description: "shitty ass coworkers",
        name: {username: "Haywood Jablowme"},
    },
    {
        description: "toothy blowjobs",
        name: {username: "Phil Atio"},
    },
    {
        description: "the voices in my head",
        name: {username: "Jen Nettles"},
    },
    {
        description: "the food stains on my shirt ",
        name: {username: "Hugh Janus"},
    },
    {
        description: "Crippling depression ",
        name: {username: "Iwana Dye"},
    },    {
        description: "Michael Shutting the Fuck Up",
        name: {username: "Get-A-Job"},
    },
    {
        description: "The Wind Under My Sails (backflaps)",
        name: {username: "Boaty McBoatface"},
    },
    {
        description: "Michael doing his damn job.",
        name: {username: "Liar"},
    },    {
        description: "Quit shitting on my shit, man.",
        name: {username: "You're-just-jealous"},
    },
    {
        description: "I am thankful for cheap asian hookers! $20 dollar longtime.!",
        name: {username: "Mac"},
    }
]

function seedDB(){
    //Remove all Gratitudes
    Gratitude.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed Gratitudes!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
            User.remove({}, function(err){
            //add a few gratitudes and users
                users.forEach(function(seed){
                    User.create(seed, function(err, Gratitudes){
                        if(err){
                            console.log(err)
                        } else {
                            console.log("added a user");
                        }
                    });
                    })
                data.forEach(function(seed){
                    Gratitude.create(seed, function(err, Gratitudes){
                        if(err){
                            console.log(err)
                        } else {
                            console.log("added a Gratitude");
                        }
                    });
                    })
                });
        });
    });
    //add a few comments
}
//seedDB();
module.exports = seedDB;