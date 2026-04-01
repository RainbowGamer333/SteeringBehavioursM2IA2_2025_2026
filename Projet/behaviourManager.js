class BehaviourManager {
    constructor() {
        this.seekWeight = 1.0;
        this.avoidWeight = 1.5;

        this.seekForce = createVector(0, 0);
        this.avoidForce = createVector(0, 0);
    }

    seek(target) {

        // on calcule la direction vers la cible : la vitesse DESIREE
        // C'est l'ETAPE 1 (action : se diriger vers une cible)
        let desiredSpeed = p5.Vector.sub(target, this.pos);

        // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
        // on limite ce vecteur à la longueur maxSpeed
        desiredSpeed.setMag(this.maxSpeed);

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

    wanderMaze(maze) {
        if (!maze) return;

        if (!this.wanderTarget) {
            this.wanderTarget = this.chooseWanderTarget(maze);
        }

        if (this.wanderTarget) {
            const d = p5.Vector.dist(this.pos, this.wanderTarget);
            if (d <= 15) {
                this.wanderTarget = this.chooseWanderTarget(maze);
            }
        }

        if (this.wanderTarget) {
            return this.seek(this.wanderTarget);
        }
    }
}