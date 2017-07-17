var mongoose=require("mongoose");

var commentSchema = mongoose.Schema({
    text:String,
    author:String,
    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;