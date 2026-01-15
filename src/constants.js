export const COLORS = {
  BACKGROUND: '#000000',
  MATRIX_GREEN: '#0F0',
  MATRIX_DARK_GREEN: '#003300',
  MATRIX_LIGHT: '#80FF80',
  GLOW: '0 0 10px #0F0, 0 0 20px #0F0',
};

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;
export const BLOCK_SIZE = 30; // Default generic block size, will be dynamic

export const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: COLORS.MATRIX_LIGHT },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: COLORS.MATRIX_LIGHT },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: COLORS.MATRIX_LIGHT },
  O: { shape: [[1, 1], [1, 1]], color: COLORS.MATRIX_LIGHT },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: COLORS.MATRIX_LIGHT },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: COLORS.MATRIX_LIGHT },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: COLORS.MATRIX_LIGHT },
};
