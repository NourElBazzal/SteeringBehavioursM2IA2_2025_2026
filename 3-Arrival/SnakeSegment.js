// SnakeSegment.js
// A single segment of the snake. Extends Vehicle without modifying it.
// Each segment steers toward a target position (the segment in front of it,
// or the mouse for the head).

class SnakeSegment extends FleeVehicle {
  /**
   * @param {number} x        - Initial x position
   * @param {number} y        - Initial y position
   * @param {number} index    - Position in the chain (0 = head)
   * @param {number} radius   - Visual radius of this segment
   */
  constructor(x, y, index, radius = 16) {
    super(x, y);

    this.index   = index;
    this.r       = radius;

    // Head is faster and more agile than body segments
    if (index === 0) {
      this.maxSpeed = 5;
      this.maxForce = 0.25;
    } else {
      // Body segments slow down slightly toward the tail for a
      // natural wave/undulation effect
      this.maxSpeed = 4.5 - index * 0.05;
      this.maxForce = 0.18;
    }

    // Arrival braking zone — tighter for body segments so they
    // stay close behind the previous one
    this.rayonZoneDeFreinage = index === 0 ? 120 : 60;
  }

  /**
   * Draw this segment.
   * The head gets a distinct look (eyes, different color).
   * Body segments are drawn as a filled circle whose color shifts
   * from the head color toward the tail color.
   *
   * @param {number} totalSegments - Used to compute the color gradient
   */
  show(totalSegments = 1) {
    push();
    translate(this.pos.x, this.pos.y);

    // Color gradient: vivid green at head → dark olive at tail
    let t = totalSegments > 1 ? this.index / (totalSegments - 1) : 0;
    let col = lerpColor(color(80, 220, 80), color(30, 80, 30), t);

    // Scale radius: head is full size, tail tapers off
    let displayR = lerp(this.r, this.r * 0.45, t);

    noStroke();
    fill(col);
    circle(0, 0, displayR * 2);

    // ── Head details ──────────────────────────────────────────────
    if (this.index === 0) {
      // Rotate so features face the direction of movement
      if (this.vel.mag() > 0.1) rotate(this.vel.heading());

      // Eyes
      fill(255);
      circle(-displayR * 0.15, -displayR * 0.45, displayR * 0.35);
      circle(-displayR * 0.15,  displayR * 0.45, displayR * 0.35);

      fill(0);
      circle(-displayR * 0.05, -displayR * 0.45, displayR * 0.15);
      circle(-displayR * 0.05,  displayR * 0.45, displayR * 0.15);

      // Tongue (two-pronged)
      stroke(220, 50, 50);
      strokeWeight(1.5);
      let tx = displayR;
      line(0, 0, tx, 0);
      line(tx, 0, tx + displayR * 0.35, -displayR * 0.3);
      line(tx, 0, tx + displayR * 0.35,  displayR * 0.3);
    }

    pop();

    // Debug: show the braking circle (only when Vehicle.debug is on)
    if (Vehicle.debug) {
      push();
      noFill();
      stroke(255, 200, 0, 80);
      strokeWeight(1);
      circle(this.pos.x, this.pos.y, this.rayonZoneDeFreinage * 2);
      pop();
    }
  }
}
