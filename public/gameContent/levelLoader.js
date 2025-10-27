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
    document.querySelector('body').appendChild(app.canvas);
    return app;
}

export default class LevelLoader {
    #pixiApp;
    level;
    #levelDestroyed = false;
    
    #currentLevelPath

    async init() {
        this.#pixiApp = await createApp();
    }

    #handleKeydown = e => {
        if (e.keyCode === 82) this.reload();
        if (e.keyCode === 27) this.leave();
    }

    leave() {
        window.removeEventListener('keydown', this.#handleKeydown)
        this.level.destroy()
        this.#levelDestroyed = true;

        document.getElementById('timer').style.display = 'none';
        document.getElementById('game').style.display = 'none';
        
        document.getElementById('level-select').style.display = 'flex';
    }

    reload() {
        this.load(this.#currentLevelPath);
    }

    load(path) {
        this.#currentLevelPath = path;
        const script = document.createElement('script');
        script.type = 'module';
        script.src = `${path}?${new Date().getTime()}`
        document.querySelector('body').appendChild(script);

        if (!this.#levelDestroyed && this.level) this.level.destroy();
        this.#levelDestroyed = false;

        const level = new Level(this.#pixiApp);
        setLevel(level);
        this.level = level;

        script.onload = () => {
            this.start();
            this.level.onLoad();
        }
    }

    start() {
        this.level.init()
        document.getElementById('game').style.display = 'block'
        document.getElementById('timer').style.display = 'block';
        window.addEventListener('keydown', this.#handleKeydown);
    }
}