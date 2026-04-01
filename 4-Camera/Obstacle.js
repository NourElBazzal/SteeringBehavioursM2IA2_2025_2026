class Obstacle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  show() {
    push();
    translate(this.x, this.y);
    fill(40, 35, 45);
    stroke(80, 70, 90);
    strokeWeight(2);
    beginShape();
    let sides = 8;
    let angleOffset = random(TWO_PI);
    for (let i = 0; i < sides; i++) {
      let angle = angleOffset + map(i, 0, sides, 0, TWO_PI);
      let r = i % 2 === 0 ? this.radius : this.radius * 0.6;
      let vx = cos(angle) * r;
      let vy = sin(angle) * r;
      vertex(vx, vy);
    }
    endShape(CLOSE);
    pop();
  }
}
