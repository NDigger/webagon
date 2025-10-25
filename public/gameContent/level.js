import Game from "./game";
import DrawHandler from './drawHandler';

export default class Level {
    #pixiApp
    game;

    #updateId;
    #lastUpdateTime = performance.now();

    onInit = () => {}
    onUpdate = () => {}

    constructor (pixiApp) {
        this.#pixiApp = pixiApp;
    }

    start() {
        const game = new Game({
            pixiApp: this.#pixiApp,
            drawHandler: new DrawHandler(),
        });
        this.game = game;
        this.onInit(this.game)

        this.#updateId = requestAnimationFrame(t => this.#update(t))
    }

    #update(time) {
        const frameTime = time - this.#lastUpdateTime;
        this.#lastUpdateTime = time;
        this.onUpdate(this.game, frameTime)
        this.#updateId = requestAnimationFrame(t => this.#update(t))
    }

    static createTimeLevel(pixiApp) {
        return new Level(pixiApp)
    }
}