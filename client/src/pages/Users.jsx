import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { URL, getAuthToken } from "../config";
//===================================================================================================
function Users(props) {
	const [blogUsers, setBlogUsers] = useState([]);
	const [loading  , setLoading  ] = useState(true);
	const [message  , setMessage  ] = useState({ success:null, message:null });
	
	const getAllUsers = useCallback( async () => { // or pass the function inside the useEffect
		try{
			const response = await axios.get(`${URL}/users/getusers`, {headers:{authorization:getAuthToken()}});
			const { ok,data,message } = response.data;
			if(!ok){
				setLoading(false);
				setMessage({ success:false, message:message });
			}else{
				setLoading(false);
				setBlogUsers(data.users);// data.users not data
				setMessage({ success:true, message:message.message });
			};
		}
		catch(e){
			console.log(message)// why get error message? 'message' is assigned a value but never used
			setLoading(false);
			setMessage({ success:false, message:"Try again!" });
		}
	}, [setMessage,setBlogUsers,message] );

	const removeClicked = async (userId) => {
		const confirmed = window.confirm("Are you sure to remove this user?");
		if(!confirmed)
			return;
		try{
			const response = await axios.delete(`${URL}/users/delete/${userId}`, {headers:{authorization:getAuthToken()}});
			const { ok,data,message } = response.data;
			if(!ok){
				setLoading(false);
				setMessage({ success:false, message: message });
			}else{
				setLoading(false);
				setMessage({ success:true, message:message });
				const deletedUserId = data.findUser._id;
				const newUsers = blogUsers.filter(user=>deletedUserId!==user._id);
				console.log(newUsers,deletedUserId)
				setBlogUsers(newUsers);
			};
		}
		catch(e){
			setLoading(false);
			setMessage({ success:false, message: "Try again!" });
		}
	};
 	
    function toUserPosts(path,userId,username) {
		props.history.push({
			pathname: path,
			state: { userId:userId, username:username }
		});
	};
	
    useEffect( ()=>{
		getAllUsers();
	}, [] );
	
	return <div className="users">
		<h1>Blog Users</h1>

		{
			loading ? <h2>Loading...</h2> : 
				blogUsers.map((item,index)=>{
					return <div className="users-box" key={index}>
						<p>Username: {item.username}</p>
						<p>E-mail: {item.email}</p>
						{item.admin ? <p>Admin User</p> : null} {/*item.admin ? "Yes" : "No"*/}
						{item.admin ? null :<button onClick={ ()=>toUserPosts("/userposts",item._id,item.username) }>User Posts</button>}
						{item.admin ? null :<button onClick={ ()=>removeClicked(item._id) }>Remove User</button>}
					</div>
				})
		}

		</div>
};
//===================================================================================================
export default Users;