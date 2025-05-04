const express = require('express');

const db = require("./config/mongoose-connection");
const config = require('config');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jsonWebToken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const userRoute = require("./routes/user_routes")
const postRoute = require("./routes/post_routes")
const messageRoute = require("./routes/message_routes")
const { app, server } = require("./socket/socket")
const dotenv = require('dotenv');
const path = require("path");
dotenv.config();

// const __dirname = path.resolve();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: ['http://localhost:5173', 'https://instaclone-j434.onrender.com'],
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

// console.log(__dirname)

// app.get("/", (req, res) => {
//     return res.status(201).json({
//         message: "I am coming from backend",
//         success: true
//     })
// })


app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);
app.use(express.static(path.join(__dirname, "../frontend/dist")))
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"))
})



server.listen(process.env.PORT, (req, res) => {
    console.log(`Server is running on port ${process.env.PORT}`);
})


