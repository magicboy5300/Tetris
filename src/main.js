import './style.css';
import { DigitalRain } from './DigitalRain';
import { TetrisGame } from './Tetris';
import { InputHandler } from './Input';
import { GRID_WIDTH, GRID_HEIGHT } from './constants';
import { initSupabase, saveScore, getLeaderboard } from './supabase';

// Initialize Supabase
initSupabase();

const bgCanvas = document.getElementById('bg-canvas');
const gameCanvas = document.getElementById('game-canvas');
const startBtn = document.getElementById('start-btn');
const uiOverlay = document.getElementById('ui-overlay');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const linesDisplay = document.getElementById('lines-display');
const title = document.getElementById('title');
const nicknameInput = document.getElementById('nickname-input');
const leaderboardList = document.getElementById('leaderboard-list');

let currentNickname = '';

// Helper: Refresh Leaderboard
async function refreshLeaderboard() {
  leaderboardList.innerHTML = '<li>LOADING...</li>';
  const scores = await getLeaderboard();
  leaderboardList.innerHTML = '';

  if (scores.length === 0) {
    leaderboardList.innerHTML = '<li>NO RECORDS YET</li>';
    return;
  }

  scores.forEach((entry, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
            <span>#${index + 1} ${entry.nickname}</span>
            <span>${entry.score}</span>
        `;
    leaderboardList.appendChild(li);
  });
}

// Initialize Background
const digitalRain = new DigitalRain(bgCanvas);
function animateBg() {
  digitalRain.draw();
  requestAnimationFrame(animateBg);
}
animateBg();

// Initial Leaderboard Load
refreshLeaderboard();

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

game.onGameOver = async () => {
  cancelAnimationFrame(gameLoopId);
  uiOverlay.classList.remove('hidden');
  uiOverlay.classList.remove('pointer-events-none');
  uiOverlay.classList.add('interactive');
  document.getElementById('leaderboard').classList.remove('hidden'); // Ensure LB is visible

  title.textContent = "SYSTEM FAILURE";
  startBtn.textContent = "REBOOT SYSTEM";

  // Save Score
  if (currentNickname) {
    await saveScore(currentNickname, game.score);
    await refreshLeaderboard();
  }
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

// Modal Logic
const infoBtn = document.getElementById('info-btn');
const infoModal = document.getElementById('info-modal');
const closeModal = document.getElementById('close-modal');

if (infoBtn && infoModal && closeModal) {
  infoBtn.addEventListener('click', () => {
    infoModal.classList.remove('hidden');
  });

  closeModal.addEventListener('click', () => {
    infoModal.classList.add('hidden');
  });

  // Close on click outside
  window.addEventListener('click', (event) => {
    if (event.target === infoModal) {
      infoModal.classList.add('hidden');
    }
  });
}

startBtn.addEventListener('click', () => {
  const nickname = nicknameInput.value.trim();
  if (!nickname) {
    alert("PLEASE ENTER YOUR CODENAME AGENT");
    nicknameInput.focus();
    return;
  }
  currentNickname = nickname;

  uiOverlay.classList.add('hidden');
  uiOverlay.classList.remove('interactive');
  document.getElementById('leaderboard').classList.add('hidden'); // Hide LB during game

  game.reset();
  gameLoopId = requestAnimationFrame(gameLoop);
});
