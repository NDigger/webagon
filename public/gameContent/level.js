import Game from "./game";
import DrawHandler from './drawHandler';

export default class Level {
    #pixiApp;
    game;
    #gameOver = false;

    #updateId = null;
    #lastUpdateTime = performance.now();
    #lastRestartTime = 0;

    onInit = () => {};
    onUpdate = () => {};

    constructor(pixiApp) {
        this.#pixiApp = pixiApp

        window.addEventListener('keydown', e => {
            if (e.keyCode === 82) this.restart()
        })
    }

    restart() {
        this.#lastUpdateTime = performance.now();
        this.#lastRestartTime = performance.now();
        this.#gameOver = false;
        this.game.destroy()
        cancelAnimationFrame(this.#updateId);
        this.start();
    }

    start() {
        this.#updateId = requestAnimationFrame(t => this.#update(t))
        const game = new Game({
            pixiApp: this.#pixiApp,
            drawHandler: new DrawHandler(),
        })
        this.game = game;

        this.onInit(game)
        this.game.onDeath = () => {
            cancelAnimationFrame(this.#updateId);
            this.#gameOver = true
        }
    }

    #update(time) {
        if (this.#gameOver) return
        const frameTime = time - this.#lastUpdateTime;
        this.#lastUpdateTime = time;
        this.onUpdate(this.game, frameTime);

        const timer = document.getElementById('timer');
        timer.textContent = Math.floor(time - this.#lastRestartTime)/1000;
        if (this.game) timer.style.color = this.game.getMainColor().getRGBStyle();
        
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }
}