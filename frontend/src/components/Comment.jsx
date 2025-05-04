import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
const Comment = ({ comment }) => {
    // console.log(comment?.author[0]?.profilePicture)
    return (

        <div className='my-2'>
            <div className='flex items-center gap-3'>
                <Avatar className='w-6 h-6' >
                    <AvatarImage src={comment?.author[0]?.profilePicture} alt="@shadcn" style={{ "borderRadius": "50%", "border": "2px solid black" }} className="object-cover" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='text-sm font-bold'>{comment?.author[0]?.username}<span className='font-normal pl-1'>{comment?.text}</span></h1>
            </div>

        </div>
    )
}

export default Comment