var mongoose = require("mongoose");
//DB SCHEMA and initialization
var commentSchema = new mongoose.Schema({
    comment: String,
    name: String,
    created: {type: Date, default: Date.now},
    upvote: {type: Number, default: 1},
    downvote: {type: Number, default: 0},
});
var Comment = mongoose.model("Gratitude",gratitudeSchema);

module.exports = Comment;