
const cloudinary = require("../utils/cloudinary");
const getDataUri = require('../utils/datauri')
const User = require("../models/user_model");
const Post = require("../models/post_model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        //if anything miising then send error msg
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Something went wrong",
                success: false,
            });
        }
        let user = await User.findOne({ email });

        // if user already exists with email then ask to try with another email
        if (user) {
            return res.status(400).json({
                message: "Try another email",
                success: false,
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: "Account Created",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

//login

const login = async (req, res) => {
    try {
        let { email, password } = req.body;

        //if anything miising then send error msg
        if (!email || !password) {
            return res.status(400).json({
                message: "Something went wrong",
                success: false,
            });
        }

        let user = await User.findOne({ email });

        //if no user of the email exists then send error message
        if (!user) {
            return res.status(400).json({
                message: "Something went wrong,user not found",
                success: false,
            });
        }

        //if password matches else send error message
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Something went wrong,Password Does Not mAtch",
                success: false,
            });
        }

        //set token to cookie so that whenver logs in again then we can check wheteher the  cookie token is set or not
        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        //this will include only that posts which match with author of the post
        const populatePosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                else {
                    return null;
                }
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatePosts,
        };

        return res
            .cookie("token", token, {
                httpOnly: true,
                sameSite: "Lax",
                maxAge: 1 * 24 * 60 * 60 * 1000,
            })
            .json({
                message: `Welcome back ${user.username}`,
                success: true,
                user,
            });
    } catch (error) {
        console.log(error);
    }
};

//logout
const logout = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out Successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};

//getprofile
//using this we can get profile of any other user
const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({ path: 'posts', createdAt: -1 }).populate('bookmarks')
        return res.status(200).json({
            user, success: true
        })
    }
    catch (error) {
        console.log(error)
    }
}


//editProfile
//for editing loggedin user profile
const editProfile = async (req, res) => {
    try {
        let userId = req.id;
        //req.id came from isAuthenticated Middleware 

        let cloudResponse;
        //setup Cloudinary for user Profile Picture

        let { bio, gender } = req.body;
        let profilePicture = req.file;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture)
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }
        let user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        if (bio) { user.bio = bio }
        if (gender) { user.gender = gender }
        if (profilePicture) {
            user.profilePicture = cloudResponse.secure_url;
        }
        await user.save();
        return res.status(201).json({
            message: "Profile Updated",
            success: true,
            user
        })
    } catch (error) {
        console.log(error)
    }
}


//suggested user
//this will show the users which are not equal to logged in id

const suggestedUser = async (req, res) => {
    try {
        let suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "Currently do not have any users",


            })
        }
        return res.status(201).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error)
    }
}

//followorUnfollow

const followOrUnfollow = async (req, res) => {
    try {
        const followKarvaVado = req.id;//my id
        const jeneFollowKaris = req.params.id;//friend's id

        if (followKarvaVado === jeneFollowKaris) {
            return res.status(400).json({
                message: "You can't follow/unfollow yourself",
                success: false,
            })
        }


        //find all info of both parties
        let user = await User.findById(followKarvaVado);
        let targetUser = await User.findById(jeneFollowKaris);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "User Not Found",
                success: false,
            })
        }

        //check whether i should follow or unfollow
        const isFollowing = await user.following.includes(jeneFollowKaris);

        if (isFollowing) {
            //here i will write logic to unfollow the friend
            await Promise.all([
                User.updateOne({ _id: followKarvaVado }, { $pull: { following: jeneFollowKaris } }),
                //i will update my following list by removing friend's id

                User.updateOne({ _id: jeneFollowKaris }, { $pull: { followers: followKarvaVado } })
                //update friend's followers list by removing my id
            ])
            return res.status(200).json({
                message: "Unfollowed SuccessFully",
                success: true,
            })
        }
        else {
            //here i will write logic to follow the friend
            await Promise.all([
                User.updateOne({ _id: followKarvaVado }, { $push: { following: jeneFollowKaris } }),
                //i will update my following list by adding friend's id

                User.updateOne({ _id: jeneFollowKaris }, { $push: { followers: followKarvaVado } })
                //update friend's followers list by adding my id
            ])

            //Promise.all() is used when you need to execute multiple promises in parallel and wait for all of them to resolve. It returns a single promise that resolves when all input promises succeed or rejects if any one fails.
            return res.status(200).json({
                message: "Followed SuccessFully",
                success: true,
            })
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    register,
    login,
    logout,
    getProfile,
    editProfile,
    suggestedUser,
    followOrUnfollow
};
