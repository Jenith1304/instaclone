import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Button } from './ui/button'

import { readFileAsDataURL } from '@/lib/utils'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '@/redux/postSlice'


const CreatePost = ({ open, setOpen }) => {
    const [caption, setCaption] = useState("")
    const [file, setFile] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const imageRef = useRef();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { posts } = useSelector(store => store.post)
    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    }
    const createPostHandler = async () => {
        // e.preventDefault();
        console.log(file, caption);
        const formData = new FormData();
        formData.append("caption", caption);
        if (imagePreview) {
            formData.append("image", file);
        }
        try {
            setLoading(true)
            const res = await axios.post("http://localhost:8000/api/v1/post/addpost", formData, {
                headers: { "Content-Type": "multipart/form-data" },

                withCredentials: true,
            })
            if (res.data.success) {
                //    console.log(res.data)
                dispatch(setPosts([res.data.post, ...posts]));
                toast.success(res.data.message);
                setOpen(false);

            }

        } catch (error) {
            toast.error(error.response.data.message)
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => { setOpen(false), setImagePreview(""), setFile(""), setCaption("") }} className="bg-gray-300 outline-none">
                <DialogHeader >
                    <p className='text-center font-semibold'>Create new Post</p>
                    <hr></hr>
                </DialogHeader>
                <div className='flex flex-col items-center gap-5'>
                    <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write Caption...." className="focus-visible:ring-transparent  outline-none  w-[90%]" style={{ borderBottom: "1px solid gray", resize: "none" }}></textarea>
                    {imagePreview &&
                        (<div className='w-full h-full flex items-center justify-center'><img src={imagePreview} className=" w-full h-full object-contain rounded-xl" alt="" /></div>)
                    }
                    <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
                    <Button className="bg-blue-500 text-white hover:bg-blue-600" onClick={() => imageRef.current.click()}>Select From Computer</Button>
                    {
                        imagePreview && (loading ? (
                            <Button>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait
                            </Button>
                        ) : (<Button style={{ background: "black", color: "white" }} type="submit" onClick={createPostHandler}>Post</Button>))
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost