const socket = io('/');
const h2 = $('h2');
const h1 = $('h1');
const form = $('form');
const myPseudo = $('form').attr('name');
const thisRoom = $('input[name="room"]');
const myColor = $('input[name="yourColor"]');
const yellowPseudo = $('input[name="yellowPseudo"]');
const redPseudo = $('input[name="redPseudo"]');
const start = $('#start');

const message =
{
    pseudo: myPseudo,
    content: `Bonjour Maître, je m'appelle ${myPseudo}.`
};
const request = 
{
    pseudo: myPseudo,
    object: `Puis-je jouer ?`
};

socket.emit('message', message);
socket.emit('request', request);

socket.on
(
    'color',
    (color) =>
    {
        myColor.val(color);        
    }
);

socket.on
(
    'yellow-pseudo',
    (pseudo) =>
    {
        yellowPseudo.val(pseudo);

        if (h2.text() !== '')
        {
            h2.text(`${h2.text()} VS ${pseudo}`);
        }
        else
        {
            h2.text(pseudo);
        }
    }
);

socket.on
(
    'red-pseudo',
    (pseudo) =>
    {
        redPseudo.val(pseudo);

        if (h2.text() !== '')
        {
            h2.text(`${h2.text()} VS ${pseudo}`);
        }
        else
        {
            h2.text(pseudo);
        }

        start.attr('disabled', false);
    }
);

socket.on
(
    'room',
    (room) =>
    {
        thisRoom.val(room);
        h1.text(room);
    }
);

socket.on
(
    'start',
    () =>
    {
        form.submit();
    }
)

start.on
(
    'click',
    () =>
    {
        socket.emit('start', thisRoom.val());
    }
);