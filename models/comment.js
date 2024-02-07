const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "AnonymousPost", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    commentContent: { type: String, required: true },
    commentCreationDate: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Comments", commentSchema)