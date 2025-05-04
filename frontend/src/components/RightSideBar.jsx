
import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import SuggestedUsers from './SuggestedUsers';
import { Link } from 'react-router-dom';


const RightSideBar = () => {
    const { user } = useSelector(store => store.auth);
    return (
        <>
            <div className=' w-[20%]'>
                <div className=' flex text-sm my-20 gap-2'>
                    <div className='  '>
                        <Link to={`/profile/${user?._id}`}>
                            <Avatar className='w-10 h-10' >
                                <AvatarImage src={user?.profilePicture} alt="@shadcn" style={{ "borderRadius": "50%", "border": "2px solid black" }} className="object-cover" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar >
                        </Link>


                    </div >
                    <div className=''>
                        <h1 className='font-bold '>{user?.username}</h1>
                        <span>{user?.bio || "Bio Here...."}</span>
                    </div>

                </div >
                <SuggestedUsers />
            </div>

        </>
    )
}

export default RightSideBar