export class InputHandler {
    constructor(game) {
        this.game = game;
        this.setupKeyboard();
        this.setupMobileControls();
    }

    setupKeyboard() {
        document.addEventListener('keydown', (event) => {
            // Prevent default scrolling for arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
                event.preventDefault();
            }

            switch (event.key) {
                case 'ArrowLeft':
                    this.game.move(-1);
                    break;
                case 'ArrowRight':
                    this.game.move(1);
                    break;
                case 'ArrowDown':
                    this.game.drop();
                    break;
                case 'ArrowUp':
                    this.game.rotate();
                    break;
                case ' ':
                    this.game.hardDrop();
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
        const bindBtn = (btn, action, continuous = false) => {
            if (!btn) return;
            let intervalId = null;

            const startAction = (e) => {
                if (e.cancelable) e.preventDefault();
                action();
                if (continuous) {
                    if (intervalId) clearInterval(intervalId);
                    intervalId = setInterval(action, 100); // 100ms repeat for fast drop
                }
            };

            const endAction = (e) => {
                if (e.cancelable) e.preventDefault();
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            };

            btn.addEventListener('touchstart', startAction, { passive: false });
            btn.addEventListener('touchend', endAction);
            btn.addEventListener('mousedown', startAction);
            btn.addEventListener('mouseup', endAction);
            btn.addEventListener('mouseleave', endAction);
        };

        bindBtn(leftBtn, () => this.game.move(-1));
        bindBtn(rightBtn, () => this.game.move(1));
        bindBtn(downBtn, () => this.game.drop(), true); // Enable continuous for drop
        bindBtn(rotateBtn, () => this.game.rotate());
    }
}
