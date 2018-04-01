let attractors = [];
let particles = [];
let NUM_ATTRACTORS = 10;
let NUM_PARTICLES = 500;
let ATTRACTOR_WEIGHT = 10;
let PARTICLE_WEIGHT = 4;
let BACKGROUND_COLOR = 51;
let _GREEN = [0, 255, 0];
let _RED = [255, 0, 0];
let CANVAS_WIDTH = 800;
let CANVAS_HEIGHT = 600;
let GRAVITATIONAL_CONSTANT = 5;

function setup() {
	createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
	// attractors = [...Array(NUM_ATTRACTORS)].map((_, i) => {
	// 	return createVector(random(width), random(height));
	// });
	particles = [...Array(NUM_PARTICLES)].map((_, i) => {
		return new Particle(random(width), random(height), PARTICLE_WEIGHT);
	});
}

function draw() {
	background(BACKGROUND_COLOR);
	stroke(..._GREEN);
	strokeWeight(ATTRACTOR_WEIGHT);
	for (let attractor of attractors) {
		point(attractor.x, attractor.y);
	}
	for (let particle of particles) {
		attractors.forEach((attractor, i) => particle.attracted(attractor));
		particle.update();
		particle.show();
	}
}

function mousePressed() {
	attractors.push(createVector(mouseX, mouseY));
}