
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'
import { toast } from 'sonner'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("")
    const { selectedPost, posts } = useSelector(store => store.post);
    const [comment, setComment] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments)
        }
    }, [selectedPost])
    const onChangeEventHandler = (e) => {
        const input = e.target.value;
        if (input.trim()) {
            setText(input);
        }
        else {
            setText("");
        }
    }
    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`https://instaclone-j434.onrender.com/api/v1/post/${selectedPost?._id}/comment`, { text }, { headers: { 'Content-type': 'application/json' }, withCredentials: true });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);
                const updatedPostData = posts.map(p => p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p);
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message)
                setText("")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className='p-0 h-100 flex flex-col max-w-7xl bg-white outline-none'>
                <div className='flex h-full'>
                    <div className='w-1/2 h-full  flex flex-col items-center justify-center'>
                        <img className=" w-full  my-2 rounded-lg object-center bg-amber-300" src={selectedPost?.image} alt="" />
                    </div>
                    <div className='my-2 w-1/2 h-full px-2'>
                        <div className='flex items-center justify-between '>

                            <div className='flex items-center gap-2'>
                                <Avatar className='w-6 h-6' >
                                    <AvatarImage src={selectedPost?.author?.profilePicture} alt="@shadcn" style={{ "borderRadius": "50%", "border": "2px solid black" }} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <h1>{selectedPost?.author?.username}</h1>
                            </div>

                            <Dialog >
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer'></MoreHorizontal>
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center  ">
                                    <Button variant="ghost" style={{ background: "white", color: "#ED4956" }} className="cursor-pointer w-fit font-bold">Unfollow</Button>
                                    <Button variant="ghost" style={{ background: "white" }} className="cursor-pointer w-fit">Add to Favourites</Button>
                                    <Button variant="ghost" style={{ background: "white", color: "#ED4956" }} className="cursor-pointer w-fit">Cancel</Button>
                                </DialogContent>
                            </Dialog>

                        </div>

                        {/* commentSection */}
                        <div className='w-full h-[75%]  flex flex-col overflow-y-auto hide-scrollbar'>
                            {
                                comment?.map((comment) => <Comment key={comment._id} comment={comment} />)
                            }

                        </div>

                        <div className='flex items-center justify-between my-2 ' style={{ "borderBottom": "1px solid black" }}>
                            <input type="text" value={text} onChange={onChangeEventHandler} placeholder="Add Comments" className="focus-visible:ring-transparent  outline-none  w-[90%] " />
                            {
                                text && <span onClick={sendMessageHandler} className='text-[#3BADf9] cursor-pointer text-center '>Send</span>
                            }
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default CommentDialog