const BRUSH     = document.querySelector('.brush');
const ERASER    = document.querySelector('.eraser');
const CLEAR     = document.querySelector('.clear');
const SAVE      = document.querySelector('.save');
const SIZE      = document.querySelector('.size');
const ZOOM_SIZE = document.querySelector('.zoom');

const DRAW_PAD  = document.querySelector('.draw-pad');

const DEFAULT_BACKGROUND_COLOR = 'white'

let coloringColor = 'black';    

let padSize = 8;
let padZoom = 60;

let state = '';
let isMouseDown = false;

fillSizeSelection();
fillZoomSelection();
fillDrawPad(padSize);

BRUSH.addEventListener('click', () => {
    state = 'drawing';
})

ERASER.addEventListener('click', () => {
    state = 'eraser'
})

CLEAR.addEventListener('click', () => {
  const ok = window.confirm('Clear the drawing? This cannot be undone.');
  if (!ok) return;
  
  clearDrawPad();
});

// Zoom functionality for draw-pad
DRAW_PAD.addEventListener('wheel', function(e) {
    // Scroll up
    if (e.deltaY < 0){
        padZoom = padZoom + 1;
        zoomDrawPad(padZoom)
    } 
    // Scroll down 
    else if (e.deltaY > 0) {
        if (padZoom === 1) return;
        padZoom = padZoom -1;
        zoomDrawPad(padZoom)
    }
});

function zoomDrawPad(newZoom) {
    if (newZoom > 100 || newZoom < 1) return;

    DRAW_PAD.style.width = `${padSize * newZoom}px`;
    DRAW_PAD.style.height = `${padSize * newZoom}px`;

    ZOOM_SIZE.value = newZoom;
}


function setColor(input) {
    coloringColor = input.value;
    console.log("selected color: " + input.value);
}

function fillDrawPad(newSize) {

    DRAW_PAD.innerHTML = "";

    let column = 1;
    let row = 1;

    zoomDrawPad(padZoom)

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

            // Mouse
            newCell.addEventListener('mousedown', 
                () => colorHoveredCell(newCell));

            newCell.addEventListener('mouseup', setMouseUp);

            newCell.addEventListener('mouseenter', 
                () => checkIfColoring(newCell));


            // Touchscreen not yet implemented.

            // newCell.addEventListener('touchstart', 
            //     () => colorHoveredCell(newCell));

            // newCell.addEventListener('touchend', setMouseUp);

            // newCell.addEventListener('touchmove', 
            //     () => checkIfColoring(newCell))


            cell.appendChild(newCell);
            row = row + 1;
        }
        
        row = 1;
    }
}

function clearDrawPad() {
    document.querySelectorAll('.default-cell').forEach(c => {
        c.style.backgroundColor= DEFAULT_BACKGROUND_COLOR;
        c.dataset.color = DEFAULT_BACKGROUND_COLOR;
    })
}


function colorCell(cell) {
    if (state == 'drawing') {
        const paint = coloringColor
        cell.style.backgroundColor = coloringColor;
        cell.dataset.color = paint;
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
    else {
        console.log("mouse not down");
    }
}

function fillSizeSelection() {
    for (let i = 1; i <= 100; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;

        option.addEventListener('click', () => setSize(option.value));

        SIZE.appendChild(option);
    }

    SIZE.value = padSize;
}

function fillZoomSelection() {
    for (let i = 1; i <= 100; i++) {
        const zoomSize = document.createElement("option");
        zoomSize.value = i;
        zoomSize.textContent = i;

        zoomSize.addEventListener('click', () => setSize(option.value));

        ZOOM_SIZE.appendChild(zoomSize);
    }
}

SIZE.addEventListener('change', (e) => {
    setSize(e.target.value);
})

ZOOM_SIZE.addEventListener('change', (e) => {
    zoomDrawPad(e.target.value) 
})

function setSize(newSize) {
    padSize = newSize;
    fillDrawPad(padSize)
}