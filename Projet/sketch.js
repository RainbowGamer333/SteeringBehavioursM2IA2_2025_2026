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

    // La cible, ce sera la position de la souris
    mouseTarget = createVector(random(width), random(height));
}

function draw() {
    background(0);
    maze.show();

    mouseTarget.x = mouseX;
    mouseTarget.y = mouseY;

    // dessin de la cible à la position de la souris
    push();
    fill(255, 0, 0, 175);
    noStroke();
    ellipse(mouseTarget.x, mouseTarget.y, 20);
    pop();

    seekMouseForce = player.seek(mouseTarget);
    avoidWallsForce = player.avoidWalls(maze);
    player.applyForce(seekMouseForce);
    player.applyForce(avoidWallsForce.mult(1.5)); // on donne plus d'importance à l'évitement des murs
    player.update();
    player.show();
}

function windowResized() {
    resizeCanvas(cols * cellSize, rows * cellSize);
}
