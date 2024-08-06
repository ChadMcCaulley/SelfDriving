class Car {
  constructor({
    x,
    y,
    width = 30,
    height = 50,
    isUserControlled = false,
    maxSpeed = 3,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.maxReverseSpeed = 1.5;
    this.friction = 0.01;
    this.angle = 0;
    this.amtAngleAdjustPerFrame = 0.015;

    this.damaged = false;

    if (isUserControlled) {
      this.sensor = new Sensor(this);
      this.controls = new Controls("USER_CONTROLLED");
    } else {
      this.controls = new Controls("TRAFFIC");
    }
  }

  /**
   * Update the car and sensors
   * @param {Array} roadBorders - Road Bounds
   */
  update(roadBorders) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders);
    }
    if (this.sensor) this.sensor.update(roadBorders);
  }

  /**
   * Draws a rectangle representing the car on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of canvas.
   * @returns {void}
   */
  draw(ctx) {
    /** Works by we lose the borders of the car as we rotate the drawing
     ctx.save();
     ctx.translate(this.x, this.y);
     ctx.rotate(-this.angle);
     ctx.beginPath();
     ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
     ctx.fill();
     ctx.restore();
    */

    if (this.damaged) ctx.fillStyle = "gray";
    else ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    if (this.sensor) this.sensor.draw(ctx);
  }

  #assessDamage(roadBorders) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) return true;
    }
    return false;
  }

  #createPolygon() {
    const points = [];
    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    points.push({
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * radius,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * radius,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * radius,
    });
    return points;
  }

  /**
   * Updates the car's position and angle based on user input and physics.
   *
   * @private
   * @memberof Car
   * @returns {void}
   */
  #move() {
    if (this.controls.forward) this.speed += this.acceleration;
    if (this.controls.reverse) this.speed -= this.acceleration;

    const maxReverseSpeed = this.maxReverseSpeed * -1;

    if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
    if (this.speed < maxReverseSpeed) this.speed = maxReverseSpeed;

    if (this.speed > 0) this.speed -= this.friction;
    if (this.speed < 0) this.speed += this.friction;

    if (Math.abs(this.speed) < this.friction) this.speed = 0;

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) this.angle += this.amtAngleAdjustPerFrame * flip;
      if (this.controls.right) this.angle -= this.amtAngleAdjustPerFrame * flip;
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
}
