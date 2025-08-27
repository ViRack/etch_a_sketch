const BRUSH     = document.querySelector('.brush');
const ERASER    = document.querySelector('.eraser');
const CLEAR     = document.querySelector('.clear');
const SAVE      = document.querySelector('.save');
const SIZE      = document.querySelector('.size');

const DRAW_PAD  = document.querySelector('.draw-pad');

const DEFAULT_BACKGROUND_COLOR = 'white'

let coloringColor = 'black';    

let padSize = 16;

let state = '';
let isMouseDown = false;

fillDrawPad(padSize);

BRUSH.addEventListener('click', () => {
    state = 'drawing';
    console.log('drawing')
})

ERASER.addEventListener('click', () => {
    state = 'eraser'
    console.log('erasing')

})

CLEAR.addEventListener('click', clearDrawPad);


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

            // disable element drag to hold mouse and draw
            newCell.addEventListener('dragstart', (e) => {
                e.preventDefault();
            })

            newCell.addEventListener('mousedown', () => colorHoveredCell(newCell));
            newCell.addEventListener('mouseup', setMouseUp);
            newCell.addEventListener('mouseenter', () => checkIfColoring(newCell));

            cell.appendChild(newCell);
            row = row + 1;
        }
        
        row = 1;
    }
}

function clearDrawPad() {
    while (DRAW_PAD.firstChild) {
       DRAW_PAD.removeChild(DRAW_PAD.firstChild);
       console.log('clearing children');
    }
}


function colorCell(cell) {
    if (state == 'drawing') {
        console.log('in coloringColor');
        cell.style.backgroundColor = coloringColor;
    } else {
        cell.style.backgroundColor = 'white';
    }

    console.log("in colorcell" + isMouseDown)
}

function colorHoveredCell(cell) {
    isMouseDown = true;
    colorCell(cell);
}

function setMouseUp() {
    isMouseDown = false;
}

function checkIfColoring(cell) {
    if (isMouseDown) {
        colorCell(cell);
    }
}