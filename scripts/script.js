const BRUSH     = document.querySelector('.brush');
const ERASER    = document.querySelector('.eraser');
const CLEAR     = document.querySelector('.clear');
const SAVE      = document.querySelector('.save');
const SIZE      = document.querySelector('.size');

const DRAW_PAD  = document.querySelector('.draw-pad');

const DEFAULT_BACKGROUND_COLOR = 'white'

let coloringColor = 'black';    

let padSize = 5;

let state = '';

fillDrawPad(padSize);

BRUSH.addEventListener('click', () => {
    state = 'drawing';
    console.log('drawing')
})

ERASER.addEventListener('click', () => {
    state = 'eraser'
    console.log('erasing')

})


// bugged, only adds more elements, need to go through elements and whiten them instead.
CLEAR.addEventListener('click', () => {
    fillDrawPad(padSize)
})


function setColor(input) {
    coloringColor = input.value;
    console.log("selected color: " + input.value);
}

function fillDrawPad(newSize) {


    let column = 1;
    let row = 1;

    while (column <= newSize) {
        let cell = document.createElement("div");
        cell.classList.add('default-row');
        DRAW_PAD.appendChild(cell);
        column = column + 1;



        while (row <= newSize) {
            let newCell = document.createElement("div");
            newCell.classList.add('default-cell');

            newCell.addEventListener('click', () => colorCell(newCell));


            cell.appendChild(newCell);
            row = row + 1;
        }
        
        row = 1;
    }
}

function colorCell(cell) {
    if (state == 'drawing') {
        console.log('in coloringColor');
        cell.style.backgroundColor = coloringColor;
    } else {
        cell.style.backgroundColor = 'white';
    }
}