const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

const rooms =
[{
    yellowPseudo: '',
    redPseudo: ''
}];


app.use
(
    express.urlencoded
    (
        {
            extended: false
        }
    )
);

app.use
(
    '/static',
    express.static('static')
);

app.set('views', './views');
app.set('view engine', 'ejs');

app.get
(
    '/',
    (request, response) =>
    {
        response.render
        (
            'login', 
            {
                title: 'Puissance 4',
                h1: 'Ô toi qui ose pénétrer en ce lieu !',
                h2: 'Prêt pour une super partie de puissance 4 ?'
            }
        )
    }
);

app.post
(
    '/',
    (request, response) =>
    {
        if
        (
            request.body !== undefined &&
            request.body.pseudo !== undefined && request.body.pseudo !== ''
        )
        {
            const pseudo = request.body.pseudo;
                
            response.render
            (
                'draw', 
                {
                    title: 'Puissance 4',
                    pseudo: pseudo
                }
            );
        }
        else if
        (
            request.body !== undefined &&
            request.body.room !== undefined && request.body.room !== '' &&
            request.body.yourColor !== undefined && request.body.yourColor !== '' &&
            request.body.yellowPseudo !== undefined && request.body.yellowPseudo !== '' &&
            request.body.redPseudo !== undefined && request.body.redPseudo !== ''
        )
        {
            const room = request.body.room;
            const yourColor = request.body.yourColor;
            const yellowPseudo = request.body.yellowPseudo;
            const redPseudo = request.body.redPseudo;
    
            response.render
            (
                'game', 
                {
                    title: 'Puissance 4',
                    room: room,
                    myColor: yourColor,
                    yellowPseudo: yellowPseudo,
                    redPseudo: redPseudo
                }
            );
        }
        else 
        {
            response.redirect('/');
        }
    }
);

server.listen
(
    port,
    ()=>
    {
        console.log('Je suis Puissance 4, le maître du jeu.');
    }
);

io.on
(
    'connection',
    (socket) =>
    {
        console.log('Qui va là ?\n');

        socket.on
        (
            'message',
            (message) =>
            {
                console.log(message['content']);
            }
        );

        socket.on
        (
            'request',
            (request) =>
            {
                const pseudo = request['pseudo'];
                const object = request['object'];

                console.log(object + "\n");

                let room = rooms.length - 1;                
                const roomIsFull = rooms[room].yellowPseudo === '' || rooms[room].redPseudo !== '';

                if (roomIsFull)
                {
                    room++;
                    rooms.push({yellowPseudo: pseudo, redPseudo: ''});
                    socket.emit('color', 'yellow');
                    socket.emit('yellow-pseudo', pseudo);
                    socket.emit('room', `salle ${room}`);                    
                }
                else
                {
                    rooms[room].redPseudo = pseudo;
                    socket.emit('color', 'red');                    
                    socket.emit('yellow-pseudo', rooms[room].yellowPseudo);
                    socket.emit('red-pseudo', pseudo);
                    socket.emit('room', `salle ${room}`);
                    socket.to(`salle ${room}`).broadcast.emit('red-pseudo', pseudo);
                }

                console.log(`${pseudo}, tu peux rejoindre la salle ${room}\n`);

                socket.join(`salle ${room}`);
            }
        );

        socket.on
        (
            'start',
            (room) =>
            {
                socket.to(room).broadcast.emit('start');
            }
        );

        socket.on
        (
            'room',
            (room) =>
            {
                socket.join(room);
            }
        );

        socket.on
        (
            'shot',
            (shot) =>
            {
                socket.to(shot['room']).broadcast.emit('adv-shot', shot['column']);
            }
        )
    }
);