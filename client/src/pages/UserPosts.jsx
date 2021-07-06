import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { URL, getAuthToken } from "../config";
//===================================================================================================
function UserPosts(props) {
	const [posts  , setPosts  ] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState({ success:null, message:null });
	
	const userPosts = useCallback(async () => {
			const passedUserId =  props.history.location.state.userId;
			if(!passedUserId) 
				return alert("User id is not existed!");
			try{
				const response = await axios.get(`${URL}/posts/${passedUserId}`, {headers:{authorization:getAuthToken()}});
				const { ok,data,message } = response.data;
				if(!ok){
					setLoading(false);
					setMessage({ success:false, message:message });
				}else{
					setLoading(false);
					setMessage({ success:true, message:message });
					setPosts(data.posts);
				}
			}
			catch(e){
				setLoading(false);
				setMessage({ success:false, message:"Try again!" });
			}
	}, [setMessage,setPosts,message,props.history.location.state.userId]);

	useEffect(()=>{
		userPosts();
	}, []);
	
	function goBackToUsers(path) {
    	props.history.push(path);
	};
    
    return <div className="userPosts">
    	<button onClick={ ()=>goBackToUsers("/users") }>Go Back</button>
    	<h1>{props.history.location.state.username} Posts</h1>

	    {
	    	loading ? <h2>Loading...</h2> :
		    	(posts.length === 0) ? <h2>There are no posts.</h2> :
					posts.map((item,index)=>{
						return <div className="userPosts-box" key={index}>
							<h3>{item.title}</h3>
							<h5>Publish Date: {new Date(item.date||new Date()).toLocaleDateString()}</h5>
							<p>{item.post}</p>
							<div className="userPosts-comments">
								<h4>Comments:</h4>
								{	item.comments.length === 0 ? <p>There are no comments.</p> :
									item.comments.map( (item,index)=>{
										return <div key={index}>
										<ul>
											<li><span>{item.body} - </span>
											<span>By: {item.user? item.user.username : "Guest"}</span></li>
										</ul>
										</div>
									} )
								}
							</div>
						</div>
					})
		}

    </div>
};
//===================================================================================================
export default UserPosts;