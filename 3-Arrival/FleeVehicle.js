// FleeVehicle.js
// Extends the base Vehicle class and provides a correct flee behavior
// using Reynolds' formula.

class FleeVehicle extends Vehicle {
  /**
   * @param {p5.Vector} target - Position to flee from
   * @returns {p5.Vector} steering force
   */
  flee(target) {
    // 1. Compute desired velocity away from target
    let desired = p5.Vector.sub(this.pos, target);
    desired.normalize();
    desired.mult(this.maxSpeed);

    // 2. Steering force = desired - current velocity
    let force = p5.Vector.sub(desired, this.vel);
    force.limit(this.maxForce);

    return force;
  }
}
