const pallette = document.querySelector(".pallette");
const palletteContainer = document.querySelector(".pallette-container");
const randomColorButton = document.querySelector(".random-color");
const rainbowButton = document.querySelector(".rainbow-color");
const eraserButton = document.querySelector(".eraser");
const resetButton = document.querySelector(".reset");
const sizePicker = document.querySelector("#size-picker");
const sizeLabel = document.querySelector("#size-label");
const sheet = document.querySelector(".sheet-container");

// variables that indicate if rainbow colors or eraser mode is currently active
let rainbowMode = false;
let eraserMode = false;

let sheetSize = 16;
let color = pallette.value;
fillColor(palletteContainer);

/**
 * Sets background-color style property of the provided element to the random
 * color, white color, or current color depending on rainbow and eraser modes.
 * @param {Element} element HTML Element that needs to be filled with color.
 */
function fillColor(element) {
    if (rainbowMode) {
        setRandomColor();
        element.style.backgroundColor = color;
    }
    else if (eraserMode) {
        element.style.backgroundColor = "white";
    }
    else {
        element.style.backgroundColor = color;
    };
};

/**
 * Adds mouse event handles that are required to properly color the element.
 * @param {Element} element HTML element that needs to be assigned with
 * drawing event handlers. 
 */
function assignDrawingEvents(element) {
    element.addEventListener("mouseenter", (e) => {
        if (e.buttons == 1) {
            fillColor(element);
        };
    });
    element.addEventListener("mousedown", (e) => {
        if (e.button == 0) {
            fillColor(element)
        };
    });
}

/** 
 * Switches off both rainbow and eraser modes.
 * Initializes the sheet container with clean rows and columns.
 * @param {int} size required size of the drawing sheet.
 */
function initSheet(size) {
    sheet.innerHTML = "";
    unRainbowMode();
    unEraserMode();

    for (let i = 1; i <= size; i++) {
        const row = document.createElement("div");
        row.classList.add("sheet-row");

        for (let j = 1; j <= size; j++) {
            const square = document.createElement("div");
            square.classList.add("sheet-square");
            square.style.width = `${640 / size}px`;
            square.style.height = `${640 / size}px`;
            row.appendChild(square);

            assignDrawingEvents(square);
        };
        sheet.appendChild(row);
    };
};

/**
 * Adds black border to the element if the selected color
 * is lighter than threshold luma (calculated per ITU-R BT.709)
 * @param {Element} element Element that needs to be checked for border adding
 * @param {String} bgColor HEX color string
 */
function decideBorder(element, bgColor) {
    bgColor = bgColor.substring(1);      // strip #
    let rgb = parseInt(bgColor, 16);   // convert rrggbb to decimal
    let r = (rgb >> 16) & 0xff;  // extract red
    let g = (rgb >> 8) & 0xff;  // extract green
    let b = (rgb >> 0) & 0xff;  // extract blue

    let luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if (luma >= 210) {
        element.style.border = "solid black 1px";
    }
    else {
        element.style.border = "none";
    };
};

/** 
 * Switches off both rainbow and eraser modes.
 * Gets the color value from the pallete, passes it to the container div
 * and adds border if the color is too light.
 */
function pickColor() {
    unRainbowMode();
    unEraserMode();

    color = pallette.value;
    palletteContainer.style.backgroundColor = color;
    decideBorder(palletteContainer, color);
};

/**
 * Sets color to a random valid hex value.
 */
function setRandomColor() {
    color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    pallette.value = color;
}

/**
 * Switches off rainbow mode, deactivates rainbow mode button.
 */
function unRainbowMode() {
    rainbowMode = false;
    rainbowButton.classList.remove("active");
};

/**
 * Switches off eraser mode, deactivates eraser mode button.
 */
function unEraserMode() {
    eraserMode = false;
    eraserButton.classList.remove("active");
};

// passing click from a div container to a hidden color input
palletteContainer.addEventListener("click", () => pallette.click());
pallette.addEventListener("change", pickColor);

randomColorButton.addEventListener("click", () => {
    setRandomColor();
    pickColor();
});

// when rainbow button is pressed while active:
// set the current color as active
// otherwise turn off eraser mode and activate rainbow mode
rainbowButton.addEventListener("click", () => {
    if (rainbowMode) {
        pickColor();
    }
    else {
        unEraserMode();
        rainbowMode = true;
        rainbowButton.classList.add("active");
    }
});

// when eraser button is pressed while active:
// set the current color as active
// otherwise turn off rainbow mode and activate eraser mode
eraserButton.addEventListener("click", () => {
    if (eraserMode) {
        pickColor();
    }
    else {
        unRainbowMode();
        eraserMode = true;
        eraserButton.classList.add("active");
    }
});

// reinitializes the drawing sheet with the current sheetSize
resetButton.addEventListener("click", () => {
    initSheet(sheetSize);
});

sizePicker.addEventListener("input", () => {
    sheetSize = sizePicker.value;
    sizeLabel.textContent = sheetSize;
    initSheet(sheetSize);
});

initSheet(sheetSize);
