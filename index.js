const express = require("express")
const app  = require("express")();
const port = process.env.PORT || 3040;
const cors = require("cors"); // allow specific domain to connect to server.
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Parser mean convert format to json
const path = require('path');
require("dotenv").config();
// =============== BODY PARSER SETTINGS =====================
//handle react rendering
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// =============== DATABASE CONNECTION ======================
mongoose.set("useCreateIndex", true);
async function connecting(){
    try{
        await mongoose.connect(process.env.MONGO, { useUnifiedTopology:true, useNewUrlParser: true });
        console.log("Connected to the DB");
    } 
    catch(error){
    	console.log("ERROR: Seems like your DB is not running, please start it up !!!");
    }
};
 connecting();
// =============== CORS =====================================
app.use(cors());
// =============== ROUTES ===================================
app.use("/users"   , require("./routes/users.routes"));
app.use("/posts"   , require("./routes/posts.routes"));
app.use("/comments", require("./routes/comments.routes"));
// =============== START SERVER =============================
app.listen(port, () => {
	console.log(`server listening on port ${port}`);
});