var mongoose = require("mongoose");
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

module.exports = Gratitude;