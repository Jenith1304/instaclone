import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);
    // console.log(suggestedUsers);
    return (
        <div className='mx-10'>

            <div className='flex gap-3'>
                <span className='font-medium text-gray-600'>Suggested Users </span>
                <span className='font-semibold text-gray-950'>For You</span>
            </div>
            {
                suggestedUsers.map((user) => {
                    return (
                        <div className=' flex text-sm my-5 gap-2  ' key={user._id}>
                            <div className=' '>
                                <Link to={`/profile/${user?._id}`} className='cursor-pointer' >
                                    <Avatar className='w-10 h-10 ' >
                                        <AvatarImage src={user?.profilePicture} alt="@shadcn" style={{ "borderRadius": "50%", "border": "2px solid black" }} className="object-cover " />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar >
                                </Link>


                            </div >
                            <div className=''>
                                <h1 className='font-bold '>{user?.username}</h1>
                                <span>{user?.bio || "Bio Here...."}</span>
                                <span className='text-sm font-semibold cursor-pointer text-[#3BADF8] hover:text-[#6fbdf1] mx-2'>Follow</span>
                            </div>

                        </div >)
                })
            }
        </div>
    )
}

export default SuggestedUsers