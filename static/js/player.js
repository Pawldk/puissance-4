const socket = io('/');
const myColor = $('#my-color').val();
const yellowPseudo = $('.player > .yellow:first-of-type').text();
const redPseudo = $('.player > .red:first-of-type').text();
const me = (myColor === 'red' ? redPseudo : yellowPseudo);
const room = $('.room').text();

console.log(`Je suis ${me}`);
console.log(`jaunes : ${yellowPseudo}`);
console.log(`rouges : ${redPseudo}`);

socket.emit('room', room);

socket.on
(
    'adv-shot',
    (column) => 
    {
        playOnColumn(column);
    }
);