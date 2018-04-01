class Vehicle {
	constructor(x, y, dna, health) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, -2);
		this.acc = createVector(0, 0);
		this.r = 6;
		// this.color = get_random_color();
		this.maxspeed = 5;
		this.maxforce = 0.2;
		this.dna = dna || [random(-2, 2), random(-2, 2), random(0, 100), random(0, 100)];
		this.health = health || 1;
		this.boundary_distance = 25;
		this.health_reduce_per_turn = 0.01;
		this.food_health = 0.3;
		this.poison_health = -0.75;
		this.reproduce_num = 0.005;
		this.reproduce_health_factor = 0.8;
		this.mutation_rate = 0.05;
		this.mutate();
		this.age = 0;
	}

	update() {
		this.health -= this.health_reduce_per_turn;
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
		this.age++;
	}

	mutate() {
		if (random(1) < this.mutation_rate) {
			this.dna[0] += random(-0.1, 0.1)
			this.dna[1] += random(-0.1, 0.1)
			this.dna[2] += random(-10, 10)
			this.dna[3] += random(-10, 10)
		}
	}

	applyForce(force) {
		this.acc.add(force);
	}

	seek(target) {
		let steer = new p5.Vector(0, 0)
		if (target) {
			let force = p5.Vector.sub(target, this.pos).limit(this.maxspeed);
			steer = p5.Vector.sub(force, this.vel).limit(this.maxforce);
		}
		return steer;
	}

	reproduce() {
		let clone = null;
		if (random(1) < this.reproduce_num) {
			clone = new Vehicle(this.pos.x, this.pos.y, this.dna, this.health * this.reproduce_health_factor);
		}
		return clone;
	}

	dead() {
		return this.health < 0;
	}

	display() {
		let theta = this.vel.heading() + PI / 2;
		let cl = lerpColor(color(..._RED), color(..._GREEN), this.health);
		strokeWeight(1);
		push();
		translate(this.pos.x, this.pos.y);
		rotate(theta);

		noFill();
		stroke(..._GREEN);
		line(0, 0, 0, -this.dna[0] * 20);
		ellipse(0, 0, this.dna[2] * 2);
		stroke(..._RED);
		line(0, 0, 0, -this.dna[1] * 20);
		ellipse(0, 0, this.dna[3] * 2);

		fill(cl);
		stroke(cl);
		beginShape();
		vertex(0, -this.r * 2);
		vertex(-this.r, this.r * 2);
		vertex(this.r, this.r * 2);
		endShape(CLOSE);
		pop();
	}

	eat(targets, nutrition, perception) {
		let distances = targets.map(target => {
			return this.pos.dist(target);
		});
		let min_distance = _.min(distances);
		let index = _.indexOf(distances, min_distance);
		let target = targets[index];
		if (min_distance < this.maxspeed) {
			targets.splice(index, 1);
			this.health += nutrition;
		} else if (min_distance > perception) {
			target = null;
		}
		return this.seek(target);
	}

	behaviors(good, bad) {
		let steerG = this.eat(good, this.food_health, this.dna[2]);
		let steerB = this.eat(bad, this.poison_health, this.dna[3]);

		steerG.mult(this.dna[0]);
		steerB.mult(this.dna[1]);

		this.applyForce(steerG);
		this.applyForce(steerB);
	}

	boundaries() {
		var d = this.boundary_distance;
		let desired = null;

		if (this.pos.x < d) {
			desired = createVector(this.maxspeed, this.vel.y);
		} else if (this.pos.x > width - d) {
			desired = createVector(-this.maxspeed, this.vel.y);
		}

		if (this.pos.y < d) {
			desired = createVector(this.vel.x, this.maxspeed);
		} else if (this.pos.y > height - d) {
			desired = createVector(this.vel.x, -this.maxspeed);
		}

		if (desired !== null) {
			desired.normalize();
			desired.mult(this.maxspeed);
			let steer = p5.Vector.sub(desired, this.vel);
			steer.limit(this.maxforce);
			this.applyForce(steer);
		}
	}
}