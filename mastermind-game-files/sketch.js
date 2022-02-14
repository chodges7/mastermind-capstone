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

// Letters array
const letters = new Array();
for (let i = 0; i < columns; i++) {
  letters[i] = new Array;
  for (let j = 0; j < rows; j++) {
    letters[i][j] = '';
  }
}

function setup() {
  // Create the canvas we'll work on as well as the background color
  createCanvas(w, h);
  background(40);

  /* ----- Initialize variables -----*/
  // Generic variables
  w     = 450;
  h     = 600;
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
  letterRight = color(19, 186, 65);
  letterClose = color(255, 159, 45);
  letterWrong = color(247, 65, 65);

  // Letters array
  // for (j = 0; j < rows; j++) {
  //   letters[j][0] = '';
  // }
} // setup()

function draw() {
  // TODO: check the keyboard for input. 
  //   When a letter is input update the letters array at that position.

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

      if((j+1) % 2)
        fill(letterClose);
      else if ((j+1) % 3)
        fill(letterWrong);
      else
        fill(letterRight);
      square(xPos, yPos, squareSize, 10);

      // ...and finally, 
      if (letters[i][j] != null) {
        print("This letter is " + letters[i][j])
      }
    }
  }

} // draw()
