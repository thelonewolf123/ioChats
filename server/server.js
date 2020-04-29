const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const frontend = '/home/cyberhunter/Projects/node/ioChats/frontend';
const connections = [];
const users = [];

server.listen(process.env.PORT || 3000);

app.get('/', (req, res) => {
    console.log('Server is running...,');
    res.sendFile(frontend + '/html/index.html');
});


app.get('/css/bootstrap.min.css', (req, res) => {
    res.sendFile(frontend + '/css/bootstrap.min.css')
});

app.get('/javascript/index.js', (req, res) => {
    res.sendFile(frontend + '/javascript/index.js')
});

io.sockets.on('connection', (socket) => {

    connections.push(socket);
    console.log('Connected users : %s', connections.length);

    socket.on('disconnect', (data) => {
        if (!socket.username) return;
        connections.splice(connections.indexOf(socket), 1);
        users.splice(users.indexOf(socket.username), 1);
        updateUsers();
        console.log('Connected users : %s', connections.length);
    });

    socket.on('sendMessage', (data) => {
        io.sockets.emit('newMessage', {
            msg: data.msg,
            user: socket.username
        });
    });

    socket.on('newUser', (data, callback) => {
        callback(true);
        socket.username = data
        users.push(socket.username);
        console.log(users);
        updateUsers();
    });

    const updateUsers = () => {
        socket.emit('getUsers', {
            users: users
        });
    }

});