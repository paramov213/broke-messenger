const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Настройка статики для Render
app.use(express.static(__dirname));

// Исправление ошибки "Cannot GET /"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let users = {}; 
let channels = {}; 

io.on('connection', (socket) => {
    socket.on('auth', (data) => {
        if (!users[data.username]) {
            users[data.username] = { 
                password: data.password, 
                nickname: data.username,
                bio: "Пользователь BROKE", nft: [], id: null 
            };
        }
        if (users[data.username].password === data.password) {
            socket.emit('auth_success', users[data.username]);
        }
    });

    socket.on('admin_action', (data) => {
        if (data.adminPass === '565811') {
            const target = users[data.targetUser];
            if (target) {
                if (data.type === 'gift_nft') target.nft.push(data.nftUrl);
                if (data.type === 'set_id') target.id = data.newId;
                io.emit('update_profile', {username: data.targetUser, data: target});
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
