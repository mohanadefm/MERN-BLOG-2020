const User        = require("../models/users.models");
const Post        = require("../models/posts.models");
const Comment     = require("../models/comments.models");
const argon2      = require("argon2");
const jwt         = require("jsonwebtoken");
const validator   = require("validator");
const jwt_secret  = process.env.JWT_SECRET;
const {sendEmail} = require("../utilies");
//===================================================================================================
// The client is sending this body object in register:
//  {
//     username:  form.username,
//     email:     form.email,
//     password:  form.password,
//     password2: form.password2
//  }
//===================================================================================================
const register = async (req,res) => {
	const { username,email,password,password2 } = req.body; // Do not add (admin), because user cannot choose himself as an admin.
	
	if (!email || !password || !password2)
		return res.json({ ok:false, message:"All fields are required!" });
	if (!validator.isEmail(email)) // Validator function meaning the form (arrange) of email (xxxx@xxx.com).
		return res.json({ ok:false, message:"Please provide a valid email!" });
	if (password !== password2)
		return res.json({ ok:false, message:"Passwords must match!" });
	
	try {
		const user = await User.findOne({ email:email }); // find one by condition: eamil in User = email in req.body
		if (user)
			return res.json({ ok:false, message:"E-mail is already token!" }); // why we put user in (value)? meaning is it existed (true).
		const hashedPassword = await argon2.hash(password); // To encrypt the password.
		const newUser = { // Is this the form that we want to create from schema? yes
			username: username||email,
			email,
			password: hashedPassword
		};
		sendEmail(newUser.email, newUser.username)
		const createdUser = await User.create(newUser); // const newUser in up line.
		return res.json({ ok:true, message:`Successfully registered ${createdUser.username}`, data:{createdUser} }); // we make an object up in line 40
	} 
	catch(e){
		console.log(e)
		return res.json({ ok:false, message:"Server Error!" });
	}
};
//===================================================================================================
// The client is sending this body object in login:
//  {
//     email:     form.email,
//     password:  form.password
//  }
//===================================================================================================
const login = async (req,res) => {
	let { email,password } = req.body;
	email = email.toLowerCase();
	
	if(!email || !password)
		return res.json({ ok:false, message:"All fields are required!" });
	if(!validator.isEmail(email)) 
		return res.json({ ok:false, message:"Invalid email provided!" });
	
	try {
		const user = await User.findOne({ email }).lean();
		if(!user)
			return res.json({ ok:false, message:"E-mail is not existed!" });
		const match = await argon2.verify(user.password, password); // To check if password match
		if(!match)
			return res.json({ ok:false, message:"Wrong password!" });
		delete user.password; // We delete password because we don"t need it in front-end.
		const token = jwt.sign(user, jwt_secret, { expiresIn:  "30 days" });
		return res.json({ ok:true, message:`Successfully logged in ${user.username}`, data:{token,user} });
	}
	catch(e){
		console.log(e);
		return res.send({ ok:false, message:'Server Error!' });
	}
}
//===================================================================================================
const getAllUsers = async (req,res) => {
	const user = req.user;

	if(!user.admin) 
		return res.send({ ok:false, message:'Access Denied!' });

	try {
			const users = await User.find({}).lean();
			const mappedUsers = users.map( ({password,...rest}) => {
				return rest;
			});
			return res.json({ ok:true, message:`Successfully recieved users!`, data:{users:mappedUsers} });
	} 
	catch(e){
		return res.json({ ok:false, message:"Server Error!" });
	}
};
//===================================================================================================
const updateUsername = async (req, res) => {
	const {username} = req.body;
	const {_id}      = req.user;
	
	if(Object.keys(req.body).length === 0)
		return res.json({ ok:false, message:"Please insert a valid data!" });
	if(username.length < 4) 
		return res.json({ ok:false, message:'Use at least 3 letters!' });

	try {
		const user = await User.findOne({ _id });
		if(user.username === username) 
			return res.json({ ok:false, message:'Please use a different username!' });
		if(!user) 
			return res.json({ ok:false, message:"User is not existed!" });

		const newUser = { username:username };
		const userUpdated = await User.updateOne({ _id,_id }, newUser); // (or use) === await User.updateOne({ _id:_id }, {username:username})
		if(userUpdated.n === 0)
			return res.send({ ok:false, message:"User is not existed!" });
		return res.json({ ok:true, message:"Successfully updated!"});
	} 
	catch(e){
		return res.json({ ok:false, message:"Server Error!" });
	}
};
//===================================================================================================
const updatePassword = async (req,res) => {
	const {password,password2} = req.body;
	const {_id}                = req.user;
	
	if(Object.keys(req.body).length === 0) 
		return res.json({ ok:false, message:"Please insert a valid data!" });
	if(password !== password2)             
		return res.json({ ok:false, message:"Passwords must match!" });
	if(password.length === 0 &&  password2.length === 0)  
		return res.json({ ok:false, message:'You can not use an empty password!' });
	
	try {
		const user = await User.findOne({ _id });
		if(!user) 
			return res.json({ ok:false, message:"User is not exist!" });
		const match = await argon2.verify(user.password,password);
		if(match) 
			return res.send({ ok:false, message:'Please insert a new password!' });
		const hashedPassword = await argon2.hash(password);
		const newUser = {
			password: hashedPassword
		};
		const userUpdated = await User.updateOne({_id,_id},newUser);
		if(userUpdated.n === 0) 
			return res.send({ ok:false, message:"User is not existed!" });
		return res.json({ ok: true, message:`Successfully updated` });
	} 
	catch(e){
		return res.json({ ok:false, message:"Server Error!" });
	}
};
//===================================================================================================
const deleteUser = async (req,res) => {
	const {_id}  = req.params;
	const {user} = req; 

	try {
		if(!user.admin)
			return res.send({ ok:false, message:"Access Denied!" });
		if(String(user._id)===_id)
			return res.send({ ok:false, message:"You can not delete yourself!" });
		const findUser = await User.findOne({ _id });
		if(!findUser) 
			return res.send({ ok:false, message:"User is not existed!" });
		const removed = await User.findOneAndDelete({ _id });
		if(removed.n === 0)
			return res.send({ ok:false, message:"User is not existed!" });

		const removedUserPosts = await Post.deleteMany({ user:_id }); // to delete posts
		const removedUserComments = await Comment.deleteMany({ user:_id }); // to delete comments
		
		return res.send({ ok:true, message:"Successfully deleted!", data:{findUser} });// data:{user:{_id:_id}} });
	}
	catch(e){
		return res.send({ ok:false, message:"Server Error!" });
	}
};
//===================================================================================================
// const verify_token = (req, res) => {
//   console.log(req.headers.authorization);
//   const token = req.headers.authorization;
//   jwt.verify(token, jwt_secret, (err, succ) => {
//     err
//       ? res.json({ ok: false, message: "something went wrong" })
//       : res.json({ ok: true, succ });
//   });
// };
//===================================================================================================
module.exports = { register, login, getAllUsers, updateUsername, updatePassword, deleteUser };