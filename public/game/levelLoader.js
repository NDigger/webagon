import Level from './level';
import { setLevel } from '../script';

export default class LevelLoader {
    app;
    #level = null;
    
    #currentLevelData
    #attempt = 0;

    #keyPressed = false;

    onLeave = () => {}

    constructor(app) {
        this.app = app
    }

    #handleKeyup = () => this.#keyPressed = false
    #handleKeydown = e => {
        if (this.#keyPressed) return
        if (e.code === 'Enter' || e.code === 'ArrowUp' || e.code === 'KeyR') this.reload();
        if (e.code === 'Escape') this.leave();
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

    start(data) {
        this.#attempt = 1;
        this.#load(data)
    }

    reload() {
        const savedAttempt = this.#attempt;
        this.#load(this.#currentLevelData);
        this.#attempt = savedAttempt + 1;
    }

    #load(data) {
        this.#currentLevelData = data;
        const script = document.createElement('script');
        script.type = 'module';
        script.src = `${data.scriptPath}?${new Date().getTime()}`
        document.querySelector('body').appendChild(script);

        if (this.#level != null) {
            this.#level.destroy();
        }

        const level = new Level(this.app, this.#currentLevelData, {
            selectFirstMusicTimestamp: this.#attempt === 1,
        });
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