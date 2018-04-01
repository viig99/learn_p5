function Particle() {
	this.pos = createVector(random(width), random(height));
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.maxspeed = 4;
	this.prevPos = this.pos.copy();
	this.h = 0;

	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.edges();
	}

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.updatePrevious = function() {
		this.prevPos.x = this.pos.x;
		this.prevPos.y = this.pos.y;
	}

	this.show = function() {
		stroke(this.h, 255, 255, 5);
		this.h++;
		if (this.h > 255) this.h = 0;
		strokeWeight(1);
		line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
		this.updatePrevious();
	}

	this.edges = function() {
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

	this.follow = function(vectors) {
		var x = floor(this.pos.x / scl);
		var y = floor(this.pos.y / scl);
		var index = x + y * cols;
		var force = vectors[index];
		this.applyForce(force);
	}
}