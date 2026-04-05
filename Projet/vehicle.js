class Vehicle extends BehaviourManager {
  static debug = false;
  constructor(x, y) {
    super();
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.slowDistance = 20;
    this.maxForce = 0.2;
    this.radius = 12;
  }

  show() {
    return;
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

  getCurrentCell(maze) {
    if (!maze || typeof maze.getCellAtPos !== 'function') return null;
    return maze.getCellAtPos(this.pos);
  }
}