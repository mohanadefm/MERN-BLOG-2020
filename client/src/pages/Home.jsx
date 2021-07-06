import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL, getAuthToken } from "../config";
import logo from "../logo.svg";
//===================================================================================================
function Home(props) {
	const [posts   , setPosts   ] = useState([]);
	const [sortType, setSortType] = useState("descending"); //descending or ascending    
	const [loading , setLoading ] = useState(true);
	const [message , setMessage ] = useState({ success:null, message:null });
    
    useEffect( ()=>{
		const getAllPosts = async () => {
		try{
			const response = await axios.get(`${URL}/posts?sort=${sortType}`);
			const { ok,data,message } = response.data;
			if(!ok){
				setLoading(false);
				setMessage({ success:false, message:message });
			}else{
				setLoading(false);
				setMessage({ success:true, message:message });
				setPosts(data.posts);
			};
		}
		catch(e){
			setLoading(false);
			setMessage({ success:false, message:"Try again!" });
		}
    };
    getAllPosts();
	}, [sortType] );
    
    const addComment = async (commentBody) => {
    	if(!props.user){
			alert("Login to comment!");
			return;         
		};
    	if(commentBody.comment === ""){
    		alert("Please insert a comment!");
    		return;
    	};
        try{
			const response = await axios.post(`${URL}/comments`,{post_id:commentBody.postId,body:commentBody.comment},  {headers:{ authorization:getAuthToken()}});
			const { ok,data,message } = response.data;
			if(!ok){
				setLoading(false);
				setMessage({ success:false, message:message });
			}else{
				setLoading(false);
				setMessage({ success:true, message:message });
				let newComment = data.comment;
				newComment.user = props.user;
				const newPosts = posts.map(post=>{
					if(post._id === commentBody.postId){
						post.comments = [...post.comments,newComment];
						return post;
					};
					return post;
				});
				setPosts(newPosts);
			};
		}
		catch(e){
			setLoading(false);
			setMessage({ success:false, message:"Try again!" });
		}
    };
    
	const deletePost = async (item) => {
		const confirmed = window.confirm(`Are you sure to delete (${item.title} post)?`);
		if(!confirmed)
			return;
		try{
			const response = await axios.delete(`${URL}/posts/${item._id}`, {headers:{authorization:getAuthToken()}});
			const { ok,message } = response.data;
			if(!ok){
				setLoading(false);
				setMessage({ success:false, message:message });
			}else{				
				setLoading(false);
				setMessage({ success:true, message:message });
				const newPosts = posts.filter(post=>post._id!==item._id)
			 	setPosts(newPosts);
			};
		}
		catch(e){
			setLoading(false);
			setMessage({ success:false, message:"Try again!" });
		}
	};
	
	const deleteComment = async (comment) => {
		try{
			const response = await axios.delete(`${URL}/comments/${comment._id}`, {headers:{authorization:getAuthToken()}});
			const { ok,message,data } = response.data;
			if(!ok){
				setLoading(false);
				setMessage({ success:false, message:message });
			}else{
				setLoading(false);
				setMessage({ success:true, message:message });
				const deletedCommentId = data.comment._id;
				const newPosts = posts.map(post=>{
					if(post._id === comment.post){
                       const comentsAfterDeleting = post.comments.filter(comment=>deletedCommentId !== comment._id);
                       post.comments = comentsAfterDeleting;
					};
					return post;
				});
				setPosts(newPosts);
			};
		}
		catch(e){
			setLoading(false);
			setMessage({ success:false, message:"Try again!" });
		}
	};
		
	const editPost = async (postId,newPost) => {
		if(newPost.post === "" || newPost.title === "")
			return alert("Please enter a valid text!");
        try{
			const response = await axios.put(`${URL}/posts/${postId}`, {title:newPost.title, post:newPost.post}, {headers:{authorization:getAuthToken()}} );
			const { ok,data,message } = response.data;
			if(!ok){
				alert(message);
			}else{
				const newPost ={ title:data.post.title, post:data.post.post};
				const newPosts = posts.map(post=>{
				   	if(postId === post._id){
	                  return {
	                  	...post,
	                  	...newPost
	                  }
				   	};
				   	return post;
			   });
			 	setPosts(newPosts);
			};
		}
		catch(e){
			alert("Please try again!");
		}
	};
	
	return <div className="home">
	    <img src={logo} className="App-logo" alt="blog" />
		<h1>{props.user ? `Welcome back (${props.user.username}) to Mohanad Blog` : "Welcome to Mohanad Blog"}</h1>
        
        <div className="selectOption">
			<label htmlFor="sorting-date">Sorting by </label>
			<select id="sorting-date" onChange={e=>setSortType(e.target.value)}>
			  <option value="descending">descending</option>
			  <option value="ascending" >ascending</option>
			</select>
		</div>

		{
			loading ? <h2>Loading...</h2> : 
          		!message.success ? <h3>{message.message}</h3> :
          			posts.length === 0 ? <h2>There are no posts.</h2> :
		              	posts.map((item,key)=>{
			              	return <div className="posts-one-post" key={key}>
			              		<OnePost item={item} deletePost={deletePost} editPost={editPost} props={props}/>
								<div className="posts-comments">
									<OnePostComments postId={item._id} comments={item.comments} deleteComment={deleteComment} props={props} addComment={addComment} loading={loading} message={message} />
								</div>
							</div>
		              	})
		}
	</div>
};
//===================================================================================================
// Why we made another function?
function OnePost({item,deletePost,editPost,props}) {
	const [status  , setStatus  ] = useState("Edit");
	const [newTitle, setNewTitle] = useState(item.title);
	const [newPost , setNewPost ] = useState(item.post);
	
	const onUpdatePost = async (postId,newPost) => {
		if(status === "Edit"){
			setStatus("Save"); 
		}else{
			setStatus("Edit");
			editPost(postId,newPost);
		};
	};
  	
	return <div className="onepost">
		{
			props.user === null ? null : 
				!props.user.admin ? null : 
					<React.Fragment>
						<button onClick={()=>{deletePost(item)}}>Delete</button>
						<button onClick={()=>{onUpdatePost(item._id,{title:newTitle,post:newPost})}}>{status}</button>
					</React.Fragment>
		}

		{
			status === "Edit" ? <h3>{item.title}</h3> :
				<input value={newTitle} onChange={({target:{value}})=>setNewTitle(value)}></input>
		}

    	<h4>Posted by: {item.user? item.user.username : "Guest"}</h4>
		<h4>Publish date: {new Date(item.date||new Date()).toLocaleDateString()}</h4>
		
		{
			status === "Edit" ? <p>{item.post}</p> :
				<textarea value={newPost} onChange={({target:{value}})=>setNewPost(value)}></textarea>
		}
	</div>
};
//===================================================================================================
function OnePostComments({postId,comments,addComment,loading,message,props,deleteComment}) {
	const [comment , setComment] = useState("");
	
	return <div className="OnePostComments" key={postId}>
		<h4>Comments:</h4>

		{
			(comments.length === 0)? <p>There are no comments.</p> : 
              	comments.map((item,key)=>{
	              	return <div className="OnePostComments-lists" key={key}>
	              		{
	              			(props.user === null)? null :
								(props.user.admin)? <button onClick={()=>{deleteComment(item)}}>Delete</button> : null
						}
		              	<p>- {item.body}</p>
		              	<p id="p2">
			              	<span>User: {item.user? item.user.username : "Guest"} </span>
							<span>Date: {item.date}</span>
						</p>
					</div>
              	})
		}

		<div style={{"width": "95%"}}>
			<input onChange={ (e)=>setComment(e.target.value) } value={comment} placeholder="Comment..."/>
			<button onClick={ ()=>{addComment({ postId:postId, comment:comment }); setComment("")}} disabled={loading}>Add comment</button>
			<br/>
		  	{ (!message.success)? <p>{message.message}</p> : null }
		</div>
		
	</div>
}
//===================================================================================================
export default Home;
