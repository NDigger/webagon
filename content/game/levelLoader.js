import TimeLevel from './timeLevel';
import CompletableLevel from './completableLevel';

import { getLevelStats, writeLevelStats } from '../storage';
import { getConfig } from '../storage';

import { Vector2, Color, Size } from '../utils/structures';
import * as Utils from '../levelsContent/utils';
import initPatterns from '../levelsContent/patterns';

import { getPublicURL } from '../script';

export const loadLevel = async (level, levelPath) => {
    try {
        const res = await fetch(`${getPublicURL()}${levelPath}/script.txt`);
        const script = await res.text();

        const fn = new Function('level', 'Vector2', 'Color', 'Utils', 'Size', 'patterns', `
            "use strict";
            ${script}
        `);

        const boundFn = fn.bind(undefined, level, Vector2, Color, Utils, Size, initPatterns(level));
        boundFn();

        level.init()
    } catch(e) {
        console.error(e)
    }
}

const gameContentElement = document.getElementById('game-content');
const menuElement = document.getElementById('menu');
const progressBarElement = document.getElementById('completable-level-progress-bar');
const gameScoreElement = document.getElementById('game-score');

const gamePulsingMsg = document.getElementById('game-pulsing-msg');

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
        gameScoreElement.style.display = 'none';
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

        const levelStats = getLevelStats(data.key, this.#currentLevelDifficulty);
        levelStats.attempts = levelStats?.attempts ? levelStats.attempts += 1 : 1
        writeLevelStats(data.key, this.#currentLevelDifficulty, levelStats);

        if (this.#level != undefined) this.#level.destroy();

        const levelProps = {
            difficulty: this.#currentLevelDifficulty,
            attempt: this.#attempt,
        }
        const createLevel = () => {
            if (data?.completable) return new CompletableLevel(this.app, this.#currentLevelData, levelProps)
            else return new TimeLevel(this.app, this.#currentLevelData, levelProps);
        }
        const level = createLevel();
        this.#level = level;

        loadLevel(level, data.levelPath);

        requestAnimationFrame(() => {
            window.addEventListener('keydown', this.#handleKeydown);
            window.addEventListener('keyup', this.#handleKeyup)
        })
    }
}