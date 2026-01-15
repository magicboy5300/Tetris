import { TETROMINOS } from './constants';

export class Tetromino {
    constructor(type) {
        this.type = type;
        // Deep copy to prevent mutation of the constant
        this.matrix = TETROMINOS[type].shape.map(row => [...row]);
        this.color = TETROMINOS[type].color;

        // Position (starts centered at top)
        // We assume grid width 10. Center is roughly x=3 or 4.
        this.x = 3;
        this.y = 0;
    }

    // Rotate matrix 90 degrees clockwise
    rotate() {
        const N = this.matrix.length;
        // Transpose
        const transposed = this.matrix.map((row, i) =>
            row.map((val, j) => this.matrix[j][i])
        );
        // Reverse rows
        this.matrix = transposed.map(row => row.reverse());
    }

    // Clone providing a convenient way to test rotation without committing
    clone() {
        const clone = new Tetromino(this.type);
        clone.matrix = this.matrix.map(row => [...row]);
        clone.x = this.x;
        clone.y = this.y;
        clone.color = this.color;
        return clone;
    }
}
