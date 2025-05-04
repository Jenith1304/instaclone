const Conversation = require("../models/conversation_model");
const Message = require("../models/message_model");
const { getReceiverSocketId, io } = require("../socket/socket");

const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        const newMessage = await Message.create({
            senderId, receiverId, message
        })
        if (newMessage) {
            conversation.messages.push(newMessage._id);

        }

        await Promise.all([
            conversation.save(),
            newMessage.save()
        ])


        //implement socket io for data transfer
        const recieverSocketId = getReceiverSocketId(receiverId)
        if (recieverSocketId) {
            io.to(recieverSocketId).emit('newMessage', newMessage)
        }


        return res.status(201).json({
            newMessage, success: true
        })
    } catch (error) {
        console.log(error);

    }

}


const getMessage = async (req, res) => {
    const senderId = req.id;
    const receiverId = req.params.id;
    const conversation = await Conversation.findOne({ participants: { $all: [senderId, receiverId] } }).populate('messages');
    if (!conversation) return res.status(200).json({ success: true, messages: [] });
    return res.status(200).json({ success: true, messages: conversation?.messages })
}

module.exports = {
    sendMessage, getMessage
}