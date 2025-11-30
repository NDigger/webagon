import Level from "./level";
import { getConfig } from "../storage";
import { setBestScore } from "../script";
import { getLevelStats, writeLevelStats } from "../storage";

const gamePulsingMsg = document.getElementById('game-pulsing-msg');
const progressBarElement = document.getElementById('completable-level-progress-bar');
const progressElement = document.getElementById('completable-level-progress');
const gameScoreElement = document.getElementById('game-score');

export default class CompletableLevel extends Level {
    #completionTime = 60;
    #updateId = undefined;
    #completed = false;

    #config = getConfig();

    #levelData = undefined;
    #props = undefined;
    #isNewBestSaved = false;

    constructor(app, levelData, props) {
        super(app, levelData, props);

        this.#levelData = levelData;
        this.#props = props;

        this.#updateId = requestAnimationFrame(() => this.#update());
        progressBarElement.style.display = 'block'
    }

    #getScore() { 
        const progress = 1-(this.#completionTime - this.getTime())/this.#completionTime;
        const fixed = Math.floor(progress*10000)/10000;
        return Math.min(fixed, 1);
    }

    #isNewBest() {
        const levelStats = getLevelStats(this.#levelData.key, this.#props.difficulty);
        const previousBest = levelStats?.best ?? 0;
        return this.#getScore() > previousBest
    }

    #saveBest() {
        this.#isNewBestSaved = true
        const levelStats = getLevelStats(this.#levelData.key, this.#props.difficulty);
        const newBest = this.#getScore();
        levelStats.best = newBest;
        writeLevelStats(this.#levelData.key, this.#props.difficulty, levelStats)

        setBestScore(newBest, this.#levelData?.completable)
    }

    #update() {
        const progress = this.#getScore();
        progressElement.style.width = `${progress*100}%`
        if (progress >= 1 && !this.#completed) {
            this.#completed = true;
            this.kill();
        }
        const percent = Math.floor(progress*10000)/100;
        gameScoreElement.textContent = `%${percent}`;

        this.#updateId = requestAnimationFrame(() => this.#update());
    }

    kill() {
        super.kill();

        if (this.#isNewBest() && !this.#config.invincibleModeEnabled) {
            gamePulsingMsg.style.display = 'block';
            if (this.#getScore() >= 1) {
                gamePulsingMsg.textContent = 'level completed!'
            } else {
                gamePulsingMsg.textContent = this.#config.funModeEnabled ? getRandomNewPBMessage() : 'new personal best'
            }
            this.#saveBest();
        }
    }

    setCompletionTime(v) {
        this.#completionTime = v;
    }

    destroy() {
        super.destroy();
        if (this.#isNewBest() && !this.#isNewBestSaved && !this.#config.invincibleModeEnabled) this.#saveBest();
        cancelAnimationFrame(this.#updateId);
    }

    getCompletionTime() { return this.#completionTime }
}