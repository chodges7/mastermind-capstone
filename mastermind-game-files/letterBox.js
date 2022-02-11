class LetterBox {
  constructor(x, y, size, radius) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.radius = radius;

    square(this.x, this.y, this.size, this.radius);

    // this.color = color()
  }

  update() {
    if (this.x > width || this.x < 0) {
      this.dx *= -1;
    }

    if (this.y > height || this.y < 0) {
      this.dy *= -1;
    }
  }

  changeColor(r, g, b) {
    
  }
}
