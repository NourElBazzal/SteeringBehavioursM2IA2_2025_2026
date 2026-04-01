class AIFish extends Vehicle {
  constructor(x, y, type, size) {
    super(x, y);
    this.type = type; // 'prey', 'neutral', 'predator'
    this.size = size;
    this.maxSpeed = random(1, 3);
    this.maxForce = 0.05;
    this.fleeDistance = 100;
    this.pursueDistance = 150;
    this.neighborDist = 50;
  }

  computeBehaviorForce(player, preyArray = null) {
    let force = createVector(0, 0);

    if (this.type === 'prey') {
      // Wander normally
      force = this.wander();
      // Add flocking if preyArray provided
      if (preyArray) {
        let flockForce = this.flock(preyArray);
        force.add(flockForce);
      }
      // Flee if player is bigger and close (should dominate)
      if (player && player.getRadius() > this.size && p5.Vector.dist(this.pos, player.pos) < this.fleeDistance) {
        let fleeForce = this.computeFleeForce(player.pos);
        force.add(fleeForce);
      }
    } else if (this.type === 'neutral') {
      // Just wander
      force = this.wander();
    } else if (this.type === 'predator') {
      // Wander normally, but pursue if player is smaller and close
      force = this.wander();
      if (player && player.getRadius() < this.size && p5.Vector.dist(this.pos, player.pos) < this.pursueDistance) {
        let pursueForce = this.pursue(player);
        force.add(pursueForce);
      }
    }

    return force;
  }

  computeFleeForce(targetPos) {
    let desired = p5.Vector.sub(this.pos, targetPos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  separate(boids) {
    let force = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      if (other !== this) {
        let d = p5.Vector.dist(this.pos, other.pos);
        if (d > 0 && d < this.neighborDist) {
          let diff = p5.Vector.sub(this.pos, other.pos);
          diff.normalize();
          diff.div(d); // weight by distance
          force.add(diff);
          count++;
        }
      }
    }
    if (count > 0) {
      force.div(count);
      force.normalize();
      force.mult(this.maxSpeed);
      force.sub(this.vel);
      force.limit(this.maxForce);
    }
    return force;
  }

  align(boids) {
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      if (other !== this) {
        let d = p5.Vector.dist(this.pos, other.pos);
        if (d > 0 && d < this.neighborDist) {
          sum.add(other.vel);
          count++;
        }
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      let force = p5.Vector.sub(sum, this.vel);
      force.limit(this.maxForce);
      return force;
    }
    return createVector(0, 0);
  }

  cohere(boids) {
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      if (other !== this) {
        let d = p5.Vector.dist(this.pos, other.pos);
        if (d > 0 && d < this.neighborDist) {
          sum.add(other.pos);
          count++;
        }
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seek(sum, false); // seek to center without arrival
    }
    return createVector(0, 0);
  }

  flock(boids) {
    let sep = this.separate(boids);
    let ali = this.align(boids);
    let coh = this.cohere(boids);
    sep.mult(1.4);
    ali.mult(0.8);
    coh.mult(0.6);
    let total = createVector(0, 0);
    total.add(sep);
    total.add(ali);
    total.add(coh);
    return total;
  }

  update() {
    super.update();
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.vel.mag() > 0.1) {
      rotate(this.vel.heading());
    }

    // Color based on type
    if (this.type === 'prey') {
      fill(255, 200, 100);
      stroke(200, 150, 50);
    } else if (this.type === 'neutral') {
      fill(150, 255, 150);
      stroke(100, 200, 100);
    } else if (this.type === 'predator') {
      fill(255, 100, 100);
      stroke(200, 50, 50);
    }

    strokeWeight(2);
    ellipse(0, 0, this.size * 2, this.size);

    // Simple fin
    triangle(this.size * 0.5, 0, this.size, -this.size * 0.3, this.size, this.size * 0.3);

    pop();
  }

  getRadius() {
    return this.size;
  }
}