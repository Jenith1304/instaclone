
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { Input } from './ui/input'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'
const Post = ({ post }) => {
    const [text, setText] = useState("")
    const [bookmark, setBookmark] = useState(false);
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    //is the postliked by user or not
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLikes, setPostLikes] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();
    const onChangeEventHandler = (e) => {
        const input = e.target.value;
        if (input.trim()) {
            setText(input);
        }
        else {
            setText("");
        }
    }
    //deltepost
    const deletePostHandler = async () => {
        try {

            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, { withCredentials: true });
            if (res.data.success) {
                const updatedPost = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPost));
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }
    //like or dislikePost
    const likeorDislikePost = async () => {
        try {
            console.log(liked);
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                console.log("liked");
                const updatedlikes = liked ? postLikes - 1 : postLikes + 1;
                setLiked(!liked);
                setPostLikes(updatedlikes)

                //update posts
                const updatedPostData = posts.map((p) =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) // this statement will remove the user who already liked the post
                            : [...p.likes, user._id] // this statement will add the user who  liked the post
                    } : p
                )
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            // toast.error(error.response.data.message)
        }
    }
    //comment 
    const commentHandler = async () => {

        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post?._id}/comment`, { text }, { headers: { 'Content-type': 'application/json' }, withCredentials: true });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);
                const updatedPostData = posts.map(p => p._id === post._id ? { ...p, comments: updatedCommentData } : p);
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText("")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                if (res.data.message === 'Post bookmarked')
                    setBookmark(true);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='my-8 w-full max-w-sm mx-auto '>
            <div className='flex items-center justify-between '>

                <div className='flex items-center gap-2'>
                    <Avatar className='w-6 h-6' >
                        <AvatarImage src={post?.author?.profilePicture} alt="@shadcn" style={{ "borderRadius": "50%", "border": "2px solid black" }} className="object-cover" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-3'>

                        <h1 className='font-medium'>{post?.author?.username}</h1>
                        {user?._id === post?.author?._id && (<Badge>Author</Badge>)}
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer'></MoreHorizontal>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center">
                        {
                            post?.author?._id !== user?._id && <Button variant="ghost" style={{ background: "white", color: "#ED4956" }} className="cursor-pointer w-fit font-bold">Unfollow</Button>
                        }

                        <Button variant="ghost" style={{ background: "white" }} className="cursor-pointer w-fit">Add to Favourites</Button>
                        {
                            user && user._id === post?.author?._id && <Button variant="ghost" style={{ background: "white", color: "#ED4956" }} className="cursor-pointer w-fit" onClick={deletePostHandler}>Delete</Button>
                        }

                    </DialogContent>
                </Dialog>

            </div>
            <img className=" w-full my-2 rounded-lg aspect-auto object-contain" src={post?.image} alt="" />
            {/* for likes,bookmark etc */}
            <div className='flex justify-between items-center'>
                <div className='flex  gap-3'>
                    {liked ? <FaHeart onClick={likeorDislikePost} size={"24px"} className='cusrsor-pointer hover:text-gray-400 text-red-600' />
                        : <FaRegHeart onClick={likeorDislikePost} size={"22px"} className='cusrsor-pointer hover:text-gray-400' />}

                    <MessageCircle className='cusrsor-pointer hover:text-gray-400' onClick=
                        {() => { setOpen(true), dispatch(setSelectedPost(post)) }} />
                    <Send className='cusrsor-pointer hover:text-gray-400' />
                </div>
                <Bookmark onClick={bookmarkHandler} className={`cursor-pointer hover:text-gray-400 ${bookmark ? 'fill-black text-gray-500' : ''}`} />
            </div>
            <span className='font-medium block mb-2'>{postLikes} likes</span>
            <p>
                <span className='font-medium mr-2'>{post?.author?.username}</span>{post?.caption}
            </p>
            {
                comment.length > 0 && (<span onClick=
                    {() => { setOpen(true), dispatch(setSelectedPost(post)) }} className='cursor-pointer text-gray-500'>View All {comment.length} comments</span>)
            }

            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between my-2' style={{ "borderBottom": "1px solid black" }}>
                <input type="text" value={text} onChange={onChangeEventHandler} placeholder="Add Comments" className="focus-visible:ring-transparent  outline-none  w-[90%]" />
                {
                    text && <span onClick={commentHandler} className='text-[#3BADf9] cursor-pointer text-center '>Post</span>
                }
            </div>

        </div>

    )
}

export default Post