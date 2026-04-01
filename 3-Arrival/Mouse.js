// Mouse.js
// Represents a cursor-controlled target. Extends Vehicle but has no steering logic.

class Mouse extends Vehicle {
  constructor() {
    super(mouseX || 0, mouseY || 0);
    this.r = 8;
  }

  update() {
    this.pos.set(mouseX, mouseY);
  }

  show() {
    push();
    noFill();
    stroke(255, 50, 50);
    strokeWeight(2);
    circle(this.pos.x, this.pos.y, this.r * 2);

    stroke(255);
    strokeWeight(1.5);
    line(this.pos.x - this.r * 1.5, this.pos.y, this.pos.x + this.r * 1.5, this.pos.y);
    line(this.pos.x, this.pos.y - this.r * 1.5, this.pos.x, this.pos.y + this.r * 1.5);
    pop();
  }
}
