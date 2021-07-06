const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    body: { type:String, required:true },
    date: { type:Date  , required:true, default:Date.now }, // Why don't insert date inside body? because body type is String
    post: { type:mongoose.Schema.Types.ObjectId, ref:"Post" },
    user: { type:mongoose.Schema.Types.ObjectId, ref:"User" }
}, { versionKey:false });

module.exports = mongoose.model("Comment", commentSchema);