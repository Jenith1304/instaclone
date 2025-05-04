import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios, { Axios } from "axios";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

function Signup() {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    const signUpHandler = async (e) => {
        e.preventDefault();
        console.log(input)
        try {
            setLoading(true)
            const res = await axios.post("http://localhost:8000/api/v1/user/register", input, { headers: { 'Content-Type': 'application/json' }, withCredentials: true })
            if (res.data.success) {
                navigate('/login')
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
    return (
        <div className="w-screen h-screen flex  items-center justify-center">
            <form onSubmit={signUpHandler} className="shadow-lg flex flex-col gap-5 p-8">
                <div className="">
                    <h1 className="text-center font-bold text-2xl">LOGO</h1>
                    <p>Signup to access photo and media</p>
                </div>
                <div>
                    <Label className="p-2 ">Username</Label>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent"
                    ></Input>
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
                    ) : (<Button style={{ background: "black", color: "white" }} type="submit">Signup</Button>)
                }

                <span className="text-center">Already have an account?<Link to="/login" className="text-blue-600">Login</Link></span>
            </form>
        </div>
    );
}

export default Signup;
