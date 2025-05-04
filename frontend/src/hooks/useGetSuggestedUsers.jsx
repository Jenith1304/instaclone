import { setSuggestedUsers } from "@/redux/authSlice";

import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {

        const fetchAllUsers = async () => {

            try {
                const res = await axios.get("https://instaclone-j434.onrender.com/api/v1/user/suggested", { withCredentials: true });
                if (res.data.success) {
                    // console.log(res.data.users);
                    dispatch(setSuggestedUsers(res.data.users))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllUsers();
    }, []);
}
export default useGetSuggestedUsers;