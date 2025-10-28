import DrawHandler from "./gameContent/drawHandler";
import Game from "./game";
import { Color } from "../utils/structures";
import Lerp from "../utils/interpolation";

export default class Level extends Game { 
    onInit = () => {};
    onUpdate = () => {};
    onRender = () => {};
    // onLoad = () => {};
    onStep = async () => {};
    onIncrement = () => {};
    onPreIncrement = () => {};

    #destroyed = false;
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

    #incrementTime = 15;
    #incrementTimer = 0;
    #isIncrementing = false;
    #rotationSpeedIncrement = 0;
    #wallSpeedIncrement = 0;

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
    }
    
    async #step() {
        if (typeof this.onStep !== 'function' || this.onStep.toString() === 'async () => {}') return;

        while (true && !this.died && !this.#isIncrementing) { // && !this.#isIncrementing
            await this.onStep();
        }
    }

    #preIncrement() {
        this.#incrementTimer = 0;
        this.onPreIncrement();
        this.#isIncrementing = true;
        const inc = this.getRotationSpeed() >= 0 ? this.#rotationSpeedIncrement : -this.#rotationSpeedIncrement
        this.setRotationSpeed((this.getRotationSpeed() + inc)*-1);
    }
    #increment() {
        this.#isIncrementing = false;
        this.setWallSpeedMult(this.getWallSpeedMult() + this.#wallSpeedIncrement);
        this.#step();
        this.onIncrement();
    }

    #handleVisibilityChange = () => document.hidden && this.kill()

    #update(time) {
        if (this.#gameOver) return
        const frameTime = time - this.#lastUpdateTime;
        const levelTime = time - this.#levelInitTime;
        this.#lastUpdateTime = time;
        this.onUpdate(frameTime/1000);
        
        this.#incrementTimer += frameTime/1000;
        if (this.#incrementTimer > this.#incrementTime) {
            this.#preIncrement();
        }
        if (this.#isIncrementing && this.getWallCount() === 0) this.#increment();

        const timer = document.getElementById('timer');
        timer.textContent = Math.floor(levelTime)/1000;
        
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }
    #render(time) {
        const frameTime = time - this.#lastRenderTime;
        this.#lastRenderTime = time;
        this.onRender(frameTime/1000)
        this.#renderId = requestAnimationFrame(t => this.#render(t))
    }
    destroy() {
        this.#destroyed = true;
        super.destroy();
        cancelAnimationFrame(this.#updateId)
        cancelAnimationFrame(this.#renderId)
        this.clearIntervals();
        this.clearEvents();
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

    setShakePower(v) {
        if (typeof(v) !== 'number') return
        globalThis.shakePower = v;
    }
    getShakePower() { return globalThis.shakePower }
    setIncrementTime(v) {
        if (typeof(v) !== 'number') return
        this.#incrementTime = v;
    }
    getIncrementTime() { return this.#incrementTime }
    setWallSpeedIncrement(v) {
        if (typeof(v) !== 'number') return
        this.#wallSpeedIncrement = v;
    } 
    getWallSpeedIncrement() { return this.#wallSpeedIncrement }
    setRotationSpeedIncrement(v) {
        if (typeof(v) !== 'number') return
        this.#rotationSpeedIncrement = v;
    }
    getRotationSpeedIncrement() { return this.#rotationSpeedIncrement }

    kill() {
        super.kill()
        this.setShakePower(10);
        new Lerp(v => {
            this.setShakePower(v);
            if (!this.#destroyed) super.draw()
        }).apply(30).run(0, 0.35);
        this.#onDeath()
    }
    setMainColor({r, g, b, a}) {
        super.setMainColor({r: r, g: g, b: b, a: a})
        const gameUi = document.getElementById('game-ui')
        gameUi.style.color = this.getMainColor().getRGBStyle();
    }
    setSwapEnabled(v) {
        super.setSwapEnabled(v);
        document.getElementById('swap-enabled-msg').style.display = v ? 'block' : 'none';
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