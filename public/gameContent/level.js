import DrawHandler from "./drawHandler";
import Game from "./game";

export default class Level { 
    onInit = () => {};
    onUpdate = () => {};
    onRender = () => {};
    onLoad = () => {};

    #pixiApp;

    #levelInitTime = performance.now();

    game;

    #gameOver = false;
    #renderId = null;
    #updateId = null;
    #lastUpdateTime = performance.now();
    #lastRenderTime = performance.now();

    constructor(pixiApp) {
        this.#pixiApp = pixiApp
    }
    
    init() {
        const game = new Game({
            pixiApp: this.#pixiApp,
            drawHandler: new DrawHandler(),
        })
        this.game = game;
        this.onInit();

        this.#updateId = requestAnimationFrame(t => this.#update(t));
        this.#renderId = requestAnimationFrame(t => this.#render(t));
        document.addEventListener('visibilitychange', this.#handleVisibilityChange);

        this.game.onDeath = () => this.#onDeath()
    }
    
    #handleVisibilityChange = () => document.hidden && this.game.kill()

    #update(time) {
        if (this.#gameOver) return
        const frameTime = time - this.#lastUpdateTime;
        this.#lastUpdateTime = time ;
        this.onUpdate(frameTime/1000);

        const timer = document.getElementById('timer');
        timer.textContent = Math.floor(time)/1000;
        if (this.game) timer.style.color = this.game.getMainColor().getRGBStyle();
        
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    #render(time) {
        const frameTime = time - this.#lastRenderTime;
        this.#lastRenderTime = time;
        this.onRender(frameTime/1000)
        this.#renderId = requestAnimationFrame(t => this.#render(t))
    }

    destroy() {
        cancelAnimationFrame(this.#updateId)
        cancelAnimationFrame(this.#renderId)
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        this.game.destroy()
    }

    #onDeath() {
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        this.#gameOver = true
        cancelAnimationFrame(this.#updateId);
    }
}