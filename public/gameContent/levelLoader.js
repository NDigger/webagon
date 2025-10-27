import * as PIXI from 'pixi.js'
import Level from './level';
import { setLevel } from '../script';

const createApp = async () => {
    const app = new PIXI.Application();
    await app.init({
        resizeTo: window,
        resolution: devicePixelRatio,
        antialias: true
    });

    window.addEventListener('resize', () => {
        app.renderer.resolution = devicePixelRatio;
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });
    app.stage.sortableChildren = true;
    app.stage.sortChildren();
    app.canvas.id = 'game'
    document.getElementById('game-content').appendChild(app.canvas);
    return app;
}

export default class LevelLoader {
    #pixiApp;
    level;
    #levelDestroyed = false;
    #currentLevelData
    #attempt = 0;

    #keyPressed = false;

    async init() {
        this.#pixiApp = await createApp();
    }

    #handleKeyup = () => this.#keyPressed = false
    #handleKeydown = e => {
        if (this.#keyPressed) return
        if (e.key === 'r' || e.key === 'ArrowUp') this.reload();
        if (e.key === 'Escape') this.leave();
        this.#keyPressed = true;
    }

    leave() {
        window.removeEventListener('keyup', this.#handleKeyup);
        window.removeEventListener('keydown', this.#handleKeydown);
        this.level.destroy()
        this.#levelDestroyed = true;

        document.getElementById('game-content').style.display = 'none';
        document.getElementById('level-select').style.display = 'flex';
    }

    reload() {
        this.load(this.#currentLevelData);
    }

    load(data) {
        this.#attempt = 0;
        this.#currentLevelData = data;
        const script = document.createElement('script');
        script.type = 'module';
        script.src = `${data.scriptPath}?${new Date().getTime()}`
        document.querySelector('body').appendChild(script);

        if (!this.#levelDestroyed && this.level) this.level.destroy();
        this.#levelDestroyed = false;

        const level = new Level(this.#pixiApp, this.#currentLevelData);
        setLevel(level);
        this.level = level;

        script.onload = () => {
            document.getElementById('restart-help-msg').style.display = 'none'
            document.getElementById('swap-enabled-msg').style.display = 'none'
            this.level.init()
            document.getElementById('game-content').style.display = 'block'
            document.getElementById('level-select').style.display = 'none'
            window.addEventListener('keydown', this.#handleKeydown);
            window.addEventListener('keyup', this.#handleKeyup)
            // this.level.onLoad();
        }
    }
}