import { COLORS } from './constants';

export class DigitalRain {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fontSize = 16;
        this.columns = 0;
        this.drops = []; // y-position of each drop

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Characters: Latin + Numbers + Symbols (No Katakana)
        this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'\'#&_(),.;:?!\\|{}<>[]^~';
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.columns = Math.floor(this.canvas.width / this.fontSize);

        // Reset drops if resizing increases columns significantly, or just fill new ones
        // Simpler approach: Re-initialize all drops
        const newDrops = [];
        for (let i = 0; i < this.columns; i++) {
            // Start at random y positions to avoid "wall of text" falling all at once initially
            // But for a continuous rain, standard is starting at 1 or random negative
            newDrops[i] = Math.random() * -100; // Start slightly above
        }
        this.drops = newDrops;
    }

    draw() {
        // Semi-transparent black to create trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = COLORS.MATRIX_GREEN;
        this.ctx.font = `${this.fontSize}px monospace`;

        for (let i = 0; i < this.drops.length; i++) {
            // Random character
            const text = this.chars.charAt(Math.floor(Math.random() * this.chars.length));

            // Draw character
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            // Reset drop to top randomly after it has crossed the screen
            // Adding Math.random() > 0.975 for randomness in reset time creates the "rain" variance
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }

            // Move drop down
            this.drops[i]++;
        }
    }
}
