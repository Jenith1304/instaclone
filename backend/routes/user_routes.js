const { login, register, logout, getProfile, editProfile, suggestedUser, followOrUnfollow } = require("../controllers/user_controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const upload = require("../middlewares/multer");

const express = require('express');
const router = express.Router();
router.post('/', (req, res) => {
    console.log("Hello");
    res.send("Hello")
})
router.post('/login', login);
router.post('/register', register);
router.get('/logout', logout);
router.get('/:id/profile', isAuthenticated, getProfile);
router.post('/profile/edit', isAuthenticated, upload.single('profilePicture'), editProfile);
router.get('/suggested', isAuthenticated, suggestedUser);
router.post('/followorunfollow/:id', isAuthenticated, followOrUnfollow)

module.exports = router;


