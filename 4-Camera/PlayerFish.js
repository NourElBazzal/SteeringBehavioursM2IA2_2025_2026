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

    // Simple fish shape: ellipse body + triangle tail
    fill(100, 150, 255);
    stroke(50, 100, 200);
    strokeWeight(2);
    ellipse(0, 0, this.size * 2, this.size);

    // Tail
    fill(80, 120, 240);
    triangle(-this.size, 0, -this.size * 1.5, -this.size * 0.5, -this.size * 1.5, this.size * 0.5);

    pop();
  }

  getRadius() {
    return this.size;
  }

  grow(amount) {
    this.size += amount;
    this.maxSpeed = max(1, this.maxSpeed - 0.1); // slow down as grows
  }
}