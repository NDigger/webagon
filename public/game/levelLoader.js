import TimeLevel from './timeLevel';
import CompletableLevel from './completableLevel';

import { setLevel } from '../script';
import { getLevelStats, writeLevelStats } from '../storage';
import { getConfig } from '../storage';

const gameContentElement = document.getElementById('game-content');
const menuElement = document.getElementById('menu');
const gameUIElement = document.getElementById('game-ui');
const progressBarElement = document.getElementById('completable-level-progress-bar');

const fpsCounterElement = document.getElementById('fps-counter');
const restartHelpMsg = document.getElementById('restart-help-msg');
const swapEnabledMsg = document.getElementById('swap-enabled-msg');
const gamePulsingMsg = document.getElementById('game-pulsing-msg');
const gamemodeMsg = document.getElementById('gamemode-msg');
const gameMessage = document.getElementById('game-message');
const mobileButtons = document.querySelector('#game-ui .top-right');
const difficultyMsg = document.getElementById('difficulty-msg');

const levelRestartBtn = document.getElementById('level-restart-btn');
const levelLeaveBtn = document.getElementById('level-leave-btn');

export default class LevelLoader {
    app;
    #level = null;
    
    #currentLevelData;
    #currentLevelDifficulty;
    #attempt = 1;

    #keyPressed = false;

    onLeave = () => {}

    constructor(app) {
        this.app = app

        levelRestartBtn.addEventListener('click', () => this.reload())
        levelLeaveBtn.addEventListener('click', () => this.leave())
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

        gamePulsingMsg.style.display = 'none'
        gameContentElement.style.display = 'none';
        menuElement.style.display = 'flex';

        progressBarElement.style.display = 'none';
    }

    start(data, difficulty) {
        this.#attempt = 1;
        this.#currentLevelDifficulty = difficulty;
        this.#load(data)
    }

    reload() {
        this.#attempt += 1;
        this.#load(this.#currentLevelData);
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
            difficulty: this.#currentLevelDifficulty,
            attempt: this.#attempt,
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
            gameUIElement.style.display = config.displayUiEnabled ? 'block' : 'none'
            
            mobileButtons.style.display = 'none';
            gameMessage.textContent = '';
            restartHelpMsg.style.display = 'none';
            swapEnabledMsg.style.display = 'none';
            gamemodeMsg.textContent = config.invincibleModeEnabled ? 'invincible mode' : 'official mode'
            difficultyMsg.textContent = `Difficulty: ${levelProps.difficulty}`
            gamePulsingMsg.style.display = 'none';            
            fpsCounterElement.style.display = config.displayFpsEnabled ? 'block' : 'none';

            this.#level.init()
            gameContentElement.style.display = 'block'
            menuElement.style.display = 'none'
            
            window.addEventListener('keydown', this.#handleKeydown);
            window.addEventListener('keyup', this.#handleKeyup)
            // this.level.onLoad();
            
        }
    }
}