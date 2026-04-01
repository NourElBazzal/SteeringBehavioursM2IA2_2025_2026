// Background.js
// Manages visual background layers: grid, particles, pulse rings.

class Background {
  constructor() {
    // Particles: 60 particles
    this.particles = [];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        pos: createVector(random(width), random(height)),
        vel: p5.Vector.random2D().mult(0.5), // slow velocity
        size: random(2, 5),
        col: random(['cyan', 'magenta', 'green'])
      });
    }

    // Pulse rings: array of active rings
    this.rings = [];
  }

  show() {
    // Grid layer
    let offsetX = (frameCount * 0.3) % 40;
    let offsetY = (frameCount * 0.2) % 40;
    push();
    stroke(0, 255, 180, 15);
    strokeWeight(0.5);
    for (let x = offsetX; x < width; x += 40) {
      line(x, 0, x, height);
    }
    for (let y = offsetY; y < height; y += 40) {
      line(0, y, width, y);
    }
    pop();

    // Particles layer
    for (let p of this.particles) {
      p.pos.add(p.vel);
      // Wrap edges
      if (p.pos.x > width) p.pos.x = 0;
      if (p.pos.x < 0) p.pos.x = width;
      if (p.pos.y > height) p.pos.y = 0;
      if (p.pos.y < 0) p.pos.y = height;

      push();
      drawingContext.shadowBlur = 10;
      if (p.col === 'cyan') {
        drawingContext.shadowColor = color(0, 255, 255);
        fill(0, 255, 255);
      } else if (p.col === 'magenta') {
        drawingContext.shadowColor = color(255, 0, 255);
        fill(255, 0, 255);
      } else {
        drawingContext.shadowColor = color(0, 255, 120);
        fill(0, 255, 120);
      }
      noStroke();
      circle(p.pos.x, p.pos.y, p.size);
      drawingContext.shadowBlur = 0;
      pop();
    }

    // Pulse rings layer
    for (let i = this.rings.length - 1; i >= 0; i--) {
      let r = this.rings[i];
      r.age++;
      if (r.age > 40) {
        this.rings.splice(i, 1);
        continue;
      }
      let radius = r.age * 2; // growing radius
      let alpha = map(r.age, 0, 40, 255, 0);
      push();
      noFill();
      if (r.col === 'cyan') {
        stroke(0, 255, 255, alpha);
      } else if (r.col === 'magenta') {
        stroke(255, 0, 255, alpha);
      } else {
        stroke(0, 255, 120, alpha);
      }
      strokeWeight(2);
      circle(r.x, r.y, radius * 2);
      pop();
    }
  }

  pulse(x, y, col) {
    this.rings.push({ x, y, col, age: 0 });
  }
}