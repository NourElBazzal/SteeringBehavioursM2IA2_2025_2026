// OceanBackground.js
// Draws a gradient background for the ocean world.
// World dimensions: 2000px wide, 3000px tall.

class OceanBackground {
  constructor() {
    this.worldWidth = 2000;
    this.worldHeight = 3000;
    // Zone colors
    this.surfaceColor = color(100, 200, 255); // brighter blue
    this.twilightColor = color(50, 150, 200); // darker teal
    this.midnightColor = color(10, 50, 100); // dark blue-black
    this.abyssColor = color(5, 10, 20); // near-black
    // Zone heights
    this.surfaceHeight = 700;
    this.twilightHeight = 1500;
    this.midnightHeight = 2300;
    this.abyssHeight = 3000;
    // Generate particles once
    this.particles = [];
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: random(this.worldWidth),
        y: random(this.worldHeight),
        size: random(2, 8),
        alpha: random(10, 50)
      });
    }
  }

  show() {
    push();
    // Draw zone-based gradient
    this.drawGradient(0, this.surfaceHeight, this.surfaceColor, this.twilightColor);
    this.drawGradient(this.surfaceHeight, this.twilightHeight, this.twilightColor, this.midnightColor);
    this.drawGradient(this.twilightHeight, this.midnightHeight, this.midnightColor, this.abyssColor);
    this.drawGradient(this.midnightHeight, this.abyssHeight, this.abyssColor, this.abyssColor);

    // Add subtle particles
    this.drawParticles();
    pop();
  }

  drawGradient(yStart, yEnd, colorStart, colorEnd) {
    for (let y = yStart; y < yEnd; y++) {
      let t = (y - yStart) / (yEnd - yStart);
      let c = lerpColor(colorStart, colorEnd, t);
      stroke(c);
      line(0, y, this.worldWidth, y);
    }
  }

  drawParticles() {
    // Draw stored particles for atmosphere
    for (let p of this.particles) {
      fill(255, p.alpha);
      noStroke();
      circle(p.x, p.y, p.size);
    }
  }
}
