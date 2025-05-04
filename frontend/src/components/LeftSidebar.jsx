import { setAuthUser } from '@/redux/authSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import { Heart, HeartIcon, Home, LogOut, MessageCircle, Plus, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'


const LeftSidebar = () => {

    const { user } = useSelector(store => store.auth)
    const { likeNotification } = useSelector(store => store.realTimeNotification)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const sideBarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <HeartIcon />, text: "Notifications" },
        { icon: <Plus />, text: "Create" },
        {
            icon: (<Avatar className='w-6 h-6  ' >
                <AvatarImage src={user?.profilePicture} alt="@shadcn" style={{ "border": "1px solid black", borderRadius: "50%" }} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>), text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ]

    const logOutHandler = async () => {
        try {
            console.log("Clikced")
            const res = await axios.get('https://instaclone-j434.onrender.com/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null))
                dispatch(setSelectedPost(null))
                dispatch(setPosts([]))
                navigate("/login")
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    const submitHandler = (text) => {
        if (text === "Logout") {
            logOutHandler();
        }
        else if (text === "Create") {

            setOpen(true);
        }
        else if (text === "Profile") {
            navigate(`/profile/${user._id}`)
        }

        else if (text === "Home") {
            navigate(`/`)
        }
        else if (text === "Messages") {
            navigate(`/chat`)
        }

    }
    return (
        <div className='fixed left-0 top-0 z-10 px-4 border-r border-gray-600 h-screen w-[16%] text-[20px]'>
            <div className='flex flex-col '>
                <h1>LOGO</h1>
                <div >

                    {sideBarItems.map((item, index) => (

                        <div onClick={() => submitHandler(item.text)} key={index} className='flex items-center gap-3 relative p-3 my-4 hover:bg-gray-100 rounded-lg cursor-pointer '>
                            {item.icon}
                            <span>{item.text}</span>
                            {
                                item.text === "Notifications" && likeNotification.length > 0 && (
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div><Button style={{ color: "white" }} size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button></div>

                                        </PopoverTrigger>
                                        <PopoverContent >
                                            <div>
                                                {
                                                    likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                        likeNotification.map((notification) => {
                                                            return (
                                                                <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                    <Avatar className='w-6 h-6'>
                                                                        <AvatarImage src={notification.userDetails?.profilePicture} style={{ "borderRadius": "50%", "border": "2px solid black" }} className="object-cover" />
                                                                        <AvatarFallback>CN</AvatarFallback>
                                                                    </Avatar>
                                                                    <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                </div>
                                                            )
                                                        })
                                                    )
                                                }
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )
                            }
                        </div>

                    ))}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>

    )
}

export default LeftSidebar