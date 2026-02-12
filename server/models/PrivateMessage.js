const mongoose = require('mongoose');

const privateMessageSchema = new mongoose.Schema({
    nickname: { type: String, required: true },
    text: { type: String, required: true },
    userColor: { type: String, default: '#000000' },
    room: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '24h' }
});

module.exports = mongoose.model('PrivateMessage', privateMessageSchema);
