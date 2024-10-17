const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let onlineUsers = 0;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    onlineUsers++;
    io.emit('updateOnlineCount', onlineUsers);

    socket.on('chatMessage', ({ nickname, message }) => {
        io.emit('chatMessage', { nickname, message }); // nickname и message передаются в чат
    });

    socket.on('chatImage', ({ nickname, image }) => {
        io.emit('chatImage', { nickname, image });
    });

    socket.on('typing', () => {
        socket.broadcast.emit('userTyping', socket.nickname || 'Аноним');
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('userStoppedTyping');
    });

    socket.on('disconnect', () => {
        onlineUsers--;
        io.emit('updateOnlineCount', onlineUsers);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));