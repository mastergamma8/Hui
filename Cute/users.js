const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Страница регистрации
router.get('/register', (req, res) => {
    res.render('register'); // Отображение шаблона регистрации
});

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Проверка на совпадение паролей
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Сохранение пользователя в сессии
    req.session.user = newUser;

    res.redirect('/');
});

// Авторизация пользователя
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Поиск пользователя в базе данных
    const user = await User.findOne({ username });

    // Проверка пользователя и пароля
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.status(400).send('Invalid username or password');
    }
});

module.exports = router;