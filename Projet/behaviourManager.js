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

        if (Vehicle.debug) {
            drawingContext.setLineDash([3, 5]);
            stroke(255, 255, 0, 255);
            line(this.pos.x, this.pos.y, target.x, target.y);
            drawingContext.setLineDash([]);
        }

        return force;
    }

    avoidWalls(maze) {
        if (!maze) return createVector(0, 0);

        const nextCell = maze.getCellAtPos(this.pos);
        if (!nextCell) return createVector(0, 0);

        // Determine the cell the vehicle would occupy after the next movement step
        const currentPos = this.pos.copy().add(this.vel.copy().setMag(this.maxSpeed*2));
        const currentCell = maze.getCellAtPos(currentPos);

        if (currentCell === nextCell) {
            return createVector(0, 0);
        }

        const collision = maze.isWallBetween(currentCell, nextCell);
        if (!collision) {
            return createVector(0, 0);
        }

        // Push away from the wall direction using the current velocity vector
        let avoid = this.pos.copy().sub(currentPos).setMag(this.maxForce * 2);
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
            if (Vehicle.debug) {
                fill(255, 0, 255, 255);
                circle(this.wanderTarget.x, this.wanderTarget.y, 8);
            }
            return this.seek(this.wanderTarget);
        }
    }
}