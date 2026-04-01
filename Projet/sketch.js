let maze;
let player;
let cols = 20;
let rows = 15;
let cellSize = 40;

function setup() {
    createCanvas(cols * cellSize, rows * cellSize);
    maze = new Maze(cols, rows, cellSize);
    maze.generate();

    const startPos = maze.getCellCenter(maze.startCell);
    player = new Player(startPos.x, startPos.y, cellSize * 0.25);
    player.maxSpeed = 2;
    player.maxForce = 1;

    guards = [];
    for (let i = 0; i < 10; i++) {
        let randCell = maze.grid[floor(random(maze.grid.length))];
        let guardPos = maze.getCellCenter(randCell);
        let newGuard = new Guard(guardPos.x, guardPos.y);
        guards.push(newGuard);
    }


    // La cible, ce sera la position de la souris
    mouseTarget = createVector(random(width), random(height));
}

function draw() {
    background(0);
    maze.show();

    mouseTarget.x = mouseX;
    mouseTarget.y = mouseY;

    // dessin de la souris
    push();
    fill(255, 0, 0, 175);
    noStroke();
    ellipse(mouseTarget.x, mouseTarget.y, 20);
    pop();

    player.applyBehaviors(mouseTarget, maze);
    player.update();
    player.show();

    for (let guard of guards) {
        guard.applyBehaviors(player, maze);
        guard.update();
        guard.show(maze);
    }
}

function windowResized() {
    resizeCanvas(cols * cellSize, rows * cellSize);
}
