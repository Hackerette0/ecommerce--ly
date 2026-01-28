const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  skinTypeAtTime: String, 
  isModerated: { type: Boolean, default: false },
  moderationScore: { type: Number, default: 1 }, 
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ForumPost', forumPostSchema);