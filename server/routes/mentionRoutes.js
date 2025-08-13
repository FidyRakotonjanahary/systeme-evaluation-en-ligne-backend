const express = require('express');
const MentionController = require('../controllers/mentionController');
const router = express.Router();

router.get('/', MentionController.getMentions);

module.exports = router;