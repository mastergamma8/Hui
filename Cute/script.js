const socket = io();

// Пример обработки событий сокетов
socket.on('message', (msg) => {
  console.log('Новое сообщение:', msg);
});