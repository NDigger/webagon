import Game from "./game";
import DrawHandler from './drawHandler';

export default class Level {
    #pixiApp;
    game;
    #gameOver = false;

    #renderId = null;
    #updateId = null;
    #lastUpdateTime = performance.now();
    #lastRestartTime = 0;

    onInit = () => {};
    onUpdate = () => {};
    onRender = () => {};

    constructor(pixiApp) {
        this.#pixiApp = pixiApp

        window.addEventListener('keydown', this.#handleKeydown)

        this.#renderId = requestAnimationFrame(t => this.#render)
    }

    #handleVisibilityChange = () => {
        if (document.hidden) this.kill();
    };

    #handleKeydown = e => {
        if (e.keyCode === 82) this.restart();
        if (e.keyCode === 27) this.leave();
    }

    leave() {
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        this.game.destroy()
        cancelAnimationFrame(this.#updateId)
        cancelAnimationFrame(this.#renderId)
    }

    restart() {
        this.#lastUpdateTime = performance.now();
        this.#lastRestartTime = performance.now();
        cancelAnimationFrame(this.#updateId);
        this.start();
    }

    start() {
        if (this.game != null) this.game.destroy();
        this.#gameOver = false;
        const game = new Game({
            pixiApp: this.#pixiApp,
            drawHandler: new DrawHandler(),
        })
        this.game = game;

        this.onInit(game)
        this.game.onDeath = () => {
            cancelAnimationFrame(this.#updateId);
            window.removeEventListener('keydown', this.#handleVisibilityChange);
            this.#gameOver = true
        }

        document.addEventListener('visibilitychange', this.#handleVisibilityChange);
        this.#updateId = requestAnimationFrame(t => this.#update(t))
    }

    kill() {
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        this.game.kill()
        cancelAnimationFrame(this.#updateId);
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

    #render(time) {
        const frameTime = time - this.#lastUpdateTime;

        this.onRender(this.game, frameTime)
        this.#renderId = requestAnimationFrame(t => this.#render(t))
    }
}