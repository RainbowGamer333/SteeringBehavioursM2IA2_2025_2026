const GUARD_WANDER_SPEED = 2;
const GUARD_SEEK_SPEED = 3;

class Guard extends Vehicle {
    constructor(x, y) {
        super(x, y);
        this.path = [];

        this.detectionRange = 180;
        this.fov = PI / 3; // 60 degrees field-of-view

        this.wanderTarget = null;
        this.prevCell = null;

        this.color = color(255, 0, 0);
    }

    applyBehaviors(target, maze) {
        const avoidForce = this.avoidWalls(maze).mult(this.avoidWeight);
        if (avoidForce.mag() > 0.001) {
            this.applyForce(avoidForce);
        } else {
            if (this.canSee(target, maze)) {
                this.maxSpeed = GUARD_SEEK_SPEED;
                this.color = color(125, 0, 255);
                this.wanderTarget = null; // reset wander target when hunting player
                this.applyForce(this.seek(target.pos).mult(this.seekWeight));
            } else {
                this.maxSpeed = GUARD_WANDER_SPEED;
                this.color = color(255, 0, 0);
                this.applyForce(this.wanderMaze(maze).mult(this.seekWeight));
            }
        }
        
    }

    canSee(target, maze) {
        if (!target || !target.pos) return false;

        if (maze && maze.isSafeZone && maze.isSafeZone(target.pos)) return false;

        const toTarget = p5.Vector.sub(target.pos, this.pos);
        const d = toTarget.mag();
        if (d > this.detectionRange) return false;

        let forward = this.vel.copy();
        if (forward.mag() < 0.01) {
            forward = createVector(1, 0);
        } else {
            forward.normalize();
        }

        const direction = toTarget.copy().normalize();
        const angle = acos(constrain(forward.dot(direction), -1, 1));
        if (angle > this.fov / 2) return false;

        if (!maze || typeof maze.lineIntersectsWall !== 'function') return true;
        return !maze.lineIntersectsWall(this.pos, target.pos);
    }

    

    chooseWanderTarget(maze) {
        const currentCell = this.getCurrentCell(maze);
        if (!currentCell) return null;

        let neighbors = maze.getOpenNeighbors(currentCell)
            .filter(c => !maze.isSafeCell(c));
        if (!neighbors.length) return null;

        let candidateNeighbors = neighbors;
        if (this.prevCell) {
            const forwardNeighbors = neighbors.filter(c => !(c.col === this.prevCell.col && c.row === this.prevCell.row));
            if (forwardNeighbors.length) {
                candidateNeighbors = forwardNeighbors;
            }
        }

        const nextCell = (() => {
            if (this.wanderTarget === null) {
                let forward = this.vel.copy();
                if (forward.mag() < 0.01) {
                    forward = createVector(1, 0);
                } else {
                    forward.normalize();
                }

                candidateNeighbors.sort((a, b) => {
                    const centerA = maze.getCellCenter(a);
                    const centerB = maze.getCellCenter(b);
                    const dirA = p5.Vector.sub(centerA, this.pos).normalize();
                    const dirB = p5.Vector.sub(centerB, this.pos).normalize();
                    const angleA = acos(constrain(forward.dot(dirA), -1, 1));
                    const angleB = acos(constrain(forward.dot(dirB), -1, 1));
                    return angleA - angleB;
                });
                return candidateNeighbors[0];
            } else {
                return random(candidateNeighbors);
            }
        })();

        if (nextCell) {
            this.prevCell = currentCell;
            return maze.getCellCenter(nextCell);
        }

        return null;
    }

    show(maze) {
        push();

        // Vision cone with wall occlusion
        if (maze && typeof maze.getWallSegments === 'function') {
            const walls = maze.getWallSegments();
            let forward = this.vel.copy();
            if (forward.mag() < 0.01) {
                forward = createVector(1, 0);
            } else {
                forward.normalize();
            }

            const headingAngle = forward.heading();
            const startAngle = headingAngle - this.fov / 2;
            const rays = 30;

            noStroke();
            fill(255, 80, 80, 70);
            beginShape();
            vertex(this.pos.x, this.pos.y);

            for (let i = 0; i <= rays; i++) {
                const angle = startAngle + (i / rays) * this.fov;
                const rayDir = p5.Vector.fromAngle(angle);
                const rayEnd = p5.Vector.add(this.pos, rayDir.mult(this.detectionRange));
                let closest = rayEnd;
                let closestDist = this.detectionRange;

                for (const wall of walls) {
                    const hit = this._lineSegmentIntersection(this.pos, rayEnd, wall.p1, wall.p2);
                    if (hit) {
                        const d = p5.Vector.dist(this.pos, hit);
                        if (d < closestDist) {
                            closestDist = d;
                            closest = hit;
                        }
                    }
                }

                vertex(closest.x, closest.y);
            }

            endShape(CLOSE);
        }

        translate(this.pos.x, this.pos.y);
        fill(this.color);
        stroke(255);
        strokeWeight(1);
        circle(0, 0, this.radius * 2);

        let forward = this.vel.copy();
        if (forward.mag() < 0.01) {
            forward = createVector(1, 0);
        }
        const heading = forward.copy().setMag(this.radius * 1.3);
        stroke(255, 255, 0);
        line(0, 0, heading.x, heading.y);

        pop();
    }

    _lineSegmentIntersection(p1, p2, p3, p4) {
        const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
        if (abs(denom) < 1e-6) return null;

        const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
        const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            return createVector(
                p1.x + ua * (p2.x - p1.x),
                p1.y + ua * (p2.y - p1.y)
            );
        }

        return null;
    }
}