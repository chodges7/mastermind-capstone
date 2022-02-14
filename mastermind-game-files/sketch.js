let w = 450;          // width of the canvas
let h = 600;          // height of the canvas
let columns = 4;      // columns in the game (how long the words will be)
let rows = 6;         // rows in the game (total amt of guesses)
let gridSize = 75;    // size of the grid boxes
let squareSize = 60;  // size of the letter boxes 
let yOffset = 45;     // offset for pushing the grid up/down
let xOffset = 0;      // offset for pushing the grid left/right
let yMargin = (h - rows * gridSize) / 2 + yOffset; // calculating the xmargin
let xMargin = (w - columns * gridSize) / 2 + xOffset; // calculating the ymargin

// variables for tracking the letters
let xCur = 0;
let yCur = 0;
const letters = new Array();
for (let i = 0; i < columns; i++) {
  letters[i] = new Array;
  for (let j = 0; j < rows; j++) {
    letters[i][j] = null
  }
}

function setup() {
  // Create the canvas we'll work on as well as the background color
  createCanvas(w, h);
  background(40);
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
      square(gridxPos, gridyPos, gridSize, 4);
      square(xPos, yPos, squareSize, 10);

      // ...and finally, 
      if (letters[i][j] != null) {
        print("This letter is " + letters[i][j])
      }
    }
  }

} // draw()
