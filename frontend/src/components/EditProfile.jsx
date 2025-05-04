import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import axios from 'axios'
import { setAuthUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const EditProfile = () => {
    const { user } = useSelector(store => store.auth)
    const [loading, setLoading] = useState(false);
    const imageRef = useRef();
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        console.log(file);
        if (file) setInput({ ...input, profilePhoto: file });
    }
    const editProfileHandler = async () => {
        const formdata = new FormData();
        formdata.append("bio", input?.bio);
        formdata.append("gender", input?.gender);
        if (input?.profilePhoto) {
            formdata.append("profilePicture", input?.profilePhoto)
        }
        try {
            setLoading(true);
            const res = await axios.post('https://instaclone-j434.onrender.com/api/v1/user/profile/edit', formdata,
                {
                    headers:
                        { 'Content-Type': 'multipart/form-data' }
                    , withCredentials: true
                });
            if (res.data.success) {
                const udatedUser = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user?.gender,
                };
                dispatch(setAuthUser(udatedUser));
                navigate(`/profile/${user?._id}`)
                toast.success(res.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
        finally {
            setLoading(true)
        }
    }
    return (
        <div className='max-w-2xl mx-auto pl-10 my-10'>
            <h1 className='font-bold'>
                Edit Profile
            </h1>
            <section className='bg-gray-100  rounded-xl'>
                <div className=''>
                    <div className='flex  justify-between p-2 my-20'>
                        <div className=' flex text-sm  gap-3'>
                            <div className=''>
                                <Avatar className='w-10 h-10' >
                                    <AvatarImage src={user?.profilePicture} alt="@shadcn" style={{ "borderRadius": "50%", "border": "2px solid black" }} className="object-cover" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar >
                            </div >
                            <div className=''>
                                <h1 className='font-bold '>
                                    {user?.username}</h1>
                                <span>{user?.bio || "Bio Here...."}</span>
                            </div>
                        </div>
                        <div className=''>
                            <input type='file' onChange={fileChangeHandler} className='hidden' ref={imageRef} />
                            <Button onClick={() => imageRef?.current.click()} className='bg-[#1197f0] hover:bg-[#1197f0df] cursor-pointer text-white' >Change Photo</Button>
                        </div>
                    </div>

                </div >
            </section>
            <section>
                <div>
                    <h1 className='font-semibold mb-2'>Bio</h1>
                    <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} className='focus-visible:ring-transparent' />
                </div>
                <div className='my-10'>
                    <Select className='focus-visible:ring-transparent' onValueChange={selectChangeHandler} defaultValue={input?.gender}>
                        <SelectTrigger className="w-[180px] focus-visible:ring-transparent ">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </section>
            <div className='flex justify-end'>
                {
                    loading ? (<Button className='bg-[#1197f0] hover:bg-[#1197f0df] cursor-pointer text-white'>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please Wait</Button>) :
                        (<Button className='w-fit bg-[#1197f0] hover:bg-[#1197f0df] cursor-pointer text-white' onClick={editProfileHandler}>Submit</Button>)
                }

            </div>
        </div>
    )
}

export default EditProfile