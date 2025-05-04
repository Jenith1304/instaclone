const sharp = require("sharp");
const cloudinary = require("../utils/cloudinary.js");
const Post = require("../models/post_model.js");
const User = require("../models/user_model.js");
const Comment = require("../models/comment_model.js");
const { getReceiverSocketId, io } = require("../socket/socket");
// const { getReceiverSocketId, io } = require("../socket/socket.js");

const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: 'Image required' });

        // Optimize image before uploading
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // Convert buffer to Data URI
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        // Create post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        // Update user document
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        });

    } catch (error) {
        console.error(error);
    }
};

const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.error(error);
    }
};

const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: 'username profilePicture'
                }
            });
        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.error(error);
    }
};

const likePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // Like post
        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();

        // Send real-time notification
        const user = await User.findById(userId).select('username profilePicture');
        const postOwnerId = post.author.toString();

        if (postOwnerId !== userId) {
            const notification = {
                type: 'like',
                userId,
                userDetails: user,
                postId,
                message: 'Your post was liked'
            };
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: 'Post liked', success: true });
    } catch (error) {
        console.error(error);
    }
};

const dislikePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // Dislike post
        await post.updateOne({ $pull: { likes: userId } });
        await post.save();

        // Send real-time notification
        const user = await User.findById(userId).select('username profilePicture');
        const postOwnerId = post.author.toString();

        if (postOwnerId !== userId) {
            const notification = {
                type: 'dislike',
                userId,
                userDetails: user,
                postId,
                message: 'Your post was disliked'
            };
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }

        return res.status(200).json({ message: 'Post disliked', success: true });
    } catch (error) {
        console.error(error);
    }
};

const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const { text } = req.body;

        if (!text) return res.status(400).json({ message: 'Text is required', success: false });

        const comment = await Comment.create({ text, author: userId, post: postId });

        await comment.populate("author", "username profilePicture");;

        const post = await Post.findById(postId);
        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({ message: 'Comment Added', comment, success: true });

    } catch (error) {
        console.error(error);
    }
};

const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');

        if (!comments) return res.status(404).json({ message: 'No comments found for this post', success: false });

        return res.status(200).json({ success: true, comments });

    } catch (error) {
        console.error(error);
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized' });

        await Post.findByIdAndDelete(postId);

        const user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        await Comment.deleteMany({ post: postId });

        return res.status(200).json({ success: true, message: 'Post deleted' });

    } catch (error) {
        console.error(error);
    }
};

const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const user = await User.findById(userId);

        if (user.bookmarks.includes(postId)) {
            await user.updateOne({ $pull: { bookmarks: postId } });
            return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true });
        } else {
            await user.updateOne({ $addToSet: { bookmarks: postId } });
            return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true });
        }

    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    addNewPost,
    getAllPost,
    getUserPost,
    likePost,
    dislikePost,
    addComment,
    getCommentsOfPost,
    deletePost,
    bookmarkPost
};
