// MovingTarget.js
// Extends Vehicle as a wandering autonomous target.

class MovingTarget extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.r = 15;
    this.maxSpeed = 3.5;
    this.maxForce = 0.15;
  }

  update() {
    this.applyForce(this.wander());
    super.update();
    this.edges();
  }

  show() {
    push();
    noStroke();
    fill(255, 100, 180);
    circle(this.pos.x, this.pos.y, this.r * 2);
    pop();
  }
}
