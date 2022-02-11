function setup() {
  let width = 450;
  let height = 600;
  let columns = 4;
  let rows = 6;
  createCanvas(width, height);
  background(40);

  const letters = new Array();
  for (let i = 0; i < columns; i++) {
    letters[i] = new Array();
  }

  const gridBoxes = new Array();
  for (let i = 0; i < columns; i++) {
    gridBoxes[i] = new Array();
  }

  let gridSize = 75;
  let squareSize = 60;
  let yOffset = 45;
  let xOffset = 0;
  let yMargin = (height - rows * gridSize) / 2 + yOffset;
  let xMargin = (width - columns * gridSize) / 2 + xOffset;

  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      let xPos = i * gridSize + xMargin + (gridSize - squareSize) / 2;
      let yPos = j * gridSize + yMargin + (gridSize - squareSize) / 2;

      let gridxPos = i * gridSize + xMargin;
      let gridyPos = j * gridSize + yMargin;

      gridBoxes[i][j] = new LetterBox(gridxPos, gridyPos, gridSize, 4);
      letters[i][j] = new LetterBox(xPos, yPos, squareSize, 10);
    }
  }
}

function draw() {}
