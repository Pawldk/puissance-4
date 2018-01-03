const $firstRow = $('.row:first-of-type');
const $info = $('.info');
const speed = 66;

var player = 'yellow';
var nbFilledCell = 0;

if (myColor === 'yellow')
{
    console.log("C'est moi qui commence");

    $info.text(`C'est à toi de commencer ${yellowPseudo}`);
    $firstRow.on('click', '.cell > .token', onClickColumn);
}
else
{
    console.log(`C'est à ${yellowPseudo} de commencer`);

    $info.text(`C'est à ${yellowPseudo} de commencer`);
    $firstRow.off('click');
}

function onClickColumn(event)
{
    const column = $(event.target).parent().index() + 1;    
    const myShot =
    {
        room: room,
        column: column
    }

    socket.emit('shot', myShot);
    $firstRow.off('click');    
    
    playOnColumn(column);
}

function playOnColumn(column)
{
    let row = 6;

    while (true)
    {
        const $token = $(`.row:nth-of-type(${row}) > .cell:nth-of-type(${column}) > .token`);

        if ($token.is('.red, .yellow'))
        {
            row--;
        }
        else
        {
            console.log(`Colonne ${column} : jeton ${player === 'red' ? 'rouge' : 'jaune'} tombe en ligne ${row}\n`);
            
            moveToken(column, 1, row);

            return;
        }
    }
}

function moveToken(column, row, end)
{
    const $token = $(`.row:nth-of-type(${row}) > .cell:nth-of-type(${column}) > .token`);

    $token.addClass(player);

    if (row === end)
    {
        $token.parent().addClass(player);
        $token.parent().parent().addClass(player + column);
        nbFilledCell++;

        if (power4(column))
        {
            if (player === myColor)
            {
                console.log(`Super, j'ai gagné !`)

                $info.text(`Bravo ${me}, tu a gagné !`);
            }
            else
            {
                console.log(`Oh non ! J'ai perdu...`);

                $info.text(`Désolé ${me}, tu a perdu...`);
            }

            $firstRow.off('click');
            return;
        }

        if (nbFilledCell === 42)
        {
            $info.text(`Match nul...`);
            $firstRow.off('click');
            return;
        }

        changePlayer();        
    }
    else
    {
        setTimeout
        (
            () =>
            {
                $token.removeClass(player);
                row++;
            
                moveToken(column, row, end);
            },
            speed
        );
    }
}

function power4(column)
{
    return $
    (
        Array(4).fill(`.${player}`).join(' + ') + ', ' +
        Array(4).fill(`.${player}${column}`).join(' + ') + ', ' +
        Array(4).fill('').map
        (
            (_, offset) => Array(4).fill(`.${player}`).map
                (
                    (value, index) => value + (column + index - offset)
                ).join(' + ')
        ).join(', ') + ', ' +
        Array(4).fill('').map
        (
            (_, offset) => Array(4).fill(`.${player}`).map
                (
                    (value, index) => value + (column - index + offset)
                ).join(' + ')
        ).join(', ')
    ).length;
}

function changePlayer()
{
    player = (player === 'red' ? 'yellow' : 'red');

    if (player === myColor)
    {
        console.log(`C'est à mon tour`);

        $info.text(`A toi de jouer ${player === 'red' ? redPseudo : yellowPseudo}`);
        $firstRow.on('click', '.cell > .token', onClickColumn);
    }
    else
    {
        console.log(`C'est à ${player === 'red' ? redPseudo : yellowPseudo} de jouer`);

        $info.text(`C'est à ${player === 'red' ? redPseudo : yellowPseudo} de jouer`);
        $firstRow.off('click');
    }
}

function wait(time)
{ 
    return new Promise
    (
        resolve => setTimeout(resolve, time)
    );
}