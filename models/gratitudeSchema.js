var mongoose = require("mongoose");
//DB SCHEMA and initialization
var gratitudeSchema = new mongoose.Schema({
    description: String,
    name: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },username: String
    },
    created: {type: Date, default: Date.now},
    lastVote: {type: Date, default: Date.now},
    upvote: {type: Number, default: 1},
    downvote: {type: Number, default: 0},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    favorite: {type: Number, default: 0}
});
var Gratitude = mongoose.model("Gratitude",gratitudeSchema);

module.exports = Gratitude;