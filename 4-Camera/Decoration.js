class Decoration {
  constructor() {
    this.items = [];

    // seaweed/algae
    for (let i = 0; i < 40; i++) {
      this.items.push({
        type: 'algae',
        x: random(2000),
        y: random(500, 3000),
        height: random(30, 80),
        sway: random(TWO_PI),
        swaySpeed: random(0.01, 0.03),
        col: color(30, 160, 60)
      });
    }

    // coral
    for (let i = 0; i < 30; i++) {
      this.items.push({
        type: 'coral',
        x: random(2000),
        y: random(1000, 3000),
        size: random(15, 40),
        col: random() > 0.5 ? color(255, 100, 80) : color(200, 80, 150)
      });
    }

    // rock
    for (let i = 0; i < 20; i++) {
      this.items.push({
        type: 'rock',
        x: random(2000),
        y: random(200, 3000),
        size: random(20, 60),
        col: color(80, 80, 90)
      });
    }
  }

  show() {
    push();
    for (let d of this.items) {
      if (d.type === 'algae') {
        push();
        translate(d.x, d.y);
        let swayOffset = sin(frameCount * d.swaySpeed + d.sway) * d.height * 0.2;
        stroke(d.col);
        strokeWeight(3);
        line(0, 0, swayOffset, -d.height);

        for (let k = 0; k < 3; k++) {
          let t = (k + 1) / 4;
          let ypos = lerp(0, -d.height, t);
          let xpos = lerp(0, swayOffset, t);
          line(xpos, ypos, xpos + (k % 2 === 0 ? -5 : 5), ypos - 8);
        }
        pop();
      } else if (d.type === 'coral') {
        push();
        translate(d.x, d.y);
        stroke(d.col);
        strokeWeight(2);
        for (let i = 0; i < int(random(3, 6)); i++) {
          let angle = map(i, 0, 4, -PI / 3, -2 * PI / 3) + random(-0.1, 0.1);
          let len = d.size * random(0.6, 1.1);
          let x2 = cos(angle) * len;
          let y2 = sin(angle) * len;
          line(0, 0, x2, y2);
          fill(d.col);
          noStroke();
          circle(x2, y2, d.size * 0.18);
        }
        pop();
      } else if (d.type === 'rock') {
        push();
        translate(d.x, d.y);
        fill(d.col);
        stroke(40, 40, 50);
        strokeWeight(1);
        beginShape();
        let vertCount = int(random(5, 7));
        for (let i = 0; i < vertCount; i++) {
          let angle = map(i, 0, vertCount, 0, TWO_PI);
          let jitter = random(-d.size * 0.3, d.size * 0.3);
          let r = d.size + jitter;
          let vx = cos(angle) * r;
          let vy = sin(angle) * r * 0.6;
          vertex(vx, vy);
        }
        endShape(CLOSE);
        pop();
      }
    }
    pop();
  }
}
