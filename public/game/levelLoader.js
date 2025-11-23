import TimeLevel from './timeLevel';
import CompletableLevel from './completableLevel';

import { setLevel } from '../script';
import { getLevelStats, writeLevelStats } from '../storage';
import { getConfig } from '../storage';

const timerElement = document.getElementById('timer');

export default class LevelLoader {
    app;
    #level = null;
    
    #currentLevelData;
    #currentLevelDifficulty;
    #attempt = 0;

    #keyPressed = false;

    onLeave = () => {}

    constructor(app) {
        this.app = app

        document.getElementById('level-restart-btn').addEventListener('click', () => this.reload())
        document.getElementById('level-leave-btn').addEventListener('click', () => this.leave())
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
        timerElement.style.display = 'none';
    }

    start(data, difficulty) {
        this.#attempt = 1;
        this.#currentLevelDifficulty = difficulty;
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

        const levelStats = getLevelStats(data.key, this.#currentLevelDifficulty);
        levelStats.attempts = levelStats?.attempts ? levelStats.attempts += 1 : 1
        writeLevelStats(data.key, this.#currentLevelDifficulty, levelStats);

        if (this.#level != null) this.#level.destroy();

        const levelProps = {
            selectFirstMusicTimestamp: this.#attempt === 1,
            difficulty: this.#currentLevelDifficulty,
        }
        const createLevel = () => {
            if (data?.completable) return new CompletableLevel(this.app, this.#currentLevelData, levelProps)
            else return new TimeLevel(this.app, this.#currentLevelData, levelProps);
        }
        const level = createLevel();
        setLevel(level);
        this.#level = level;

        const config = getConfig();
        script.onload = () => {
            document.getElementById('game-ui').style.display = config.displayUiEnabled ? 'block' : 'none'
            document.querySelector('#game-ui .top-right').style.display = 'none'

            document.getElementById('restart-help-msg').style.display = 'none';
            document.getElementById('swap-enabled-msg').style.display = 'none';

            document.getElementById('fps-counter').style.display = config.displayFpsEnabled ? 'block' : 'none';

            this.#level.init()
            document.getElementById('game-content').style.display = 'block'
            document.getElementById('level-select').style.display = 'none'
            
            window.addEventListener('keydown', this.#handleKeydown);
            window.addEventListener('keyup', this.#handleKeyup)
            // this.level.onLoad();
        }
    }
}