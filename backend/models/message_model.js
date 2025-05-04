const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({

    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: {
        type: String,
        required: true
    }
})
const Message = mongoose.model("Message", messageSchema);
module.exports = Message; 