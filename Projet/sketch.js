const NB_COLS = 5;
const NB_ROWS = 5;
const CELL_SIZE = 40;

const NB_GUARDS = 0;

let maze;
let player;
let guards;
let mouseTarget;

let started = false;
let startOverlay;
let gameOverOverlay;
let victoryOverlay;

function setup() {
    createCanvas(NB_COLS * CELL_SIZE, NB_ROWS * CELL_SIZE);
    createStartOverlay();
    createGameOverOverlay();
    createVictoryOverlay();
    initGame();
}

function initGame() {
    maze = new Maze(NB_COLS, NB_ROWS, CELL_SIZE);
    maze.generate();

    const startPos = maze.getCellCenter(maze.startCell);
    player = new Player(startPos.x, startPos.y, CELL_SIZE * 0.25);
    player.maxSpeed = 2;
    player.maxForce = 1;

    guards = [];
    let nbGuards = 0;
    while (nbGuards < NB_GUARDS) {
        let randCell = maze.grid[floor(random(maze.grid.length))];
        if (maze.isSafeCell(randCell)) continue;

        let guardPos = maze.getCellCenter(randCell);
        let newGuard = new Guard(guardPos.x, guardPos.y);
        guards.push(newGuard);
        nbGuards++;
    }

    mouseTarget = createVector(random(width), random(height));

    background(0);
    maze.show();
    player.show();
    for (let guard of guards) {
        guard.applyBehaviors(player, maze);
        guard.update();
        guard.show(maze);
    }

    started = false;
    startOverlay.show();
    gameOverOverlay.hide();
    victoryOverlay.hide();

    noLoop();
}

function draw() {
    if (!started) {
        return;
    }

    background(0);
    maze.show();

    mouseTarget.x = mouseX;
    mouseTarget.y = mouseY;

    push();
    fill(255, 0, 0, 175);
    noStroke();
    ellipse(mouseTarget.x, mouseTarget.y, 20);
    pop();

    player.applyBehaviors(mouseTarget, maze);
    player.update();
    player.show();

    const playerCell = player.getCurrentCell(maze);
    if (playerCell === maze.endCell) {
        triggerVictory();
        return;
    }

    for (let guard of guards) {
        guard.applyBehaviors(player, maze);
        guard.update();
        guard.show(maze);

        if (p5.Vector.dist(player.pos, guard.pos) <= 5) {
            triggerGameOver();
            return;
        }
    }
}

function windowResized() {
    resizeCanvas(NB_COLS * CELL_SIZE, NB_ROWS * CELL_SIZE);
    if (startOverlay) {
        startOverlay.style('width', `${width}px`);
        startOverlay.style('height', `${height}px`);
    }
    if (gameOverOverlay) {
        gameOverOverlay.style('width', `${width}px`);
        gameOverOverlay.style('height', `${height}px`);
    }
    if (victoryOverlay) {
        victoryOverlay.style('width', `${width}px`);
        victoryOverlay.style('height', `${height}px`);
    }
}

function createStartOverlay() {
    startOverlay = createDiv(`
        <div id="startOverlayContent" style="text-align:center;color:white;">
            <h1>Dungeon Escape</h1>
            <p>Press Start to begin. Move the player with mouse.
            Avoid the guards and reach the exit.</p>
            <button id="startGameButton" style="font-size:1.2rem;padding:10px 20px;cursor:pointer;">Start</button>
        </div>
    `);
    startOverlay.style('position', 'absolute');
    startOverlay.style('top', '0');
    startOverlay.style('left', '0');
    startOverlay.style('width', `${width}px`);
    startOverlay.style('height', `${height}px`);
    startOverlay.style('background-color', 'rgba(0, 0, 0, 0.45)');
    startOverlay.style('display', 'flex');
    startOverlay.style('align-items', 'center');
    startOverlay.style('justify-content', 'center');

    const startButton = select('#startGameButton');
    startButton.mousePressed(() => {
        started = true;
        startOverlay.hide();
        loop();
    });
    startOverlay.hide();
}

function createVictoryOverlay() {
    victoryOverlay = createDiv(`
        <div id="victoryOverlayContent" style="text-align:center;color:white;">
            <h1>Victory!</h1>
            <p>You reached the exit.</p>
            <button id="playAgainButtonVictory" style="font-size:1.2rem;padding:10px 20px;cursor:pointer;">Play Again</button>
        </div>
    `);
    victoryOverlay.style('position', 'absolute');
    victoryOverlay.style('top', '0');
    victoryOverlay.style('left', '0');
    victoryOverlay.style('width', `${width}px`);
    victoryOverlay.style('height', `${height}px`);
    victoryOverlay.style('background-color', 'rgba(0, 0, 0, 0.45)');
    victoryOverlay.style('display', 'flex');
    victoryOverlay.style('align-items', 'center');
    victoryOverlay.style('justify-content', 'center');

    const playAgainVictory = select('#playAgainButtonVictory');
    playAgainVictory.mousePressed(() => {
        initGame();
    });
    victoryOverlay.hide();
}

function createGameOverOverlay() {
    gameOverOverlay = createDiv(`
        <div id="gameOverOverlayContent" style="text-align:center;color:white;">
            <h1>Game Over</h1>
            <p>A guard caught you.</p>
            <button id="playAgainButton" style="font-size:1.2rem;padding:10px 20px;cursor:pointer;">Play Again</button>
        </div>
    `);
    gameOverOverlay.style('position', 'absolute');
    gameOverOverlay.style('top', '0');
    gameOverOverlay.style('left', '0');
    gameOverOverlay.style('width', `${width}px`);
    gameOverOverlay.style('height', `${height}px`);
    gameOverOverlay.style('background-color', 'rgba(0, 0, 0, 0.45)');
    gameOverOverlay.style('display', 'flex');
    gameOverOverlay.style('align-items', 'center');
    gameOverOverlay.style('justify-content', 'center');

    const playAgainButton = select('#playAgainButton');
    playAgainButton.mousePressed(() => {
        initGame();
    });
    gameOverOverlay.hide();
}

function triggerGameOver() {
    started = false;
    noLoop();
    gameOverOverlay.show();
    startOverlay.hide();
    victoryOverlay.hide();
}

function triggerVictory() {
    started = false;
    noLoop();
    victoryOverlay.show();
    startOverlay.hide();
    gameOverOverlay.hide();
}



