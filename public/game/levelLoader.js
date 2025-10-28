import * as PIXI from 'pixi.js'
import Level from './level';
import { setLevel } from '../script';
import LevelPreview from './levelPreview';

export default class LevelLoader {
    #pixiApp;
    #level;
    #levelPreview;
    
    #levelDestroyed = false;
    #currentLevelData
    #attempt = 0;

    #keyPressed = false;

    onLeave = () => {}

    constructor(pixiApp) {
        this.#pixiApp = pixiApp
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
        this.#level.destroy()
        this.#levelDestroyed = true;

        this.onLeave();

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

        if (!this.#levelDestroyed && this.#level) this.#level.destroy();
        this.#levelDestroyed = false;

        const level = new Level(this.#pixiApp, this.#currentLevelData);
        setLevel(level);
        this.#level = level;

        script.onload = () => {
            document.getElementById('restart-help-msg').style.display = 'none'
            document.getElementById('swap-enabled-msg').style.display = 'none'
            this.#level.init()
            document.getElementById('game-content').style.display = 'block'
            document.getElementById('level-select').style.display = 'none'
            window.addEventListener('keydown', this.#handleKeydown);
            window.addEventListener('keyup', this.#handleKeyup)
            // this.level.onLoad();
        }
    }

    preview(path) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = `${path}?${new Date().getTime()}`
        document.querySelector('body').appendChild(script);

        const levelPreview = new Proxy(new LevelPreview(), {
            // get(target, prop) {
            //     if (
            //        prop === 'setMainColor' 
            //     || prop === 'setSides'
            //     || prop === 'init'
            //     || prop === 'onInit'
            //     || prop === 'update'
            //     || prop === 'onUpdate'
            //         ) {
            //         return target[prop];
            //     }
            //     return () => {};
            // }
            get(target, prop) {
                if (prop in target) {
                    const value = target[prop];
                    if (typeof value === "function") return (...args) => value.apply(target, args);
                    return value;
                }
                return () => {};
            },
            set(target, prop, value) {
                if (prop in target) target[prop] = value;
                return true;
            }
        });
        setLevel(levelPreview)

        script.onload = () => {
            levelPreview.init()
        }
    }
}