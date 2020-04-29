const send = document.getElementById('send');
const message = document.getElementById('message');
const chat = document.getElementById('messages');
const login = document.getElementById('login');
const online = document.getElementById('online');
const username = document.getElementById('username');

document.getElementById('chat-area').style.visibility = 'hidden';

login.addEventListener('click', (event) => {

    const userid = username.value;

    document.getElementById('login-area').style.visibility = 'hidden';
    document.getElementById('chat-area').style.visibility = 'visible';

    const socket = io.connect();

    socket.emit('newUser', {
        userid
    });

    send.addEventListener('click', (event) => {
        // console.log('Send button is clicked');
        socket.emit('sendMessage', {
            msg: message.value
        });
        message.value = '';
    });

    socket.on('newMessage', (data => {
        const msg = document.createElement('div');
        msg.classList.add('list-group-item');
        msg.innerHTML = data.user.userid + ' : ' + data.msg;
        chat.appendChild(msg);
    }));

    socket.on('getUsers', (data) => {
        removeItems();

        for (const user of data.users) {
            const new_user = document.createElement('div');
            new_user.classList.add('list-group-item');
            new_user.id = user.userid;
            new_user.innerHTML = user.userid;
            online.appendChild(new_user);
        }
    });

    const removeItems = () => {
        const lists = document.querySelector("#online").querySelectorAll("div");

        for (const item of lists) {
            item.remove();
        }
    }

});