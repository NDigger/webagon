import Game from "./game";
import DrawHandler from './drawHandler';

export default class Level {
    game;
    #gameOver = false;
    #lastUpdateTime = performance.now();
    onInit = () => {};
    onUpdate = () => {};

    constructor(pixiApp) {
        const game = new Game({
            pixiApp: pixiApp,
            drawHandler: new DrawHandler(),
        })
        this.game = game;
        requestAnimationFrame(t => this.#update(t))
    }

    start() {
        this.onInit(this.game)
        this.game.onDeath = () => this.#gameOver = true
    }

    #update(time) {
        if (this.#gameOver) return
        const frameTime = time - this.#lastUpdateTime;
        this.#lastUpdateTime = time;
        this.onUpdate(this.game, frameTime);

        const timer = document.getElementById('timer');
        timer.textContent = Math.floor(time)/1000;
        timer.style.color = this.game.getMainColor().getRGBStyle();
        
        requestAnimationFrame(t => this.#update(t));
    }
}