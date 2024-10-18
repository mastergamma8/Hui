const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  avatar: String,
  channels: [String] // Массив каналов, в которых состоит пользователь
});

module.exports = mongoose.model('User', UserSchema);