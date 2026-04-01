class Vehicle {
    static debug = false;
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxSpeed = 7;
        this.maxForce = 0.4;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    seek(target) {
        // on calcule la direction vers la cible : la vitesse DESIREE
        // C'est l'ETAPE 1 (action : se diriger vers une cible)
        let desiredSpeed = p5.Vector.sub(target, this.pos);

        // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
        // on limite ce vecteur à la longueur maxSpeed
        desiredSpeed.setMag(this.maxSpeed);

        // Si on s'arrête ici, force = desiredSpeed
        if (desiredSpeed.mag() < 2) {
            return createVector(0, 0);
        }

        // on calcule maintenant LA FORMULE MAGIQUE : force = desiredSpeed - currentSpeed
        let force = p5.Vector.sub(desiredSpeed, this.vel);

        // et on limite cette force à la longueur maxForce
        force.limit(this.maxForce);

        return force;
    }

    avoidWalls(maze) {
    if (!maze) return createVector(0, 0);

    const currentCell = maze.getCellAtPos(this.pos);
    if (!currentCell) return createVector(0, 0);

    const ahead = this.pos.copy().add(this.vel.copy().setMag(this.maxSpeed * 2));
    const aheadCell = maze.getCellAtPos(ahead);

    if (!aheadCell || aheadCell === currentCell) {
      return createVector(0, 0);
    }

    const collision = maze.isWallBetween(currentCell, aheadCell);
    if (!collision) {
      return createVector(0, 0);
    }

    let avoid = this.pos.copy().sub(ahead).setMag(this.maxForce * 2);
    if (avoid.mag() < 0.001) {
      avoid = createVector(-this.vel.y, this.vel.x).setMag(this.maxForce / 2);
    }
    return avoid;
  }
}