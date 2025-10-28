import Level from './level';
import { setLevel } from '../script';

export default class LevelLoader {
    #pixiApp;
    #level = null;
    
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
        this.#level = null;

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

        if (this.#level != null) {
            this.#level.destroy();
        }

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
}