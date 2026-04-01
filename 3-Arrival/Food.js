// Food.js
// A wandering food item that pulses and emits a glow.

class Food extends Vehicle {
  constructor(x, y, value = 10) {
    super(x, y);
    this.value = value;
    this.r = 10;
    this.maxSpeed = 1.2;
    this.maxForce = 0.05;
  }

  update() {
    this.applyForce(this.wander());
    super.update();
    this.edges();
  }

  show() {
    let pulse = 1 + 0.2 * sin(frameCount * 0.05);
    let radius = this.r * pulse;

    push();
    // glow effect
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(120, 255, 140);

    noStroke();
    fill(120, 255, 140, 220);
    circle(this.pos.x, this.pos.y, radius * 2);

    // reset shadow to avoid affecting other canvas elements
    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'transparent';
    pop();
  }
}
