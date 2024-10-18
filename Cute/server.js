const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Подключение к базе данных MongoDB
mongoose.connect('mongodb://localhost/tth-messenger', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Настройка сессий
app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true
}));

// Подключение маршрутов
const userRoutes = require('./routes/users');
const channelRoutes = require('./routes/channels');
app.use('/user', userRoutes);
app.use('/channel', channelRoutes);

// Основной маршрут
app.get('/', (req, res) => {
  res.render('index');
});

// Настройка сокетов
io.on('connection', socket => {
  console.log('Новое соединение');

  socket.on('joinChannel', (channelId) => {
    socket.join(channelId);
  });

  socket.on('message', (msg) => {
    io.to(msg.channelId).emit('message', msg);
  });
});

server.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});