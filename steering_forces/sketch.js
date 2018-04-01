let vehicles = [];
let foods = [];
let poisons = [];
let NUM_FOODS = 2000;
let NUM_POISONS = 400;
let NUM_VEHICLES = 10;
let _GREEN = [0, 255, 0];
let _RED = [255, 0, 0];
let target;
let ticks = 0;
let fr;

function createItems(num, type) {
	return [...Array(num)].map((_, i) => {
		return type(random(width), random(height));
	});
}

function createVehicle(x, y) {
	return new Vehicle(x, y)
}

function setup() {
	createCanvas(800, 600);
	vehicles = createItems(NUM_VEHICLES, createVehicle);
	foods = createItems(NUM_FOODS, createVector);
	poisons = createItems(NUM_POISONS, createVector);
	fr = createP('');
}

function draw_ellipses(list, color) {
	for (let item of list) {
		fill(...color);
		noStroke();
		ellipse(item.x, item.y, 8, 8);
	}
}

function draw() {
	ticks++;
	background(51);
	if (random(1) < 0.2) foods.push(createVector(random(width), random(height)));
	if (random(1) < 0.1) poisons.push(createVector(random(width), random(height)));
	draw_ellipses(foods, _GREEN);
	draw_ellipses(poisons, _RED);
	let veh_len = vehicles.length;
	vehicles = vehicles.filter((vehicle, i) => {
		vehicle.boundaries();
		vehicle.behaviors(foods, poisons);
		vehicle.update();
		vehicle.display();
		return !vehicle.dead();
	});
	foods = _.concat(foods, createItems(veh_len - vehicles.length, createVector));
	new_vehicles = _.chain(vehicles).map(vehicle => vehicle.reproduce()).compact().value();
	vehicles = _.concat(vehicles, new_vehicles);
	if (ticks % 60 == 0) {
		fr.html(`Max Age: ${_.chain(vehicles).map('age').max().value()}`);
	}
}