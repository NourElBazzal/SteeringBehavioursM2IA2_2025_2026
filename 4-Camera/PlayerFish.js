class PlayerFish extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.size = 20; // radius
    this.maxSpeed = 3;
    this.maxForce = 0.1;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    if (this.vel.mag() > 0.1) {
      rotate(this.vel.heading());
    }

    // Body silhouette using smooth curve
    fill(100, 150, 255);
    stroke(50, 100, 200);
    strokeWeight(2);

    // Add glow effect for deep zones
    if (this.pos.y > 1500) {
      drawingContext.shadowColor = 'rgba(100, 150, 255, 0.6)';
      drawingContext.shadowBlur = 15;
    }

    beginShape();
    curveVertex(-this.size * 1.1, 0);
    curveVertex(-this.size * 1.1, 0);
    curveVertex(-this.size * 0.3, -this.size * 0.8);
    curveVertex(this.size * 0.7, -this.size * 0.4);
    curveVertex(this.size * 1.1, 0);
    curveVertex(this.size * 0.7, this.size * 0.4);
    curveVertex(-this.size * 0.3, this.size * 0.8);
    curveVertex(-this.size * 1.1, 0);
    curveVertex(-this.size * 1.1, 0);
    endShape();

    // Forked tail
    fill(80, 120, 240);
    noStroke();
    triangle(-this.size * 1.1, 0, -this.size * 1.8, -this.size * 0.4, -this.size * 1.8, 0);
    triangle(-this.size * 1.1, 0, -this.size * 1.8, this.size * 0.4, -this.size * 1.8, 0);

    // Belly highlight
    noStroke();
    fill(170, 210, 255, 140);
    ellipse(this.size * 0.1, this.size * 0.05, this.size * 1.2, this.size * 0.55);

    // Eye
    fill(255);
    ellipse(this.size * 0.6, -this.size * 0.15, this.size * 0.25, this.size * 0.25);
    fill(0);
    ellipse(this.size * 0.65, -this.size * 0.15, this.size * 0.1, this.size * 0.1);

    // Reset glow
    if (this.pos.y > 1500) {
      drawingContext.shadowBlur = 0;
    }

    pop();

    // Debug circle showing edible range
    if (Vehicle.debug) {
      push();
      translate(this.pos.x, this.pos.y);
      stroke(0, 255, 100);
      strokeWeight(1);
      noFill();
      circle(0, 0, this.size * 1.2 * 2);
      pop();
    }
  }

  getRadius() {
    return this.size;
  }

  grow(amount) {
    this.size += amount;
    this.maxSpeed = max(1.5, this.maxSpeed - 0.1); // slow down as grows, floor at 1.5
  }
}