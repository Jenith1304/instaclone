const mongoose = require("mongoose")
const config = require('config');
require('dotenv').config();
mongoose.connect(`${process.env.MONGODB_URI}`)

    //this works on the value of environment variable

    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err)
    })
module.exports = mongoose.connection;
