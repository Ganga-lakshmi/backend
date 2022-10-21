import PostModel from "../Models/postModel.js";
import UserModel from "../Models/userModel.js";
import mongoose from "mongoose";

//create new post

export const createPost = async(req ,res) => {
    const newPost = new PostModel(req.body)
    try{
        await newPost.save()
        res.status(200).json("post is created")
    }catch(error){
        res.status(500).json(error)
    }
}


//get a post

export const getPost = async(req ,res) => {
    const id = req.params.id
    try{
        const post = await PostModel.findById(id)
        res.status(200).json(post)

    }catch(error){
        res.status(500).json(error)
    }
}

//update a post

export const updatePost = async(req ,res) =>{
    const postId = req.params.id
    const {userId} = req.body
    try{
        const post = await PostModel.findById(postId)
        if(post.userId === userId){
            await post.updateOne({$set : req.body})
            res.status(200).json("Post updated")
        }
        else{
            res.status(403).json("action forbidden")
        }
    }catch(error){
        res.status(500).json(error)
    }

}
//delete post
export const deletePost = async(req ,res) => {
    const id = req.params.id;
    const {userId} = req.body

    try{
        const post = await PostModel.findById(id)
        if(post.userId === userId){
            await post.deleteOne();
            res.status(200).json("post deleted successfully")
        }
        else{
            res.status(403).json("action forbidden")
        }
    }catch(error){
        res.status(500).json(error)
    }
}

//like/unlike post
export const likePost = async(req ,res) =>{
    const id = req.params.id
    const {userId} = req.body

    try{
        const post = await PostModel.findById(id)
        if(!post.likes.includes(userId)){
            await post.updateOne({$push : {likes : userId}})
            res.status(200).json("Post liked")
        }else{
            await post.updateOne({$pull : {likes : userId}})
            res.status(200).json("Post unliked")
        }
    }catch(error){
        res.status(500).json(error)
    }
}

//get timeline posts
export const getTimelinePosts = async (req ,res) =>{
    const userId = req.params.id
    try{
        const currentUserPosts = await PostModel.find({userId : userId})
        const followingPosts = await UserModel.aggregate([
            {
                $match:{
                    _id : new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:{
                    from : "posts",
                    localField: "following",
                    foreignField: "userId",
                    as : "followingPosts"
                }
            },
            {
                $project : {
                    followingPosts : 1,
                    _id : 0
                }
            }
        ])
        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts)
        .sort((a,b)=>{
            return b.createdAt - a.createdAt;
        })
        );

    }catch(error){
        res.status(500).json(error)
    }
}


//localhost:5000/post/
// {
//     "userId" : "634a786d5d16c27db61c9602",
//     "desc" : " new post is created"
//   }

//we are posting the posts using userid (ganga) and we get the post details using post id(911 generated in posts collection)

//get post - localhost:5000/post/634af6e300a1e54163838911
//update - localhost:5000/post/634af6e300a1e54163838911
//{
//     "userId" : "634a786d5d16c27db61c9602",
//     "desc" : " new post is created by ganga"
//   }

//like/unlike - localhost:5000/post/634b945dcf9c1a77b8193ec6/like
//{
//     "userId":"634a9900f2b402ab56fa25d5"
// }

//get timeline-localhost:5000/post/634a786d5d16c27db61c9602/timeline