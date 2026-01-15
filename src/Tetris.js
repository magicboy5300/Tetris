import { GRID_WIDTH, GRID_HEIGHT, TETROMINOS, COLORS } from './constants';
import { Tetromino } from './Tetromino';

export class TetrisGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        this.grid = this.createGrid();
        this.blockSize = 30; // Will be updated via resize

        this.score = 0;
        this.lines = 0;
        this.level = 1;

        this.activePiece = null;
        this.nextPiece = null; // Ensure this is initialized or handled

        this.gameOver = false;
        this.paused = false;

        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;

        // Callbacks for UI updates
        this.onScoreUpdate = null;
        this.onGameOver = null;

        this.reset();
    }

    createGrid() {
        // 20 rows, 10 columns filled with 0
        return Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
    }

    reset() {
        this.grid = this.createGrid();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameOver = false;
        this.dropInterval = 1000;
        this.spawnPiece();
        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.level, this.lines);
    }

    setBlockSize(size) {
        this.blockSize = size;
    }

    spawnPiece() {
        const keys = Object.keys(TETROMINOS);
        const randKey = keys[Math.floor(Math.random() * keys.length)];
        this.activePiece = new Tetromino(randKey);

        // Check initial collision (Game Over)
        if (this.checkCollision(this.activePiece)) {
            this.gameOver = true;
            if (this.onGameOver) this.onGameOver();
        }
    }

    checkCollision(piece) {
        for (let y = 0; y < piece.matrix.length; y++) {
            for (let x = 0; x < piece.matrix[y].length; x++) {
                // If the cell is empty in the piece logic, skip it
                if (piece.matrix[y][x] !== 0) {
                    const newX = piece.x + x;
                    const newY = piece.y + y;

                    // Wall/Floor collision
                    if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
                        return true;
                    }

                    // Grid collision (ignore current piece)
                    // Note: newY < 0 is "above board", which is fine for spawning, 
                    // but if it hits something existing... usually we don't check collision above board 
                    // unless we're topping out.
                    // Standard approach: if newY >= 0 and grid[newY][newX] is filled
                    if (newY >= 0 && this.grid[newY][newX] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    merge(piece) {
        piece.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    // Only merge if inside grid (y could be negative if topping out technically, but collision handles that)
                    if (piece.y + y >= 0) {
                        this.grid[piece.y + y][piece.x + x] = value; // Could store color or non-zero
                    }
                }
            });
        });
    }

    rotate() {
        if (this.gameOver || this.paused) return;

        const clone = this.activePiece.clone();
        clone.rotate();

        // Basic Wall Kick (simple version: try to move left/right if colliding)
        if (!this.checkCollision(clone)) {
            this.activePiece.rotate();
        } else {
            // Try shifting right
            clone.x++;
            if (!this.checkCollision(clone)) {
                this.activePiece.rotate();
                this.activePiece.x++;
                return;
            }
            // Try shifting left
            clone.x -= 2; // -1 from original
            if (!this.checkCollision(clone)) {
                this.activePiece.rotate();
                this.activePiece.x--;
                return;
            }
        }
    }

    move(dir) { // -1 left, 1 right
        if (this.gameOver || this.paused) return;

        this.activePiece.x += dir;
        if (this.checkCollision(this.activePiece)) {
            this.activePiece.x -= dir;
        }
    }

    drop() {
        if (this.gameOver || this.paused) return;

        this.activePiece.y++;
        if (this.checkCollision(this.activePiece)) {
            this.activePiece.y--;
            this.lock();
        }
        this.dropCounter = 0; // Reset drop timer on manual drop? Usually soft drop resets or speeds up
    }

    lock() {
        this.merge(this.activePiece);
        this.clearLines();
        this.spawnPiece();
    }

    clearLines() {
        let linesCleared = 0;

        // Scan from bottom to top
        for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
            // Check if row is full (no zeros)
            if (this.grid[y].every(value => value !== 0)) {
                // Remove row and add new empty row at top
                const row = this.grid.splice(y, 1)[0].fill(0);
                this.grid.unshift(row);
                linesCleared++;
                y++; // Check same index again since lines shifted down
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level; // Basic scoring
            // Level up every 10 lines
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

            if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.level, this.lines);
        }
    }

    update(currTime) {
        if (this.gameOver || this.paused) return;

        const deltaTime = currTime - this.lastTime;
        this.lastTime = currTime;

        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.drop();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Grid
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.drawBlock(x, y, COLORS.MATRIX_LIGHT); // Locked blocks
                }
            });
        });

        // Draw Active Piece
        if (this.activePiece) {
            this.activePiece.matrix.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        this.drawBlock(this.activePiece.x + x, this.activePiece.y + y, this.activePiece.color);
                    }
                });
            });
        }
    }

    drawBlock(x, y, color) {
        const size = this.blockSize;
        const px = x * size;
        const py = y * size;

        this.ctx.fillStyle = `rgba(0, 255, 0, 0.1)`; // Transparent inner
        this.ctx.fillRect(px, py, size, size);

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(px, py, size, size);

        // Inner small rect for "tech" look
        this.ctx.strokeRect(px + 4, py + 4, size - 8, size - 8);
    }
}
