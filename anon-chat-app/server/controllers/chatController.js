const Message = require('../models/Message');

const getMessages = async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await Message.find({ room })
            .sort({ createdAt: 1 })
            .limit(50);
        res.json(messages);
    } catch (error) {
        console.error('Error in getMessages:', error);
        res.status(500).json({ message: 'Server Error' });
    }

};

module.exports = { getMessages };
