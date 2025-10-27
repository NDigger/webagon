import DrawHandler from "./drawHandler";
import Game from "./game";
import { Color } from "../utils/structures";

export default class Level extends Game { 
    onInit = () => {};
    onUpdate = () => {};
    onRender = () => {};
    // onLoad = () => {};
    onStep = async () => {};

    #levelInitTime = performance.now();

    #timeouts = [];
    #intervals = [];

    #gameOver = false;
    #renderId = null;
    #updateId = null;
    #lastUpdateTime = performance.now();
    #lastRenderTime = performance.now();

    #audio;
    #currentLevelData;

    constructor(pixiApp, currentLevelData) {
        super({
            pixiApp: pixiApp,
            drawHandler: new DrawHandler(),
        })
        this.setBackgroundTileColors([Color.BLACK()]);
        this.#currentLevelData = currentLevelData
    }
    
    init() {
        const audio = new Audio(this.#currentLevelData.musicPath);
        audio.oncanplay = () => {
            this.#audio = audio;
        }
        const musicTimestamps = this.#currentLevelData.musicTimestamps
        audio.currentTime = musicTimestamps[Math.floor(Math.random() * musicTimestamps.length)] ?? 0
        audio.play();

        this.onInit();
        this.#step();

        this.#updateId = requestAnimationFrame(t => this.#update(t));
        this.#renderId = requestAnimationFrame(t => this.#render(t));
        document.addEventListener('visibilitychange', this.#handleVisibilityChange);

        this.onDeath = () => this.#onDeath()
    }
    
    async #step() {
        if (typeof this.onStep !== 'function' || this.onStep.toString() === 'async () => {}') return;

        while (true && !this.died) { // && !this.#isIncrementing
            await this.onStep();
        }
    }

    #handleVisibilityChange = () => document.hidden && this.kill()

    #update(time) {
        if (this.#gameOver) return
        const frameTime = time - this.#lastUpdateTime;
        const levelTime = time - this.#levelInitTime;
        this.#lastUpdateTime = time;
        this.onUpdate(frameTime/1000);

        const timer = document.getElementById('timer');
        timer.textContent = Math.floor(levelTime)/1000;
        const gameUi = document.getElementById('game-ui')
        gameUi.style.color = this.getMainColor().getRGBStyle();
        
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    #render(time) {
        const frameTime = time - this.#lastRenderTime;
        this.#lastRenderTime = time;
        this.onRender(frameTime/1000)
        this.#renderId = requestAnimationFrame(t => this.#render(t))
    }

    destroy() {
        super.destroy();
        cancelAnimationFrame(this.#updateId)
        cancelAnimationFrame(this.#renderId)
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        if (this.#audio) this.#audio.pause()
    }

    #onDeath() {
        document.getElementById('restart-help-msg').style.display = 'block'
        if (this.#audio) this.#audio.pause()
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        this.#gameOver = true
        cancelAnimationFrame(this.#updateId);
    }

    createEvent(event, timeSeconds) {
        const time = timeSeconds*1000;
        const timeout = setTimeout(() => event(), time);
        this.#timeouts.push(timeout);
        return timeout;
    }
    clearEvents() {
        this.#timeouts.forEach(timeout => clearTimeout(timeout));
        this.#timeouts = []
    }
    createInterval(event, timeSeconds) {
        const time = timeSeconds*1000;
        const interval = setInterval(() => event(), time);
        this.#intervals.push(interval);
        return interval;
    }
    clearIntervals() {
        this.#intervals.forEach(interval => clearInterval(interval));
        this.#intervals = []
    }
}