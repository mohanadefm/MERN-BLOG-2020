const Post    = require("../models/posts.models");
const Comment = require("../models/comments.models");
const User    = require("../models/users.models");
//===================================================================================================
class postsControllers {

    async getAllPosts (req,res){
        try{
            const sortType = req.query.sort || "descending" //ascending
            const posts = await Post.find({}).sort({date:sortType === "descending" ? -1 : 1}).lean();
            if(posts && posts.length === 0)
                return res.send({ ok:true, message:"There are no posts!", data:{posts:[]} });

            let newPosts = posts.map(async(item)=>{   
                const comments = await Comment.find({post:item._id}).lean().populate("user","username email");
                const user     = await User.findOne({_id:item.user},"username email admin");
                item.comments  = comments;
                item.user      = user;
                return item;
            })
            let result = await Promise.all(newPosts);
            return res.send({ ok:true, message:"Successfully retrieved!", data:{posts:result} });
        }
        catch(e){
            return res.send({ ok:false, message:"Server Error!" }); 
        }
    }
    
    async getUserPosts (req,res){
        const user  = req.user;
        try{
            const posts = await Post.find({user:user._id}).lean();
            if(posts && posts.length === 0)
                return res.send({ ok:true, message:"There are no posts!", data:{posts:[]} });

            let newPosts = posts.map(async(item)=>{
                const comments = await Comment.find({post:item._id}).lean().populate("user","username email");
                item.comments  = comments;
                //delete user.password
                //const {password, ...newUser}=user
                item.user = user;
                return item;
            });
            let result = await Promise.all(newPosts); // Promise is to get newPosts
            return res.send({ ok:true, message:"Successfully retreived!", data: {posts:result} });
        }
        catch(e){
            return res.send({ ok:false, message:"Server Error!" }); 
        }
    }
    
    async getPostsForAdmin (req,res){
        const user  = req.user;
        const {_id} = req.params;
        try{
            if(!user.admin){
                return res.send({ ok:false, message:"Access Denied!" }); 
            }else{
                const posts = await Post.find({user:_id}).lean();
                if(posts && posts.length === 0)
                    return res.send({ ok:true, message:"There are no posts!", data:{posts:[]} });
                
                let newPosts = posts.map(async(item)=>{
                    const comments = await Comment.find({post:item._id}).lean().populate("user","username email");
                    item.comments  = comments;
                    item.user      = user;
                    return item;
                });
                let result = await Promise.all(newPosts);
                return res.send({ ok:true, message:"Successfully retreived!", data: {posts:result} });
            };
        }
        catch(e){
            return res.send({ ok:false, message:"Server Error!" }); 
        }
    }
    
    async insert (req,res) {
        //const { body, user }  = req;
        //const { title, post } = body;
        const user            = req.user;
        const { title, post } = req.body;
        try{
            if(!title || !post)
                return res.send({ ok:false, message:"Please insert a valid data!" }); 
            const newPost = await Post.create({title,post,user:user._id });
            return res.send({ ok:true, message:"Successfully created!", data:{post:newPost} });
        }
        catch(e){
            return res.send({ ok:false, message:"Server Error!" }); 
        }
    }
    
    async delete (req,res){
        const { _id }  = req.params;
        const { user } = req;
        try{
            if(user.admin){
                const removed = await Post.deleteOne({ _id });
                if(removed.n === 0)
                    return res.send({ ok:false, message:"Post is not existed!" });
                const removedPostComments = await Comment.deleteMany({ post:_id }); // to delete all comments!
                return res.send({ ok:true, message:"Successfully deleted!", data:{post:{_id}} });
            }else{
                const removed = await Post.deleteOne({ _id, user:user._id }); // Delete post if it applied the two condition: user === user.id (in json)
                if(removed.n === 0)
                    return res.send({ ok:false, message:"Post is not existed!" });
                const removedPostComments = await Comment.deleteMany({ post:_id }); // to delete all comments!
                return res.send({ ok:true, message:"Successfully deleted!", data:{post:{_id}} });
            }
        }
        catch(e){
            return res.send({ ok:false, message:"Server Error!" });
        };
    }
    
    async update (req,res){
        const { _id }         = req.params;
        const { user, body }  = req;
        const { title, post } = body;
        if(!title || !post)
            return res.send({ ok:false, message:"Please insert a valid data!" }); 
        try{
            if(user.admin){
                const updated = await Post.updateOne({_id},{title,post});
                if(updated.n === 0)
                    return res.send({ ok:false, message:"Post is not existed!" });
                return res.send({ ok:true, message:"Successfully updated!", data:{post:{_id, title, post}} });
            }else{
                const updated = await Post.updateOne({_id,user:user._id},{title,post}); 
                if(updated.n === 0)
                    return res.send({ ok:false, message:"Post is not existed!" });
                return res.send({ ok:true, message:"Successfully updated!", data:{post:{_id, title, post}} });
            }
        }
        catch(e){
            return res.send({ ok:false, message:"Server Error!" });
        };
    }
    
};
//===================================================================================================
module.exports = new postsControllers();


// async publicFindAllComment (req,res){
    //     const {_id}  = req.params;
    //     try{
    //         const comments = await Comment.find({post:_id});
    //         if(comments && comments.length === 0)
    //             return res.send({ ok:true, message:"There are no comments!", data:{comments:[]} });
    //         res.send({ ok:true, message:"Successfully retrieved!", data:{comments} });
    //     }
    //     catch(e){
    //         res.send({ ok:false, message:"Server Error!" }); 
    //     }
    // }
    
        
    // async findOne (req,res){
    //     const { _id }  = req.params;
    //     const { user } = req; // or use ==> (const user = req.user;).
    //     try{
    //         if(user.admin){
    //             const find = await Post.findOne({ _id }).lean();
    //             if(!find) res.send({ ok:false, message:"Post is not existed!" });
    //             const findComs = await Comment.find({ post:find._id }); 
    //             // We write post cause in model we decleare a post line 10
    //             find.comments = findComs // To append comments to the post
    //             res.send({ ok:true, message:"Successfully retrieved!", data:{post:find} });
    //         }else{
    //             const find = await Post.findOne({ _id, user:user._id }).populate("user","username").lean();
    //             if(!find){
    //                 res.send({ ok:false, message:"Post not existed!" });
    //             }
    //              const findComs = await Comment.find({ post:find._id });
    //              // find.comments = findComs or ...
    //              Object.assign(find, {comments: findComs});
    //             res.send({ ok:true, message:"Successfully retrieved!", data:{post:find} });
    //         }
    //     }
    //     catch(e){
    //         res.send({ ok:false, message:"Server Error!" });
    //     }
    // }