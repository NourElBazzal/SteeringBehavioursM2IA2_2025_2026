// Snake.js
// Manages a chain of SnakeSegment vehicles.
// The head seeks/arrives at the mouse (or wanders when the mouse is idle).
// Each following segment arrives at the position of the one ahead of it.
//
// Behaviors used from Vehicle (unmodified):
//   - arrive()   → segments follow the chain
//   - wander()   → head wanders when mouse hasn't moved
//   - flee()     → whole snake flees a threat on right-click  (bonus)
//   - boundaries() → keeps the snake on screen

class Snake {
  /**
   * @param {number} x             - Starting x (head)
   * @param {number} y             - Starting y (head)
   * @param {number} numSegments   - Total number of segments (head + body)
   * @param {number} headRadius    - Radius of the head segment
   */
  constructor(x, y, numSegments = 20, headRadius = 20) {
    this.segments = [];

    for (let i = 0; i < numSegments; i++) {
      // Stagger the initial positions so segments don't stack at spawn
      let seg = new SnakeSegment(x - i * headRadius * 1.5, y, i, headRadius);
      this.segments.push(seg);
    }

    // ── Movement state ────────────────────────────────────────────
    // The snake head moves in a fixed direction controlled by keyboard.
    this.direction = createVector(1, 0);

    // Canvas boundary margin
    this._boundaryMargin = 60;
  }

  // ── Public API ────────────────────────────────────────────────────

  /**
   * Call every frame from draw().
   */
  update() {
    let head = this.segments[0];

    // ── Head movement (keyboard-directed) ─────────────────────────
    head.vel = this.direction.copy().mult(head.maxSpeed);
    head.update();
    head.edges();

    // ── Body steering ─────────────────────────────────────────────
    for (let i = 1; i < this.segments.length; i++) {
      let seg  = this.segments[i];
      let prev = this.segments[i - 1];

      // Each segment arrives at the position of the one in front.
      // The offset (50 px) creates a natural gap between segments.
      let force = seg.arrive(prev.pos, 50);

      let bf = seg.boundaries(
        0, 0, width, height, this._boundaryMargin
      );

      seg.applyForce(force);
      seg.applyForce(bf);
      seg.update();
    }
  }

  /**
   * Draw the snake: body ribbon first, then segment circles on top.
   */
  show() {
    let n = this.segments.length;

    // ── Ribbon / outline between segments ─────────────────────────
    this._drawRibbon();

    // ── Segments (back to front so head is on top) ─────────────────
    for (let i = n - 1; i >= 0; i--) {
      this.segments[i].show(n);
    }
  }

  /**
   * Set the movement direction of the snake head.
   * @param {number} x - direction x (-1,0,1)
   * @param {number} y - direction y (-1,0,1)
   */
  setDirection(x, y) {
    this.direction.set(x, y);
    this.direction.normalize();
  }

  // ── Private helpers ───────────────────────────────────────────────

  /**
   * Track mouse movement to decide wander vs. seek.
   */
  _updateWanderState(mousePos) {
    let moved = p5.Vector.dist(mousePos, this._mouseTarget) > 1.5;

    if (moved) {
      this._idleTimer  = 0;
      this._wandering  = false;
      this._mouseTarget = mousePos.copy();
    } else {
      this._idleTimer++;
      if (this._idleTimer >= this._idleThreshold) {
        this._wandering = true;
      }
    }
  }

  /**
   * Draw a smooth filled ribbon connecting all segment centres.
   * Uses beginShape / curveVertex for a smooth spline.
   */
  _drawRibbon() {
    if (this.segments.length < 2) return;

    push();
    noFill();

    // Draw the ribbon as a thick stroked curve whose weight tapers
    // We approximate taper by drawing multiple overlapping curves
    // from tail to head, getting thinner and brighter
    let steps = 3;
    for (let s = 0; s < steps; s++) {
      let t        = s / (steps - 1);                       // 0 → 1
      let sw       = lerp(this.segments[0].r * 1.6, 2, t); // thick → thin
      let col      = lerpColor(
        color(30, 80, 30, 180),
        color(80, 220, 80, 220),
        t
      );
      stroke(col);
      strokeWeight(sw);

      beginShape();
      // Duplicate first and last point so curveVertex starts/ends cleanly
      let first = this.segments[0].pos;
      let last  = this.segments[this.segments.length - 1].pos;
      curveVertex(first.x, first.y);
      for (let seg of this.segments) {
        curveVertex(seg.pos.x, seg.pos.y);
      }
      curveVertex(last.x, last.y);
      endShape();
    }

    pop();
  }
}
