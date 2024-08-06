const canvas = document.getElementById("mainCanvas");
canvas.height = window.innerHeight;
canvas.width = 240;

const ctx = canvas.getContext("2d");

const road = new Road(canvas.width / 2, canvas.width, 3);
const car = new Car({
  x: road.getLaneCenter(1),
  y: 100,
  width: 30,
  height: 50,
  isUserControlled: true,
});
const traffic = [
  new Car({
    x: road.getLaneCenter(1),
    y: -100,
    width: 30,
    height: 50,
    maxSpeed: 2,
  }),
];

animate();

function animate() {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders);
  }
  car.update(road.borders);
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.5);

  road.draw(ctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx);
  }
  car.draw(ctx);
  requestAnimationFrame(animate);
}
