const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({

    //participants to know between which party is the conversation
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    //MESSAGE TO KNOW what the message is
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
})
const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation; 