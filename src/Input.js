export class InputHandler {
    constructor(game) {
        this.game = game;
        this.setupKeyboard();
        this.setupMobileControls();
    }

    setupKeyboard() {
        document.addEventListener('keydown', (event) => {
            switch (event.keyCode) {
                case 37: // Left
                    this.game.move(-1);
                    break;
                case 39: // Right
                    this.game.move(1);
                    break;
                case 40: // Down
                    this.game.drop();
                    break;
                case 38: // Up
                    this.game.rotate();
                    break;
                case 32: // Space (Hard drop? or pause?) - let's make it Drop for now or Pause
                    // this.game.hardDrop(); // Logic not implemented yet
                    break;
            }
        });
    }

    setupMobileControls() {
        const leftBtn = document.getElementById('btn-left');
        const rightBtn = document.getElementById('btn-right');
        const downBtn = document.getElementById('btn-down');
        const rotateBtn = document.getElementById('btn-rotate');
        const controlsContainer = document.getElementById('mobile-controls');

        // Basic visibility check
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            controlsContainer.classList.remove('hidden');
        }

        // Touch events - preventing default to avoid double-tap zoom etc.
        const bindBtn = (btn, action) => {
            if (!btn) return;
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                action();
            });
            btn.addEventListener('mousedown', (e) => { // Setup for mouse testing
                e.preventDefault();
                action();
            });
        };

        bindBtn(leftBtn, () => this.game.move(-1));
        bindBtn(rightBtn, () => this.game.move(1));
        bindBtn(downBtn, () => this.game.drop());
        bindBtn(rotateBtn, () => this.game.rotate());
    }
}
