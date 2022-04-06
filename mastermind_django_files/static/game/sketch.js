// Generic Variables
let w; // width of the canvas
let h; // height of the canvas

// Grid Variables
let columns; // columns in the game (how long the words will be)
let rows; // rows in the game (total amt of guesses)
let gridSize; // size of the grid boxes
let squareSize; // size of the letter boxes
let yOffset; // offset for pushing the grid up/down
let xOffset; // offset for pushing the grid left/right
let ymargin; // calculating the xmargin
let xMargin; // calculating the ymargin

// Colors
let gridColor; // color of the grid
let letterBlank; // color of the letter boxes when no letters have been used
let letterRight; // color of when a guessed letter is correct
let letterClose; // color of when a guessed letter is close
let letterWrong; // color of when a guessed letter is wrong
let btnStart; // color of menu start button
let btnGeneric; // color of generic button

// Menu variable
let menu;

// Button Variables
let BUTTON_HEIGHT;
let BUTTON_WIDTH;

// Letters array
let letterIndex;
let wordIndex;
let letters;
let goalWord;

// Regular expression for letters
const regex = /[A-Za-z]+/;

/* --------------------------- */
/* ----- P5.JS FUNCTIONS ----- */
/* --------------------------- */

function setup () {
    /* ----- Initialize variables -----*/
    // Generic variables
    w = windowWidth;
    h = windowHeight;

    // Grid Variables
    columns = 4;
    rows = 6;
    gridSize = 75;
    squareSize = 60;
    yOffset = 45;
    xOffset = 0;

    // Color variables
    gridColor = 50;
    letterBlank = 60;
    letterRight = color(19, 186, 65);
    letterClose = color(255, 159, 45);
    letterWrong = color(247, 65, 65);
    btnStart = color(42, 161, 151);
    btnGeneric = color(131, 148, 150);

    // Menu variable
    menu = 0;

    // Button Variables
    BUTTON_HEIGHT = 50;
    BUTTON_WIDTH = 100;

    // Letters array
    letterIndex = 0;
    wordIndex = 0;
    letters = [...new Array(rows)].map(() => new Array(columns));

    // Create the canvas we'll work on
    createCanvas(w, h);
} // setup()

function draw () {
    if (menu === 0) {
        menuView();
    } else if (menu === 1) {
        goalWord = "PEAR";
        gameView();
    }
} // draw()

/* --------------------- */
/* ----- FUNCTIONS ----- */
/* --------------------- */

function mouseClicked () {
    xLimit = BUTTON_WIDTH / 2;
    yLimit = BUTTON_HEIGHT / 2;

    // // log where the mouse is
    // console.log(mouseX + ", " + mouseY)
    // console.log("xLimit = " + xLimit)
    // console.log("yLimit = " + yLimit)
    // console.log("leftLimit = " + ((w/2) - xLimit) + " rightLimit = " + ((w/2) + xLimit))
    // console.log("upperLimit = " + ((h/2) - yLimit) + " rightLimit = " + ((h/2) + yLimit))

    // if we're on the base menu...
    if (menu === 0 && // ... and we're within the right x limits...
         mouseX > ((w / 2) - xLimit) && mouseX < ((w / 2) + xLimit)) // ... and we're within the right y limits...
    {
        if (mouseY > ((h / 2) - yLimit) && mouseY < ((h / 2) + yLimit))
        // ... then we've clicked a button!
        {
            menu = 1;
        } else {
            menu = 0;
        }
    }
} // mouseClicked()

function failed() {
    console.log(`You lost! :( Goal word was: ${goalWord}`);
    setTimeout(() => {
        setup();
    }, 3000); // wait for 3 seconds
} // failed()

function goalWordFill (i, j) {
    if (letters[j][i] === undefined || letters[j][i] === "" || j >= wordIndex) {
        fill(letterBlank);
    } else if (goalWord.includes(letters[j][i])) {
        fill(letterClose);
        if (goalWord[i] === letters[j][i]) {
            fill(letterRight);
        }
    } else {
        fill(letterWrong);
    }
} // goalWordFill()

function goalWordVerify () {
    win = true;
    for (let i = 0; i < columns; i++) {
        if (letters[wordIndex][i] !== goalWord[i]) {
            win = false;
        }
    }

    if (win) {
        console.log(`You won!`);
        setTimeout(() => {
            setup();
        }, 3000); // wait for 3 seconds
    }
} // goalWordVerify()

function keyPressed() {
    const character = String.fromCodePoint(keyCode);

    if (keyCode === BACKSPACE) {
        letterIndex--;
        if (letterIndex === -1) {
            letters[wordIndex][letterIndex + 1] = "";
            letterIndex++;
        } else {
            letters[wordIndex][letterIndex] = "";
        }
        // console.log(letters);
    } else if (keyCode === ENTER) {
        goalWordVerify();
        if (letterIndex !== 0 && letterIndex % columns === 0) {
            letterIndex = 0;
            wordIndex = (wordIndex + 1) % rows;
            if (wordIndex === 0) {
                failed();
            }
        }
    }
    // if not backspace or enter check for character
    else if (regex.test(character)) {
        letters[wordIndex][letterIndex] = character;
        // letterIndex = (letterIndex + 1) % columns;
        if (letterIndex < columns) {
            letterIndex++;
        }
        // console.log(letters);
    } else {
        console.log(`Bad key: ${character}`);
    }
    // console.log(`Letter: ${letterIndex} Word: ${wordIndex}`);
} // keyPressed()

function windowResized() {
    resizeCanvas(windowWidth, windowHeight, true);
    w = windowWidth;
    h = windowHeight;
} // windowResized()

/* ----------------- */
/* ----- MENUS ----- */
/* ----------------- */

function gameView () {
    background(60);
    rectMode(CORNER);

    yMargin = ((h - (rows * gridSize)) / 2) + yOffset;
    xMargin = ((w - (columns * gridSize)) / 2) + xOffset;

    /* ----- Draw the grid and letter boxes ----- */
    // for each box in the grid...
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            // ...set the xPos and yPos for the letters
            const xPos = (i * gridSize) + xMargin + ((gridSize - squareSize) / 2);
            const yPos = (j * gridSize) + yMargin + ((gridSize - squareSize) / 2);

            // ...set the gridxPos and gridyPos for this gridBoxes
            const gridxPos = (i * gridSize) + xMargin;
            const gridyPos = (j * gridSize) + yMargin;

            // ...create the two boxes in the grid

            fill(gridColor);
            square(gridxPos, gridyPos, gridSize, 4);

            goalWordFill(i, j);

            square(xPos, yPos, squareSize, 10);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(30);
            text(letters[j][i], xPos, yPos + (squareSize / 2) + 2, squareSize);

            // if (letters[i][j] != null) {
            //   print("This letter is " + letters[i][j])
            // }
        }
    }
} // gameView()

function menuView () {
    background(40);

    rectMode(CENTER);
    fill(btnStart);
    rect(w / 2, h / 2, BUTTON_WIDTH, BUTTON_HEIGHT, 10);

    textFont("Georgia");
    textAlign(CENTER, CENTER);
    textSize(25);
    fill(0);
    text("Start", w / 2, h / 2, BUTTON_WIDTH, BUTTON_HEIGHT);
} // menuView()
