const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type:String,  required:true },
    email   : { type:String,  required:true, unique:true }, // meaning of unique? unique: can"t repeated
    password: { type:String,  required:true },
    admin   : { type:Boolean, required:true, default:false }
}, { versionKey:false });

module.exports = mongoose.model("User", userSchema);
// module.exports (for Node.js) = (is equal to) = export default (ES6-for React)