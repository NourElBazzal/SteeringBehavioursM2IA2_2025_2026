// PowerUp.js
// A wandering power-up: either speed or shield.

class PowerUp extends Vehicle {
  constructor(x, y, type = 'speed') {
    super(x, y);
    this.type = type === 'shield' ? 'shield' : 'speed';
    this.value = this.type === 'speed' ? 5 : 3; // seconds duration
    this.r = 12;
    this.maxSpeed = 1.3;
    this.maxForce = 0.06;
  }

  update() {
    this.applyForce(this.wander());
    super.update();
    this.edges();
  }

  show() {
    let pulse = 1 + 0.2 * sin(frameCount * 0.06);
    let radius = this.r * pulse;

    push();
    translate(this.pos.x, this.pos.y);
    rotate(frameCount * 0.03);

    if (this.type === 'speed') {
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = color(80, 255, 255);
      fill(60, 255, 255, 220);
      stroke(20, 180, 255);
    } else {
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = color(255, 230, 80);
      fill(255, 230, 80, 220);
      stroke(255, 200, 40);
    }

    strokeWeight(2);
    beginShape();
    vertex(0, -radius);
    vertex(radius, 0);
    vertex(0, radius);
    vertex(-radius, 0);
    endShape(CLOSE);

    drawingContext.shadowBlur = 0;
    drawingContext.shadowColor = 'transparent';
    pop();
  }

  applyToSnake(snake) {
    if (this.type === 'speed') {
      let original = snake.segments.map(seg => seg.maxSpeed);
      snake.segments.forEach(seg => seg.maxSpeed = seg.maxSpeed * 2);
      setTimeout(() => {
        snake.segments.forEach((seg, i) => seg.maxSpeed = original[i]);
      }, this.value * 1000);
    } else if (this.type === 'shield') {
      snake.shielded = true;
      setTimeout(() => { snake.shielded = false; }, this.value * 1000);
    }
  }
}
