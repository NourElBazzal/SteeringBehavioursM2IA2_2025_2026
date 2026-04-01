// Enemy.js
// Chases the snake head with pursue steering.

class Enemy extends Vehicle {
  constructor(x, y, snakeHead) {
    super(x, y);
    this.snakeHead = snakeHead;
    this.maxSpeed = 3;
    this.maxForce = 0.15;
    this.r = 18;
  }

  update() {
    let force = this.pursue(this.snakeHead);
    this.applyForce(force);
    super.update();
    this.edges();
  }

  show() {
    push();

    // neon glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(255, 20, 20);

    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());

    noStroke();
    fill(255, 50, 50);

    // spiky triangle shape
    beginShape();
    vertex(this.r, 0);
    vertex(-this.r * 0.6, -this.r * 0.6);
    vertex(-this.r * 0.4, 0);
    vertex(-this.r * 0.6, this.r * 0.6);
    endShape(CLOSE);

    // clear glow state
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'transparent';

    pop();
  }
}
