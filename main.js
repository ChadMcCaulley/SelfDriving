const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 240;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width, 3);
const numberOfCarsPerGeneration = 100;
const cars = generateCars(numberOfCarsPerGeneration);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) NeuralNetwork.mutate(cars[i].brain, 0.25);
  }
}

console.log("getLaneCenter(0): ", road.getLaneCenter(0));
console.log("getLaneCenter(1): ", road.getLaneCenter(1));
console.log("getLaneCenter(2): ", road.getLaneCenter(2));

const traffic = [
  new Car({ x: road.getLaneCenter(0), y: -800, maxSpeed: 2 }),
  new Car({ x: road.getLaneCenter(1), y: -300, maxSpeed: 2 }),
  new Car({ x: road.getLaneCenter(2), y: -350, maxSpeed: 2 }),
  new Car({ x: road.getLaneCenter(1), y: -150, maxSpeed: 2 }),
  new Car({ x: road.getLaneCenter(2), y: -450, maxSpeed: 2 }),
  new Car({ x: road.getLaneCenter(2), y: -550, maxSpeed: 2 }),
  new Car({ x: road.getLaneCenter(1), y: -850, maxSpeed: 2 }),
  new Car({ x: road.getLaneCenter(1), y: -650, maxSpeed: 2 }),
  new Car({ x: road.getLaneCenter(2), y: -750, maxSpeed: 2 }),
];

animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(numberOfCars) {
  const cars = [];
  for (let i = 1; i <= numberOfCars; i++) {
    cars.push(new Car({ x: road.getLaneCenter(1), y: 100, controlType: "AI" }));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  const minYValue = Math.min(...cars.map((c) => c.y));
  bestCar = cars.find((car) => car.y == minYValue);

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.5);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }

  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
