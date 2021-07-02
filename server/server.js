const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const connections = [];
const users = [];

server.listen(process.env.PORT || 3000);

app.use(express.static('frontend'))

io.sockets.on('connection', (socket) => {

    connections.push(socket);
    console.log('Connected users : %s', connections.length);

    socket.on('disconnect', (data) => {
        if (!socket.username) return;
        connections.splice(users.indexOf(socket.username), 1);
        users.splice(users.indexOf(socket.username), 1);
        //console.log(users,connections);
        updateUsers();
        console.log('Connected users : %s', connections.length);
    });

    socket.on('sendMessage', (data) => {
        io.sockets.emit('newMessage', {
            msg: data.msg,
            user: socket.username
        });
    });

    socket.on('newUser', (data) => {
        socket.username = data
        users.push(socket.username);
        console.log(users);
        updateUsers();
    });

    const updateUsers = () => {
        socket.broadcast.emit('getUsers', {
            users: users
        });

        socket.emit('getUsers', {
            users: users
        });
    }

});
