import Level from "./level";
import { getConfig } from "../storage";

import { setBestScore } from "../script";
import { getLevelStats, writeLevelStats } from "../storage";

const gamePulsingMsg = document.getElementById('game-pulsing-msg');
const newPBMessages = [
    'not impressive, at all.',
    'significant improvement!!!',
    'jokes on you.',
    'what could be worse than this...',
    'breathe in, breathe out',
    'new personal damage!',
    'you died!',
    'look at that!',
    'how is it possible?',
    'infinity achieved!',
    'w',
    'another death, another best...',
    'hands are shaking!',
    'boss.',
    'fantastic score! fascinating!',
    'breaking boundaries!',
    'lmao',
    'that best looks cute.',
    'bliss that bee!',
    'how unlucky!',
];

const gameScoreElement = document.getElementById('game-score');
const getRandomNewPBMessage = () => newPBMessages[Math.floor(Math.random() * newPBMessages.length)]

export default class TimeLevel extends Level {
    #config = getConfig();
    #updateId = undefined;

    #levelData;
    #props;
    #isNewBestSaved = false;

    constructor(app, levelData, props) {
        super(app, levelData, props);
        this.#levelData = levelData;
        this.#props = props;
        this.#updateId = requestAnimationFrame(() => this.#update());
    }

    #update() {
        const timerContent = String(Math.floor(this.getTime()*1000)/1000);
        gameScoreElement.textContent = timerContent // this.#config.funModeEnabled ? timerContent.split("").reverse().join("");
        requestAnimationFrame(() => this.#update());
    }

    #getNewBest() { return Math.floor(this.getTime()*1000)/1000; }

    #isNewBest() {
        const levelStats = getLevelStats(this.#levelData.key, this.#props.difficulty);
        const previousBest = levelStats?.best ?? 0;
        return this.#getNewBest() > previousBest
    }

    #saveBest() {
        this.#isNewBestSaved = true
        const levelStats = getLevelStats(this.#levelData.key, this.#props.difficulty);
        const newBest = this.#getNewBest();
        levelStats.best = newBest;
        writeLevelStats(this.#levelData.key, this.#props.difficulty, levelStats)

        setBestScore(newBest, this.#levelData?.completable);
    }

    kill() {
        super.kill();

        if (this.#isNewBest() && !this.#config.invincibleModeEnabled) {
            gamePulsingMsg.style.display = 'block';
            gamePulsingMsg.textContent = this.#config.funModeEnabled ? getRandomNewPBMessage() : 'new personal best'
            this.#saveBest();
        }
    }

    destroy() {
        super.destroy();
        if (this.#isNewBest() && !this.#isNewBestSaved && !this.#config.invincibleModeEnabled) this.#saveBest();
        cancelAnimationFrame(this.#updateId);
    }
}