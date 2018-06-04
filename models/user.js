var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")

var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: String,
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, required:true},
    isAdmin: { type: Boolean, default: false },
    favoriteComment:[
        {
            id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
            },
            date: {type: Date, default: Date.now}
        }
    ] ,
    upvotedComment:[
        {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            },
            date: {type: Date, default: Date.now}
        }
    ],
    downVotedComment:[
        {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            },
            date: {type: Date, default: Date.now}
        }
    ],
    favoriteGratitude:[
        {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Gratitude"
            },
            date: {type: Date, default: Date.now}
        }
    ] ,
    upvotedGratitude:[
        {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Gratitude"
            },
            date: {type: Date, default: Date.now}
        }
    ],
    downvotedGratitude:[
        {
            id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Gratitude"
            },
            date: {type: Date, default: Date.now}
        }
    ]
    })

UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model("User", UserSchema)
