const express = require('express');
const Channel = require('../models/channel');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Настройка загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Маршрут для создания канала
router.post('/create', async (req, res) => {
  const { name } = req.body;
  const newChannel = new Channel({ name, members: [req.session.user.username] });
  await newChannel.save();
  res.redirect(`/channel/${newChannel._id}`);
});

// Маршрут для публикации поста
router.post('/:id/post', upload.single('media'), async (req, res) => {
  const channel = await Channel.findById(req.params.id);
  const newPost = { text: req.body.text, timestamp: Date.now() };

  if (req.file) {
    newPost.media = `/uploads/${req.file.filename}`;
  }

  channel.posts.push(newPost);
  await channel.save();

  res.redirect(`/channel/${req.params.id}`);
});

module.exports = router;