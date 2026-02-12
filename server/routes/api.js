const express = require('express');
const router = express.Router();
const { getMessages } = require('../controllers/chatController');

router.get('/messages/:room', getMessages);

module.exports = router;
