var inc = 0.1;
var scl = 10;
var cols, rows;
var fr;
var zoff;
var particles = [];
var flowfield = [];

function setup() {
	createCanvas(600, 400);
	colorMode(HSB, 255);
	cols = floor(width / scl);
	rows = floor(height / scl);
	fr = createP('');
	zoff = 0;

	flowfield = new Array(cols * rows);

	for (var i = 0; i < 1500; ++i) {
		particles[i] = new Particle();
	}
	background(255);
}

function draw() {
	var yoff = 0;
	for (let y = 0; y < rows; y++) {
		var xoff = 0;
		for (let x = 0; x < cols; x++) {
			var index = (x + y * cols);
			var angle = noise(xoff, yoff, zoff) * TWO_PI * 2;
			var v = p5.Vector.fromAngle(angle);
			v.setMag(0.5);
			flowfield[index] = v;
			xoff += inc;
			// stroke(0, 50);
			// strokeWeight(1);
			// push();
			// translate(x * scl, y * scl);
			// rotate(v.heading());
			// line(0, 0, scl, 0);
			// pop();
		}
		yoff += inc;
	}
	zoff += 0.003;

	for (let i = 0; i < particles.length; ++i) {
		particles[i].update();
		particles[i].show();
		particles[i].follow(flowfield);
	}

	fr.html(Math.floor(frameRate()));
}