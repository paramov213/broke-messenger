const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Обслуживаем статические файлы из текущей папки
app.use(express.static(path.join(__dirname)));

// Явно указываем, что отдавать на главной странице
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ... (оставь здесь свой остальной код socket.io)

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ BROKE Server is running on port ${PORT}`);
});
