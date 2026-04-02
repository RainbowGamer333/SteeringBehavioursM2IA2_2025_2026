class Cell {
  constructor(col, row, size) {
    this.col = col;
    this.row = row;
    this.size = size;
    this.walls = [true, true, true, true]; // top, right, bottom, left
    this.visited = false; // for maze generation
    this.start = false;
    this.end = false;
  }

  show() {
    const x = this.col * this.size;
    const y = this.row * this.size;

    if (this.visited) {
        noStroke();
        fill(30, 30, 100, 80);
        rect(x, y, this.size, this.size);
    }

    if (this.start) {
        noStroke();
        fill(0, 255, 0, 180);
        rect(x, y, this.size, this.size);
    }

    else if (this.end) {
        noStroke();
        fill(255, 0, 0, 180);
        rect(x, y, this.size, this.size);
    }

    stroke(255);
    strokeWeight(2);

    if (this.walls[0]) line(x, y, x + this.size, y);
    if (this.walls[1]) line(x + this.size, y, x + this.size, y + this.size);
    if (this.walls[2]) line(x + this.size, y + this.size, x, y + this.size);
    if (this.walls[3]) line(x, y + this.size, x, y);
  }
}

class Maze {
  constructor(cols, rows, cellSize = 40) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.grid = [];

    for (let j = 0; j < this.rows; j++) {
      for (let i = 0; i < this.cols; i++) {
        this.grid.push(new Cell(i, j, this.cellSize));
      }
    }
    this.grid[0].start = true;
    this.startCell = this.grid[0];

    this.grid[this.grid.length - 1].end = true;
    this.endCell = this.grid[this.grid.length - 1];
    
    this.current = this.startCell;
    this.stack = [];
  }

  index(col, row) {
    if (col < 0 || row < 0 || col >= this.cols || row >= this.rows) return -1;
    return col + row * this.cols;
  }

  generate() {
    this.current.visited = true;

    while (true) {
      const next = this.checkNeighbors(this.current);
      if (next) {
        next.visited = true;
        this.stack.push(this.current);
        this.removeWalls(this.current, next);
        this.current = next;
      } else if (this.stack.length > 0) {
        this.current = this.stack.pop();
      } else {
        break;
      }
    }
  }

  checkNeighbors(cell) {
    const { col, row } = cell;
    const neighbors = [];

    const top = this.grid[this.index(col, row - 1)];
    const right = this.grid[this.index(col + 1, row)];
    const bottom = this.grid[this.index(col, row + 1)];
    const left = this.grid[this.index(col - 1, row)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    if (neighbors.length > 0) {
      const r = floor(random(neighbors.length));
      return neighbors[r];
    }
    return undefined;
  }

  removeWalls(a, b) {
    const x = a.col - b.col;
    if (x === 1) {
      a.walls[3] = false;
      b.walls[1] = false;
    } else if (x === -1) {
      a.walls[1] = false;
      b.walls[3] = false;
    }

    const y = a.row - b.row;
    if (y === 1) {
      a.walls[0] = false;
      b.walls[2] = false;
    } else if (y === -1) {
      a.walls[2] = false;
      b.walls[0] = false;
    }
  }

  getCellAtPos(pos) {
    const col = floor(pos.x / this.cellSize, 0, this.cols - 1);
    const row = floor(pos.y / this.cellSize, 0, this.rows - 1);
    const idx = this.index(col, row);
    if (idx < 0) return null;
    return this.grid[idx];
  }

  getCellCenter(cell) {
    if (!cell) return null;
    return createVector(cell.col * this.cellSize + this.cellSize / 2, cell.row * this.cellSize + this.cellSize / 2);
  }

  isSafeCell(cell) {
    return cell && (cell.start || cell.end);
  }

  isSafeZone(pos) {
    const cell = this.getCellAtPos(pos);
    return this.isSafeCell(cell);
  }

  isWallBetween(a, b) {
    if (!a || !b) return true;
    if (a.col === b.col && a.row === b.row) return false;
    if (b.col === a.col + 1 && b.row === a.row) return a.walls[1];
    if (b.col === a.col - 1 && b.row === a.row) return a.walls[3];
    if (b.row === a.row + 1 && b.col === a.col) return a.walls[2];
    if (b.row === a.row - 1 && b.col === a.col) return a.walls[0];
    return true;
  }

  getOpenNeighbors(cell) {
    if (!cell) return [];
    const neighbors = [];
    const top = this.grid[this.index(cell.col, cell.row - 1)];
    const right = this.grid[this.index(cell.col + 1, cell.row)];
    const bottom = this.grid[this.index(cell.col, cell.row + 1)];
    const left = this.grid[this.index(cell.col - 1, cell.row)];

    if (top && !cell.walls[0]) neighbors.push(top);
    if (right && !cell.walls[1]) neighbors.push(right);
    if (bottom && !cell.walls[2]) neighbors.push(bottom);
    if (left && !cell.walls[3]) neighbors.push(left);

    return neighbors;
  }

  getWallSegments() {
    const segments = [];
    for (const cell of this.grid) {
      const x = cell.col * this.cellSize;
      const y = cell.row * this.cellSize;

      if (cell.walls[0]) segments.push({p1: createVector(x, y), p2: createVector(x + this.cellSize, y)}); // top
      if (cell.walls[1]) segments.push({p1: createVector(x + this.cellSize, y), p2: createVector(x + this.cellSize, y + this.cellSize)}); // right
      if (cell.walls[2]) segments.push({p1: createVector(x + this.cellSize, y + this.cellSize), p2: createVector(x, y + this.cellSize)}); // bottom
      if (cell.walls[3]) segments.push({p1: createVector(x, y + this.cellSize), p2: createVector(x, y)}); // left
    }
    return segments;
  }

  lineIntersectsWall(a, b) {
    const walls = this.getWallSegments();
    for (const w of walls) {
      if (this._lineIntersect(a, b, w.p1, w.p2)) return true;
    }
    return false;
  }

  _lineIntersect(p1, p2, p3, p4) {
    const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
    if (abs(denom) < 1e-6) return false;

    const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
    const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;

    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
  }

  show() {
    for (const cell of this.grid) {
        cell.show();
    }
  }
}