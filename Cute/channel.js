const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  name: String,
  members: [String],
  posts: [
    {
      text: String,
      media: String,
      timestamp: Date,
    }
  ],
  pinnedPost: Object,
  roles: { type: Map, of: String } // admin, moderator, member
});

module.exports = mongoose.model('Channel', ChannelSchema);