import './style.css';
import { DigitalRain } from './DigitalRain';
import { TetrisGame } from './Tetris';
import { InputHandler } from './Input';
import { GRID_WIDTH, GRID_HEIGHT } from './constants';

const bgCanvas = document.getElementById('bg-canvas');
const gameCanvas = document.getElementById('game-canvas');
const startBtn = document.getElementById('start-btn');
const uiOverlay = document.getElementById('ui-overlay');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const linesDisplay = document.getElementById('lines-display');
const title = document.getElementById('title');

// Initialize Background
const digitalRain = new DigitalRain(bgCanvas);
function animateBg() {
  digitalRain.draw();
  requestAnimationFrame(animateBg);
}
animateBg();

// Initialize Game
const game = new TetrisGame(gameCanvas);
const input = new InputHandler(game);

// Game Loop
let gameLoopId;
function gameLoop(time) {
  game.update(time);
  game.draw();
  gameLoopId = requestAnimationFrame(gameLoop);
}

// UI Callbacks
game.onScoreUpdate = (score, level, lines) => {
  scoreDisplay.textContent = `SCORE: ${score}`;
  levelDisplay.textContent = `LEVEL: ${level}`;
  linesDisplay.textContent = `LINES: ${lines}`;
};

game.onGameOver = () => {
  cancelAnimationFrame(gameLoopId);
  uiOverlay.classList.remove('hidden');
  uiOverlay.classList.remove('pointer-events-none'); // Helper class check?
  uiOverlay.classList.add('interactive');

  title.textContent = "SYSTEM FAILURE";
  startBtn.textContent = "REBOOT SYSTEM";
};

// Resize Handling
function resizeGame() {
  const maxHeight = window.innerHeight * 0.8;
  const maxWidth = window.innerWidth * 0.95; // More width for mobile

  let newBlockSize = Math.floor(maxHeight / GRID_HEIGHT);
  if (newBlockSize * GRID_WIDTH > maxWidth) {
    newBlockSize = Math.floor(maxWidth / GRID_WIDTH);
  }

  game.setBlockSize(newBlockSize);
  gameCanvas.width = newBlockSize * GRID_WIDTH;
  gameCanvas.height = newBlockSize * GRID_HEIGHT;

  // Force redraw
  game.draw();
}

resizeGame();
window.addEventListener('resize', resizeGame);

startBtn.addEventListener('click', () => {
  uiOverlay.classList.add('hidden');
  uiOverlay.classList.remove('interactive');

  game.reset();
  gameLoopId = requestAnimationFrame(gameLoop);
});
