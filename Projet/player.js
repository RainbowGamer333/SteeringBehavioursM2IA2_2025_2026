class Player extends Vehicle {
  constructor(x, y, radius = 12) {
    super(x, y);
    this.radius = radius;
    this.color = color(30, 220, 30);
  }

  applyBehaviors(target, maze) {
    this.seekForce = this.seek(target).mult(this.seekWeight);
    this.avoidForce = this.avoidWalls(maze).mult(this.avoidWeight);

    if (this.avoidForce.mag() > 0.001) {
      this.applyForce(this.avoidForce);
    } else {
      this.applyForce(this.seekForce);
    }
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
