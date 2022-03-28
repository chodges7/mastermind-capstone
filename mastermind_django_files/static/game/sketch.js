// Generic Variables
let w     // width of the canvas
let h     // height of the canvas
let xCur; // track which row we're on
let yCur; // track which column we're on

// Grid Variables
let columns     // columns in the game (how long the words will be)
let rows        // rows in the game (total amt of guesses)
let gridSize    // size of the grid boxes
let squareSize  // size of the letter boxes 
let yOffset     // offset for pushing the grid up/down
let xOffset     // offset for pushing the grid left/right
let ymargin     // calculating the xmargin
let xMargin     // calculating the ymargin

// Colors
let gridColor   // color of the grid
let letterBlank // color of the letter boxes when no letters have been used
let letterRight // color of when a guessed letter is correct
let letterClose // color of when a guessed letter is close
let letterWrong // color of when a guessed letter is wrong
let btnStart    // color of menu start button
let btnGeneric  // color of generic button

// Menu
let menu

// Button Variables
let BUTTON_HEIGHT
let BUTTON_WIDTH

// Letters array
let letterIndex;
let wordIndex;
let letters;

function setup() {
  /* ----- Initialize variables -----*/
  // Generic variables
  w     = windowWidth;
  h     = windowHeight;
  xCur  = 0;
  yCur  = 0;

  // Grid Variables
  columns     = 4;
  rows        = 6;
  gridSize    = 75;
  squareSize  = 60;
  yOffset     = 45;
  xOffset     = 0;
  yMargin     = (h - rows * gridSize) / 2 + yOffset;
  xMargin     = (w - columns * gridSize) / 2 + xOffset;

  // Color variables
  gridColor   = 50;
  letterBlank = 60;
  letterRight = color( 19,186, 65);
  letterClose = color(255,159, 45);
  letterWrong = color(247, 65, 65);
  btnStart    = color( 42,161,151);
  btnGeneric  = color(131,148,150);

  // Menu variable
  menu = 0;

  // Button Variables
  BUTTON_HEIGHT = 50;
  BUTTON_WIDTH = 100;

  // Letters array
  letterIndex = 0;
  wordIndex = 0;
  letters = Array.from(Array(rows), () => new Array(columns));

  // Create the canvas we'll work on
  createCanvas(w, h);
} // setup()

function draw() {
  // TODO: check the keyboard for input. 
  //   When a letter is input update the letters array at that position.

  if(menu == 0) {
    menuView();
  }
  if(menu == 1) {
    gameView();
  } 

} // draw()

/* --------------------- */
/* ----- FUNCTIONS ----- */
/* --------------------- */

function mouseClicked() {
  xLimit = BUTTON_WIDTH / 2;
  yLimit = BUTTON_HEIGHT / 2;

  // // log where the mouse is
  // console.log(mouseX + ", " + mouseY)
  // console.log("xLimit = " + xLimit)
  // console.log("yLimit = " + yLimit)
  // console.log("leftLimit = " + ((w/2) - xLimit) + " rightLimit = " + ((w/2) + xLimit))
  // console.log("upperLimit = " + ((h/2) - yLimit) + " rightLimit = " + ((h/2) + yLimit))

  if (menu == 0) {
    if (mouseX > (w/2 - xLimit) && mouseX < (w/2 + xLimit)) {
      if (mouseY > (h/2 - yLimit) && mouseY < (h/2 + yLimit)) {
        menu = 1
      }
    }
  }
  // else {
  //   menu = 0;
  // }
} // mouseClicked()

function keyPressed() {
  if (keyCode === BACKSPACE) {
    letterIndex--;
    if (letterIndex == -1) {
      letters[wordIndex][letterIndex + 1] = null;
      letterIndex++;
    } else {
      letters[wordIndex][letterIndex] = null;
    }
    console.log(letters);
  } // BACKSPACE
  else {
    letters[wordIndex][letterIndex] = String.fromCharCode(keyCode);
    incrementIndex();
    console.log(letters);
  }
  console.log("Letter: " + letterIndex + " Word: " + wordIndex);
} // keyPressed()

function incrementIndex() {
  letterIndex += 1;
  if (letterIndex != 0 && letterIndex % columns == 0) {
    letterIndex = 0;
    wordIndex += 1;
  }
} // incrementIndex()

/* ----------------- */
/* ----- MENUS ----- */
/* ----------------- */

function gameView() {
  background(40);
  rectMode(CORNER);

  /* ----- Draw the grid and letter boxes ----- */
  // for each box in the grid...
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      // ...set the xPos and yPos for the letters
      let xPos = i * gridSize + xMargin + (gridSize - squareSize) / 2;
      let yPos = j * gridSize + yMargin + (gridSize - squareSize) / 2;

      // ...set the gridxPos and gridyPos for this gridBoxes
      let gridxPos = i * gridSize + xMargin;
      let gridyPos = j * gridSize + yMargin;

      // ...create the two boxes in the grid

      fill(gridColor);
      square(gridxPos, gridyPos, gridSize, 4);

      if ((j + 1) % 2)
        fill(letterClose);
      else if ((j + 1) % 3)
        fill(letterWrong);
      else
        fill(letterRight);
      square(xPos, yPos, squareSize, 10);

      // if (letters[i][j] != null) {
      //   print("This letter is " + letters[i][j])
      // }
    }
  }
}

function menuView(){
  background(40);

  rectMode(CENTER)
  fill(btnStart)
  rect(w/2, h/2, BUTTON_WIDTH, BUTTON_HEIGHT, 10);

  textFont("Georgia")
  textAlign(CENTER, CENTER)
  textSize(25)
  fill(0);
  text("Start", w/2, h/2, BUTTON_WIDTH, BUTTON_HEIGHT);
}
