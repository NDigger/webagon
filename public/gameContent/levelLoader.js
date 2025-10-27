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

    window.addEventListener('resize', () => {
        app.resolution = devicePixelRatio,
        app.resizeTo = window
    })

    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    app.canvas.id = 'game'
    document.querySelector('body').appendChild(app.canvas);
    return app;
}

export default class LevelLoader {
    #pixiApp;
    game;
    #gameOver = false;
    #gameDestroyed = false;
    
    #currentLevelPath

    #renderId = null;
    #updateId = null;
    #lastUpdateTime = performance.now();
    #lastRenderTime = performance.now();

    #loadTime = 0;

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
        if (e.keyCode === 82) this.reload();
        if (e.keyCode === 27) this.leave();
    }

    leave() {
        window.removeEventListener('keydown', this.#handleKeydown)
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        this.game.destroy()
        this.#gameDestroyed = true;
        
        cancelAnimationFrame(this.#updateId)
        cancelAnimationFrame(this.#renderId)

        document.getElementById('timer').style.display = 'none';
        document.getElementById('game').style.display = 'none';
        
        document.getElementById('level-select').style.display = 'flex';
    }

    reload() {
        this.#lastUpdateTime = performance.now();
        cancelAnimationFrame(this.#updateId);
        this.load(this.#currentLevelPath);
        // this.start();
    }

    load(path) {
        this.#currentLevelPath = path;
        const script = document.createElement('script');
        script.type = 'module';
        script.src = `${path}?${new Date().getTime()}`
        document.querySelector('body').appendChild(script);
        script.onload = () => {
            this.start();
            this.onLoad();
        }
    }

    start() {
        if (!this.#gameDestroyed && this.game) this.game.destroy();
        this.#gameOver = false;
        this.#gameDestroyed = false;
        const game = new Game({
            pixiApp: this.#pixiApp,
            drawHandler: new DrawHandler(),
        })
        this.game = game;
        this.#lastUpdateTime = performance.now();
        this.#lastRenderTime = performance.now();
        this.#loadTime = performance.now()

        this.onInit()
        this.game.onDeath = () => {
            this.#onDeath()
        }

        document.getElementById('game').style.display = 'block'
        document.getElementById('timer').style.display = 'block';
        window.addEventListener('keydown', this.#handleKeydown);
        document.addEventListener('visibilitychange', this.#handleVisibilityChange);
        this.#updateId = requestAnimationFrame(t => this.#update(t))
        cancelAnimationFrame(this.#renderId);
        this.#renderId = requestAnimationFrame(t => this.#render(t))
    }

    kill() {
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
        timer.textContent = Math.floor(time - this.#loadTime)/1000;
        if (this.game) timer.style.color = this.game.getMainColor().getRGBStyle();
        
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    #render(time) {
        const frameTime = time - this.#lastRenderTime;
        this.#lastRenderTime = time;
        this.onRender(frameTime/1000)
        this.#renderId = requestAnimationFrame(t => this.#render(t))
    }
}