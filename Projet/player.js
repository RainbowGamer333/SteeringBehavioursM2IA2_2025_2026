class Player extends Vehicle {
  constructor(x, y, radius = 12) {
    super(x, y);
    this.radius = radius;
    this.color = color(30, 220, 30);
    this.avoidDistance = 16;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyBehaviors(maze) {
    if (avoidForce.mag() > 0.001) {
      this.applyForce(avoidForce.mult(1.6));
    } else {
      this.applyForce(seekForce);
    }

    this.pos.x = constrain(this.pos.x, this.radius / 2, width - this.radius / 2);
    this.pos.y = constrain(this.pos.y, this.radius / 2, height - this.radius / 2);
  }

  

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(this.color);
    stroke(255);
    strokeWeight(1);
    circle(0, 0, this.radius * 2);

    const heading = this.vel.copy();
    if (heading.mag() > 0.1) {
      heading.setMag(this.radius * 1.3);
      stroke(255, 255, 0);
      line(0, 0, heading.x, heading.y);
    }
    pop();
  }
}
