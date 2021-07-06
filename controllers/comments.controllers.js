const Comment = require("../models/comments.models");
const Post    = require("../models/posts.models");
//===================================================================================================
class commentsControllers {

    async findAll (req,res) {
        const user = req.user;
        try{
            if(!user.admin)
                return res.send({ ok:false, message:'Access Denied!' });
            const comments = await Comment.find({}).lean();
            if(comments && comments.length === 0) 
                return res.send({ ok:true, message:'There are no comments!', data:{comments:[]} });
            // const deleteAllComments = comments.map(async (item) =>{
            //     const removed = await Comment.deleteOne({ _id:item._id });
            //     return removed
            // })
            return res.send({ ok:true, message:'Successfully retrieved!', data:{comments:comments} });
        }
        catch(e){
            return res.send({ ok:false, message:'Server Error!' }); 
        }
    };

    async findOne (req,res){
        const {_id}  = req.params;
        const {user} = req;
        if(!_id)
            return res.send({ ok: false, message:'Post is not existed!' });

        try{
            if(user.admin){
                const find = await Comment.findOne({ _id });
                if(!find)
                    return res.send({ ok:false, message:"Comment is not existed!" });
                return res.send({ ok:true, message:"Successfully retrieved!", data:{comment:find} });
            }else{
                const find = await Comment.findOne({ _id, user:user._id });
                if(!find)
                    return res.send({ ok:false, message:"Comment is not existed!" });
                return res.send({ ok:true, message:"Successfully retrieved!", data:{comment:find} });
            };
        }
        catch(e){
            return res.send({ ok:false, message: "Server Error!" });
        }
    }

    async insert (req,res) {
        const user           = req.user;
        const {post_id,body} = req.body;
        try{
            if(!post_id || !body) // Meaning empty data.
                return res.send({ ok:false, message:"Please insert a valid data!" });
            const findPost = await Post.findById(post_id);
            if(findPost === null)
                return res.send({ ok:false, message:"Post is not existed!" });

            const newComent = await Comment.create({ user:user._id, post:post_id, body:body }); // To create form like what we do inside model
            return res.send({ ok:true, message:"Successfully created!", data:{comment:newComent} });
        }
        catch(e){
            return res.send({ ok:false, message:"Server Error!" }); 
        }
    }

    async delete (req,res){
        const {_id}  = req.params;
        const {user} = req;
        try{
            if(user.admin){  // || !user.admin){
                const removed = await Comment.deleteOne({ _id });
                if(removed.n === 0)
                    return res.send({ ok:false, message:"Comment is not existed!" });
                return res.send({ ok:true, message:"Successfully deleted!", data:{comment:{_id}} });
            }else{
                const removed = await Comment.deleteOne({ _id, user:user._id }); // Delete comment if it applied the two condition: user === user.id (in json)
                if(removed.n === 0)
                    return res.send({ ok:false, message:"Comment is not existed!" });
                return res.send({ ok:true, message:"Successfully deleted!", data:{comment:{_id}} });
            }
        }
        catch(e){
            return res.send({ ok:false, message:"Server Error!" });
        };
    }

    async update (req,res){
        const {_id}          = req.params; // const _.id = req.params._id
        const {user,body}    = req;
        const {body:newbody} = body;
        // const { newbody } = body; // you have to write newbody in json
        if(!newbody) // To avoid insert an empty title or post.
            return res.send({ ok:false, message:"Please insert a valid data!" }); 
        try{
            if(user.admin){
                const updated = await Comment.updateOne({_id},{body:newbody});
                if(updated.n === 0)
                    return res.send({ ok:false, message:"Comment is not existed!" });
             // const updated = await Comment.updateOne({_id:_id},{body:newbody});
                return res.send({ok:true, message:"Successfully updated!", data:{comment:{_id, body:newbody}} });
            }else{
                const updated = await Comment.updateOne({_id,user:user._id}, {body:newbody}); 
                if(updated.n === 0)
                    return res.send({ ok:false, message:"Comment is not existed!" });
                return res.send({ok:true, message:"Successfully updated!", data:{comment:{_id, body:newbody}} });
            };
        }
        catch(e){
            return res.send({ ok:false, message:"Server Error!" });
        };
    }

};
//===================================================================================================
module.exports = new commentsControllers();

/*
async findAll (req, res){
        const user = req.user;

        try{
            const posts = await Comment.find({});
            if(user.admin){
                if(posts && posts.length === 0)
                    res.send({ ok: true, message: "There are no posts!", data: {posts:[]} });
                res.send({ ok: true, message: "Successfully retrieved!", data: {posts} });
            }else{
                const usersPosts = posts.filter( item => String(item.user) === user._id.toString() );
                if(posts && posts.length === 0){
                    res.send({ ok: true, message: "There are no posts!", data: {posts:[]} });
                }
                res.send({ ok: true, message: "successfully retreived!", data: {posts:usersPosts} })
            }
        }
        catch(e){
            res.send({ ok: false, message: "Server error!" }); 
        }
    }
*/