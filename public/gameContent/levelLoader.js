import * as PIXI from 'pixi.js'
import Game from "./game";
import DrawHandler from './drawHandler';

const createApp = async () => {
    const app = new PIXI.Application();
    await app.init({
        resizeTo: window,
        resolution: devicePixelRatio,
        antialias: true
    });

    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    document.querySelector('body').appendChild(app.canvas);
    return app;
}

export default class LevelLoader {
    #pixiApp;
    game;
    #gameOver = false;

    #renderId = null;
    #updateId = null;
    #lastUpdateTime = performance.now();
    #lastRestartTime = 0;

    async init() {
        this.#pixiApp = await createApp();
        this.#renderId = requestAnimationFrame(t => this.#render)
    }

    onInit = () => {};
    onUpdate = () => {};
    onRender = () => {};
    onLoad = () => {};

    #handleVisibilityChange = () => {
        if (document.hidden) this.kill();
    };

    #handleKeydown = e => {
        if (e.keyCode === 82) this.restart();
        if (e.keyCode === 27) this.leave();
    }

    leave() {
        window.removeEventListener('keydown', this.#handleKeydown)
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        this.game.destroy()
        
        cancelAnimationFrame(this.#updateId)
        cancelAnimationFrame(this.#renderId)

        document.getElementById('timer').textContent = 'MENU';
    }

    restart() {
        this.#lastUpdateTime = performance.now();
        this.#lastRestartTime = performance.now();
        cancelAnimationFrame(this.#updateId);
        
        // TODO //
        this.load()
        //////////

        // this.start();
    }

    load() {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = './levels/level1.js?' + new Date().getTime();
        document.querySelector('body').appendChild(script);
        script.onload = () => {
            this.start();
            this.onLoad();
        }
    }

    start() {
        if (this.game != null) this.game.destroy();
        this.#gameOver = false;
        const game = new Game({
            pixiApp: this.#pixiApp,
            drawHandler: new DrawHandler(),
        })
        this.game = game;

        this.onInit()
        this.game.onDeath = () => {
            this.#onDeath()
        }

        window.addEventListener('keydown', this.#handleKeydown)
        document.addEventListener('visibilitychange', this.#handleVisibilityChange);
        this.#updateId = requestAnimationFrame(t => this.#update(t))
    }

    kill() {
        this.#onDeath()
        this.game.kill()
    }

    #onDeath() {
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        this.#gameOver = true
        cancelAnimationFrame(this.#updateId);
    }

    #update(time) {
        if (this.#gameOver) return
        const frameTime = time - this.#lastUpdateTime;
        this.#lastUpdateTime = time;
        this.onUpdate(frameTime/1000);

        const timer = document.getElementById('timer');
        timer.textContent = Math.floor(time - this.#lastRestartTime)/1000;
        if (this.game) timer.style.color = this.game.getMainColor().getRGBStyle();
        
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    #render(time) {
        const frameTime = time - this.#lastUpdateTime;

        this.onRender(frameTime/1000)
        this.#renderId = requestAnimationFrame(t => this.#render(t))
    }
}