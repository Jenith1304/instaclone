const { sendMessage, getMessage } = require("../controllers/message_controller");
const { login, register, logout, getProfile, editProfile, suggestedUser, followOrUnfollow } = require("../controllers/user_controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { upload } = require("../middlewares/multer");

const express = require('express');
const router = express.Router();
router.post('/', (req, res) => {
    console.log("Hello");
    res.send("Hello")
})
router.post('/send/:id', isAuthenticated, sendMessage);
router.get('/all/:id', isAuthenticated, getMessage);



module.exports = router;