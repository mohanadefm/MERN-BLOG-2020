const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: { type:String, required:true },
    post : { type:String, required:true },
    date : { type:Date  , required:true, default:Date.now },
	user : { type:mongoose.Schema.Types.ObjectId, ref:"User" }
}, { versionKey:false });

module.exports = mongoose.model("Post", postSchema);