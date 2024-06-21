var mongoose = require("mongoose")
var passportLocalMongoose = require("passport-local-mongoose")
var findOrCreate = require("mongoose-findorcreate");

var UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: String,
    firstName: String,
    lastName: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    googleId: String,
    email: {type: String, unique: [true, "email already registered"], required:true},
    isAdmin: { type: Boolean, default: false },
    submittedComment:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            date: {type: Date, default: Date.now}
        }
    ] ,
    submittedGratitude:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gratitude",
            date: {type: Date, default: Date.now}
        }
    ] ,
    favoriteComment:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            date: {type: Date, default: Date.now}
        }
    ] ,
    upvotedComment:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            date: {type: Date, default: Date.now}
        }
    ],
    downvotedComment:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            date: {type: Date, default: Date.now}
        }
    ],
    favoriteGratitude:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gratitude",
            date: {type: Date, default: Date.now}
        }
    ] ,
    upvotedGratitude:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gratitude",
            date: {type: Date, default: Date.now}
        }
    ],
    downvotedGratitude:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Gratitude",
            date: {type: Date, default: Date.now}
        }
    ]
    })

UserSchema.plugin(passportLocalMongoose)
UserSchema.plugin(findOrCreate);
module.exports = mongoose.model("User", UserSchema)
