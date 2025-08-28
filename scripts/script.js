const BRUSH         = document.querySelector('.brush');
const ERASER        = document.querySelector('.eraser');
const CLEAR         = document.querySelector('.clear');
const SAVE          = document.querySelector('.save');
const SIZE          = document.querySelector('.size');
const ZOOM_SIZE     = document.querySelector('.zoom');
const RAINBOW_MODE  = document.querySelector('.rainbow');
const DRAW_PAD      = document.querySelector('.draw-pad');
const GRID          = document.querySelector('.grid');

const DEFAULT_CELL_BACKGROUND_COLOR = 'white';
const DEFAULT_TOOL_BACKGROUND_COLOR = '#DCDCDC';
const ACTIVATED_BACKGROUND_COLOR    = '#1E93AB';

let coloringColor = 'black';    

let padSize = 8;
let padZoom = 60;
const MINIMUM_ZOOM = 1;
const MAXIMUM_ZOOM = 100;
const MAXIMUM_PIXELS = 950;


let state       = '';
const STATES = {
    DRAWING: 'drawing',
    ERASING: 'erasing',
}

let isMouseDown = false;
let rainbowMode = false;

let isDrawing = false;
let isErasing = false;

let isGridOn = false;


fillSizeSelection();
fillZoomSelection();
fillDrawPad(padSize);

BRUSH.addEventListener('click', () => {
    if (isDrawing === false){
        state = STATES.DRAWING;
        isDrawing = true;
        BRUSH.style.backgroundColor = ACTIVATED_BACKGROUND_COLOR;

        if (isErasing === true)  {
            isErasing = false;
            ERASER.style.backgroundColor = DEFAULT_TOOL_BACKGROUND_COLOR;
        }
    } else {
        state = '';
        isDrawing = false;
        BRUSH.style.backgroundColor = DEFAULT_TOOL_BACKGROUND_COLOR;
    }
})

ERASER.addEventListener('click', () => {
    if (isErasing === false){
        state = STATES.ERASING;
        isErasing = true;
        ERASER.style.backgroundColor = ACTIVATED_BACKGROUND_COLOR;

        if (isDrawing === true) {
            isDrawing = false;
            BRUSH.style.backgroundColor = DEFAULT_TOOL_BACKGROUND_COLOR;
        }

    } else {
        state = '';
        isErasing = false;
        ERASER.style.backgroundColor = DEFAULT_TOOL_BACKGROUND_COLOR;
    }
})

GRID.addEventListener('click', () => {
    gridDrawPad();
})

CLEAR.addEventListener('click', () => {
    if (warningCheck() === false) return;
  
    clearDrawPad();

});

RAINBOW_MODE.addEventListener('click', () => {
    if (rainbowMode === false) {
        rainbowMode = true;
    } else {
        rainbowMode = false;
    }

    if (rainbowMode === true) {
        RAINBOW_MODE.style.backgroundColor = ACTIVATED_BACKGROUND_COLOR;
    } else {
        RAINBOW_MODE.style.backgroundColor = DEFAULT_TOOL_BACKGROUND_COLOR;
    }
})

// Zoom functionality for draw-pad
DRAW_PAD.addEventListener('wheel', function(e) {
    // Scroll up
    if (e.deltaY < 0){
        if ((padSize * padZoom) > MAXIMUM_PIXELS) {
            return;
        }

        padZoom = padZoom + 1;
        zoomDrawPad(padZoom)
    } 
    // Scroll down 
    else if (e.deltaY > 0) {
        padZoom = padZoom -1;
        zoomDrawPad(padZoom)
    }
});

SIZE.addEventListener('change', (e) => {
    if (warningCheck() === true) {
        setSize(e.target.value);
    } else {
        e.target.value = padSize;
    }
})

ZOOM_SIZE.addEventListener('change', (e) => {
    zoomDrawPad(e.target.value) 
})

function zoomDrawPad(newZoom) {
    if (newZoom > MAXIMUM_ZOOM || newZoom < MINIMUM_ZOOM || (padSize * newZoom) > MAXIMUM_PIXELS) return;

    DRAW_PAD.style.width = `${padSize * newZoom}px`;
    DRAW_PAD.style.height = `${padSize * newZoom}px`;

    ZOOM_SIZE.value = newZoom;
}


function warningCheck() {
    const ok 
        = window.confirm('Clear the drawing? This cannot be undone.');

    if (!ok) return false;

    return true;
}

function setColor(input) {
    coloringColor = input.value;
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

    if (isGridOn === true) {
        isGridOn = false;
        gridDrawPad();
    }
}

function clearDrawPad() {
    document.querySelectorAll('.default-cell').forEach(c => {
        c.style.backgroundColor= DEFAULT_CELL_BACKGROUND_COLOR;
        c.dataset.color = DEFAULT_CELL_BACKGROUND_COLOR;
    })
}

function gridDrawPad() {
    let allCells = document.querySelectorAll('.default-cell');

    if (isGridOn === false) {
        isGridOn = true;
        
        allCells.forEach(node => {
            node.classList.add('default-cell-grid-on');
        })

        GRID.style.backgroundColor = ACTIVATED_BACKGROUND_COLOR;
    } else {
        isGridOn = false;
        GRID.style.backgroundColor = DEFAULT_TOOL_BACKGROUND_COLOR;
        allCells.forEach(node => {
            node.classList.remove('default-cell-grid-on');
        })
    }
}

function colorCell(cell) {
    if (state == 'drawing') {

        let paint = coloringColor;

        if (rainbowMode === true) {
            paint = getRandomColor();
        } else {
            paint = coloringColor
        }
        
        cell.style.backgroundColor = paint;
        cell.dataset.color = paint;
    } else if (state === STATES.ERASING) {
        cell.style.backgroundColor = DEFAULT_CELL_BACKGROUND_COLOR;
    }

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

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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


function setSize(newSize) {
    padSize = newSize;
    fillDrawPad(padSize)
}