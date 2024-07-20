class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 3;
    this.rayLength = 100;
    this.rayStrength = Math.PI / 4;

    this.rays = [];
  }

  update() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle = lerp(
        this.rayStrength / 2,
        -this.rayStrength / 2,
        i / (this.rayCount - 1)
      );
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
      if (!Array.isArray(nextRay)) continue;
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";
      ctx.moveTo(nextRay[0].x, nextRay[0].y);
      ctx.lineTo(nextRay[1].x, nextRay[1].y);
      ctx.stroke();
    }
  }
}
