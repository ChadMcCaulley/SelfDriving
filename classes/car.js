class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.controls = new Controls();
  }

  /**
   * Draws a rectangle representing the car on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of canvas.
   * @returns {void}
   */
  draw(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
  }
}
