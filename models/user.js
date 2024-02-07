const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    memberShipStatus: { type: Boolean, default: false },
    registrationDate: { type: Date, default: Date.now },
})

userSchema.virtual("date").get(function () {
    return DateTime.fromJSDate(this.registrationDate).toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model("User", userSchema);