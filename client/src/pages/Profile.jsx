import React, { useState } from "react";
import axios from "axios";
import { URL, getAuthToken } from "../config";
//===================================================================================================
function Profile(props) {
	const [newUsername, setNewUsername] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [repeatPass , setRepeatPass ] = useState("");
	const [message    , setMessage    ] = useState({success:null, message:null});
	
	const saveNewUsername = async (data) => {
		if(newUsername.length === 0) 
			return alert("Please insert a valid username!");
		if(newUsername === props.user.username) // how to make it for password?
			return alert("You can not use same username!");
		try{
			const response = await axios.put(`${URL}/users/updateusername`, {username:data}, {headers:{authorization:getAuthToken()}});
			const { ok,message } = response.data;
			if(!ok){
				setMessage({ success:false, message:message });
			}else{
				setMessage({ success:true, message:"Successfully updated, logout to apply changes!" });
				setNewUsername("");
			};
		}
		catch(e){
			setMessage({ success:false, message:"Try again!" });
		}
	};
	
	const saveNewPassword = async (password) => {
		if(newPassword.length === 0 || repeatPass.length === 0) 
			return alert("Please insert a valid password!");
		if(newPassword !== repeatPass) 
			return alert("Passwords must match!");
		try{
			const response = await axios.put(`${URL}/users/updatepassword`, {password:newPassword, password2:repeatPass}, {headers:{authorization:getAuthToken()}});
			const { ok,message } = response.data;
			if(!ok){
				setMessage({ success:false, message:message });
			}else{
				setMessage({ success:true, message:"Successfully updated, logout to apply changes!" });
				setNewPassword("");
				setRepeatPass("");
			};
		}
		catch(e){
			setMessage({ success:false, message:"Try again!" });
		}
	};
	
	return <div className="profile">
		<h2>{props.user.username}</h2>	
		<h2>{props.user.email}</h2>

		<div className="profile-box">
			<div >
				<h3>Change username</h3>
				<input  onChange={ (e)=>setNewUsername(e.target.value) } value={newUsername} placeholder="Enter new username"/><br/>
				<button onClick={ ()=>saveNewUsername(newUsername) }>Save</button>
			</div>

			<div >
				<h3>Change password</h3>
				<input onChange={ (e)=>setNewPassword(e.target.value) } value={newPassword} placeholder="Enter new password"/><br/>
				<input onChange={ (e)=>setRepeatPass(e.target.value) } value={repeatPass} placeholder="Repeat new password"/><br/>
				<button onClick={ ()=>saveNewPassword(newPassword) }>Save</button>
			</div>

		</div>

		{ message.success && <p>{message.message}</p> }
		{ /*Is equal to ==> {message.success? <h2>{message.message} </h2>: null}*/ }
		
	</div>
};
//===================================================================================================
export default Profile;
