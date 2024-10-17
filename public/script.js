const socket = io();

// Переменные для статуса "печатает..."
let typing = false;
let timeout = undefined;

// Отправка статуса "печатает..."
const typingTimeout = () => {
    typing = false;
    socket.emit('stopTyping');
};

const nickname = document.getElementById('nickname');
const messageInput = document.getElementById('message');
const fileInput = document.getElementById('fileInput');
const chatForm = document.getElementById('chat-form');
const chatWindow = document.getElementById('chat-window');
const typingIndicator = document.getElementById('typing-indicator');

// Обработка отправки сообщения
chatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const message = messageInput.value;

    if (message) {
        const userNickname = nickname.value || 'Аноним';
        socket.emit('chatMessage', { nickname: userNickname, message });  // передаем объект с никнеймом и сообщением
        messageInput.value = '';
        socket.emit('stopTyping');
    }

    // Если отправляется файл
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const userNickname = nickname.value || 'Аноним';
            socket.emit('chatImage', { nickname: userNickname, image: e.target.result });
        };
        reader.readAsDataURL(file);
        fileInput.value = '';
    }
});

// Отслеживание ввода текста и отправка статуса "печатает..."
messageInput.addEventListener('input', function () {
    if (!typing) {
        typing = true;
        socket.emit('typing');
        timeout = setTimeout(typingTimeout, 2000);
    } else {
        clearTimeout(timeout);
        timeout = setTimeout(typingTimeout, 2000);
    }
});

// Получение сообщений с сервера и вывод в чат
socket.on('chatMessage', ({ nickname, message }) => {
    const msgElem = document.createElement('div');
    msgElem.innerHTML = `<strong>${nickname}:</strong> ${message}`;  // здесь message должен быть текстом
    chatWindow.appendChild(msgElem);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Получение изображений с сервера и вывод в чат
socket.on('chatImage', ({ nickname, image }) => {
    const imgElem = document.createElement('div');
    imgElem.innerHTML = `<strong>${nickname}:</strong> <br> <img src="${image}" style="max-width: 100%; height: auto;">`;
    chatWindow.appendChild(imgElem);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Отображение статуса "печатает..."
socket.on('userTyping', (nickname) => {
    typingIndicator.textContent = `${nickname} печатает...`;
});

// Удаление статуса "печатает..." когда пользователь прекращает ввод
socket.on('userStoppedTyping', () => {
    typingIndicator.textContent = '';
});

// Обновление числа онлайн пользователей
socket.on('updateOnlineCount', (count) => {
    document.getElementById('online-count').textContent = count;
    const statusIndicator = document.getElementById('status-indicator');
    if (count > 0) {
        statusIndicator.classList.remove('status-red');
        statusIndicator.classList.add('status-green');
    } else {
        statusIndicator.classList.remove('status-green');
        statusIndicator.classList.add('status-red');
    }
});