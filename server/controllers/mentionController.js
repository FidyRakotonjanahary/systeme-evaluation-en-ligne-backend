const MentionModel = require('../models/mentionModel');
const { asyncHandler } = require('../utils/asyncHandler');

const MentionController = {
  getMentions: asyncHandler(async (req, res) => {
    const mentions = await MentionModel.findAll();
    res.json(mentions);
  })
};

module.exports = MentionController;