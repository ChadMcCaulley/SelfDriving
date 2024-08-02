class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 200;
    this.rayStrength = Math.PI / 2;

    this.rays = [];
    this.readings = [];

    this.count = 0;
  }

  /**
   * Update the car and sensors
   * @param {Array} roadBorders - Road Bounds
   */
  update(roadBorders) {
    this.#castRays();
    this.readings = [];

    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBorders));
    }
  }

  /**
   * Update the car and sensors
   * @param {Array} roadBorders - Road Bounds
   */
  #getReading(ray, roadBorders) {
    let touches = [];
    for (let i = 0; i < roadBorders.length; i++) {
      const touch = getIntersection(
        ray[0],
        ray[1],
        roadBorders[i][0],
        roadBorders[i][1]
      );
      if (touch) touches.push(touch);
    }
    if (touches.length === 0) return null;

    let touchWithMinOffset = touches[0];
    for (const touch of touches) {
      if (touch.offset < touchWithMinOffset.offset) touchWithMinOffset = touch;
    }
    return touchWithMinOffset;
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.rayStrength / 2,
          -this.rayStrength / 2,
          this.rayCount <= 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle;
      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      const nextRay = this.rays[i];
      const nextRayStart = nextRay[0];
      const nextRayEnd = nextRay[1];

      let end = nextRayEnd;
      if (this.readings[i]) end = this.readings[i];

      if (!Array.isArray(nextRay)) continue;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(nextRayStart.x, nextRayStart.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(nextRayEnd.x, nextRayEnd.y);
      ctx.stroke();
    }
  }
}
