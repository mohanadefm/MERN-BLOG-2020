import React, { useState, useEffect } from "react";
import axios from "axios";
import { URL, getAuthToken } from "../config";
//===================================================================================================
function Posts(props) {
	const [posts  , setPosts  ] = useState([]);
	const [title  , setTitle  ] = useState("");
	const [post   , setPost   ] = useState("");
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState({ success:null,message:null });
	
    const getPostsApi = async () => { // Hide create post by a button 
		try{
			const response = await axios.get(`${URL}/posts/user`, {headers:{authorization:getAuthToken()}});
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
    
	useEffect( () => {
		// setLoading(true);
		getPostsApi();
		// setLoading(false);
	}, []);
	
	const addPost = async (event) => {
		event.preventDefault();
		if(post === "" || title === ""){
			alert("Please enter a valid text!");
          	return;
      	}
        try{
			const response = await axios.post(`${URL}/posts`, {title:title, post:post}, {headers:{authorization:getAuthToken()}});
			const { ok,data,message } = response.data;
			if(!ok){
				setLoading(false);
				setMessage({ success:false, message:message });
				alert(message);
			}else{
				const newPost ={ title:data.post.title, post:data.post.post, _id:data.post._id, date:data.post.date, user:props.user, comments:[] };
			 	setPosts([...posts,newPost]);
				setLoading(false);
				setMessage({ success:true });
				setTitle("");
				setPost("");
			};
		}
		catch(e){
			alert("please try again");
			setLoading(false);
			setMessage({ success:false, message:"Try again!" });
		}
	};
	
  	const addComment = async (commentBody) => {
    	if(commentBody.comment === "")
    		alert("Please enter a comment!");
        try{
			const response = await axios.post(`${URL}/comments`, {post_id:commentBody.postId, body:commentBody.comment}, {headers:{authorization:getAuthToken()}});
			const { ok,data,message } = response.data;
			if(!ok){
				setLoading(false);
				setMessage({ success:false, message:message });
			}else{
				setLoading(false);
				setMessage({ success:true, message:message });
				let newComment = data.comment;
				newComment.user = props.user;
				const newPosts = posts.map( post => {
					if(post._id===commentBody.postId){
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
    	const confirmed = window.confirm("Are you sure?");
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
				const newPosts = posts.filter(post=>post._id!==item._id);
			 	setPosts(newPosts);
			};
		}
		catch(e){
			setLoading(false);
			setMessage({ success:false, message:"Try again!" });
		}
    };
    
    const deleteComment = async (commentId,postId) => {
		try{
			const response = await axios.delete(`${URL}/comments/${commentId}`, {headers:{authorization:getAuthToken()}});
			const { ok,message,data } = response.data;
			if(!ok){
				setLoading(false);
				setMessage({ success:false, message:message });
			}else{
				setLoading(false);
				setMessage({ success:true, message:message });
				const deletedCommentId = data.comment._id;
				const newPosts = posts.map(post=>{
					if(post._id === postId){
                    	const comentsAfterDeleting = post.comments.filter(comment=>deletedCommentId!==comment._id);
                    	post.comments = comentsAfterDeleting;
                	};
					return post;
				});
				setPosts(newPosts);
			};
		}
		catch(e){
			setLoading(false);
			setMessage({success:false, message:"Try again!"});
		}
	};
	
	const editPost = async (postId,newPost) => {
		if(newPost.post === "" || newPost.title === "")
			return alert("Please enter a valid text!");
        try{
			const response = await axios.put(`${URL}/posts/${postId}`, {title:newPost.title, post:newPost.post}, {headers:{authorization:getAuthToken()}});
			const { ok,data,message } = response.data;
			if(!ok){
				alert(message);
			}else{
				const newPost ={ title:data.post.title, post:data.post.post};
				const newPosts = posts.map(post=>{
				   	if(postId === post._id)
                  		return {...post,...newPost};
				   	// { // explain again??
				   	// 	title=1,
				   	// 	post,
				   	// 	_id,
				   	// 	title=2,
				   	// 	post,
				   	// 	title:6
				   	// }
				   	return post;
		   		});
			 	setPosts(newPosts);
			};
		}
		catch(e){
			alert("Please try again!");
		}
	};
    
	return <div className="posts">
		<h1>{props.user.username} Posts</h1>

		<form className="posts-box" onSubmit={addPost}>
			<input 	  onChange={(e)=>setTitle(e.target.value)} value={title} placeholder="Title"/>
			<textarea onChange={(e)=>setPost(e.target.value)}  value={post}  placeholder="Text..."/>
			<button type="submit" name="submit">Post</button>
        </form>

		{
			loading? <h2>Loading...</h2> : 
          		!message.success? <p>{message.message}</p> :
          			(posts.length === 0)? <h2>There are no posts.</h2> :
          				//<h2>All posts</h2>  // How to use this tag here?
	              		posts.map((item,key)=>{
  			              	return <div className="posts-one-post" key={key}>
  			              		<OnePost item={item} deletePost={deletePost} editPost={editPost}/>
  								<div className="posts-comments">
  									<OnePostComments postId={item._id} comments={item.comments} loading={loading} addComment={addComment} message={message} deleteComment={deleteComment} />
  								</div>
							</div>
		              	})
		}

	</div>
};
//===================================================================================================
function OnePost({item,deletePost,editPost}) {  // why use key={postId} here? while use it key={index} up?
	const [status  , setStatus  ] = useState("Edit");
	const [newTitle, setNewTitle] = useState(item.title);
	const [newPost , setNewPost ] = useState(item.post);
	
	const onUpdatePost = async (postId,newPost) => {
		if(status === "Edit"){
			setStatus("Save"); 
			//convert text to input 
			//save case
		}else{
			setStatus("Edit");
			//save new value and convert inputs to text
			editPost(postId,newPost);
		};
	};

	return <div className="onepost">
		<button onClick={()=>{deletePost(item)}}>Delete</button>
		<button onClick={()=>{onUpdatePost(item._id,{title:newTitle,post:newPost})}}>{status}</button>
		<br/>
		
		{ (status==="Edit")? <h2>{item.title}</h2> :
				<input value={newTitle} onChange={({target:{value}})=>setNewTitle(value)}></input> }

    	<h4>Posted by: {item.user.username}</h4>
		<h4>Publish date: {new Date(item.date||new Date()).toLocaleDateString()}</h4>
		
		{ (status==="Edit")? <p>{item.post}</p> :
			<textarea value={newPost} onChange={({target:{value}})=>setNewPost(value)}></textarea> }
	</div>
}
//===================================================================================================
function OnePostComments({postId,comments,addComment,message,loading,deleteComment}) { 
	const [comment, setComment] = useState("");
		
	return <div className="OnePostComments" key={postId}>
		<h3>Comments:</h3>

		{
			(comments.length === 0)? <p>There are no comments.</p> : 
              	comments.map( (item,key)=>{
	              	return <div className="OnePostComments-lists" key={key}>
	              	<button onClick={()=>deleteComment(item._id,postId)}>Delete</button>
		              	<p>- {item.body}</p>
		              	<p id="p2">
		              		<span> Username: {item.user.username}</span>
							<span> Date: {item.date}</span>
						</p>
					</div>
              	} )
		}

		<div style={{"width": "95%"}}>
			<input placeholder="Comment..." value={comment} onChange={(event)=>setComment(event.target.value)}/>
			<button onClick={()=>{addComment({postId:postId,comment:comment}); setComment("")}} disabled={loading}>Add comment</button>
			<br/>
	  		{ (!message.success)? <p>{message.message}</p> : null }
		</div>

	</div>
}
//===================================================================================================
export default Posts;
