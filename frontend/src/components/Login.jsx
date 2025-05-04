import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios, { Axios } from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

function Login() {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    const signUpHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const res = await axios.post("https://instaclone-j434.onrender.com/api/v1/user/login", input, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user))
                navigate('/')
                toast.success(res.data.message);
                setInput({
                    username: "",
                    email: "",
                    password: ""
                })
            }
        }

        catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
        finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    return (
        <div className="w-screen h-screen flex  items-center justify-center">
            <form onSubmit={signUpHandler} className="shadow-lg flex flex-col gap-5 p-8">
                <div className="">
                    <h1 className="text-center font-bold text-2xl">LOGO</h1>
                    <p>Signup to access photo and media</p>
                </div>

                <div>
                    <Label className="p-2 ">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent"
                    ></Input>
                </div>{" "}
                <div>
                    <Label className="p-2 focus-visible:ring-transparent">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent"
                    ></Input>
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait
                        </Button>
                    ) : (<Button style={{ background: "black", color: "white" }} type="submit">Login</Button>)
                }

                <span className="text-center">Doesn't have an account?<Link to="/signup" className="text-blue-600">Signup</Link></span>
            </form>
        </div>
    );
}

export default Login;
