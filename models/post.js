const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const anonymousPostSchema = new Schema({
    content: { type: String, required: true },
    authorId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    visibility: { type: Boolean, default: true },
    postCreationDate: { type: Date, default: Date.now }
})

anonymousPostSchema.virtual("date_formatted").get(function () {
    return DateTime.fromJSDate(this.postCreationDate).toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model("AnonymousPost", anonymousPostSchema)
