class Particle {
	constructor(x, y, stroke_weight) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
		this.color = 255 || get_random_color();
		this.stroke_weight = stroke_weight;
		this.maxspeed = 10;
		this.prevPos = this.pos.copy();
	}

	update() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.edges();
	}

	applyForce(force) {
		this.acc.add(force);
	}

	updatePrevious() {
		this.prevPos.x = this.pos.x;
		this.prevPos.y = this.pos.y;
	}

	edges() {
		if (this.pos.x > width) {
			this.pos.x = 0;
			this.updatePrevious();
		}
		if (this.pos.x < 0) {
			this.pos.x = width;
			this.updatePrevious();
		}
		if (this.pos.y > height) {
			this.pos.y = 0;
			this.updatePrevious();
		}
		if (this.pos.y < 0) {
			this.pos.y = height;
			this.updatePrevious();
		}
	}

	show() {
		stroke(this.color, 255);
		strokeWeight(this.stroke_weight);
		line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
		this.updatePrevious();
	}

	attracted(target) {
		let force = p5.Vector.sub(target, this.pos);
		let d = force.mag();
		d = constrain(d, 0.001, 50);
		let mag = GRAVITATIONAL_CONSTANT / (d * d);
		force.setMag(mag);
		if (d < 50) {
			force.mult(-2);
		}
		this.applyForce(force);
	}
}