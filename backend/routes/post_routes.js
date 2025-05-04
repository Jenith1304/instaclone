const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const upload = require("../middlewares/multer.js");
const {
    addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost
} = require("../controllers/post_controller.js");

const router = express.Router();

router.post("/addpost", isAuthenticated, upload.single('image'), addNewPost);
router.get("/all", isAuthenticated, getAllPost);
router.get("/userpost/all", isAuthenticated, getUserPost);
router.get("/:id/like", isAuthenticated, likePost);
router.get("/:id/dislike", isAuthenticated, dislikePost);
router.post("/:id/comment", isAuthenticated, addComment);
router.post("/:id/comment/all", isAuthenticated, getCommentsOfPost);
router.delete("/delete/:id", isAuthenticated, deletePost);
router.get("/:id/bookmark", isAuthenticated, bookmarkPost);

module.exports = router;
