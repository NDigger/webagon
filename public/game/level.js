import Game from "./game";
import { Color } from "../utils/structures";
import Lerp from "../utils/interpolation";
import CustomWall from "./gameContent/customWall";
import { getConfig } from "../storage";
import { getLevelStats, writeLevelStats } from "../storage";
import { sounds } from "../script";

const gameMessage = document.getElementById('game-message');

export default class Level extends Game { 
    onInit = () => {};
    onUpdate = () => {};
    onRender = () => {};
    onStep = async () => {};
    onIncrement = () => {};
    onPreIncrement = () => {};

    #fontColor = undefined;
    #config = getConfig();

    #initialized = false;
    #levelInitTime = performance.now();

    #timeouts = [];
    #intervals = [];

    #gameOver = false;
    #renderId = null;
    #updateId = null;
    #lastUpdateTime = performance.now();
    #lastRenderTime = performance.now();
    _levelTime = 0;

    #audio;
    #levelData;
    #audioTimestamp;

    #rotationSpeedMax = Number.MAX_SAFE_INTEGER;
    #wallSpeedMax = Number.MAX_SAFE_INTEGER;

    #incrementTime = 15;
    #incrementTimer = 0;
    #isIncrementing = false;
    #rotationSpeedIncrement = 0;
    #wallSpeedIncrement = 0;

    #incrementSpinPower = 0;

    #messageHideTime = 0;

    #props = {
        difficulty: 1,
    }

    #games = [];
    #cws = [];

    constructor(app, levelData, props) {
        super(app)
        this.#props = props
        this.#levelData = levelData

        this.setBackgroundSwapTime(1);
    }
    
    init() {
        if (this.#initialized) return;
        const audio = new Audio(this.#levelData.musicPath);
        audio.volume = this.#config.musicVolume;
        audio.loop = true;
        audio.oncanplay = () => {
            this.#audio = audio;
        }
        const musicTimestamps = this.#levelData.musicTimestamps
        const timestamp = musicTimestamps[this.#props.attempt === 1 ? 0 : Math.floor(Math.random() * musicTimestamps.length)] ?? 0
        this.#audioTimestamp = timestamp;
        audio.currentTime = timestamp
        audio.play();

        this.setShakePower(0);
        
        this.onInit();
        this.#step();

        this.#updateId = requestAnimationFrame(t => this.#update(t));
        this.#renderId = requestAnimationFrame(t => this.#render(t));
        document.addEventListener('visibilitychange', this.#handleVisibilityChange);

        this.#initialized = true;
    }
    
    async #step() {
        if (typeof this.onStep !== 'function' || this.onStep.toString() === 'async () => {}') return;

        while (true && !this.died && !this.#isIncrementing) { // && !this.#isIncrementing
            await this.onStep();
        }
    }

    #preIncrement() {
        this.#incrementTimer = 0;
        this.#isIncrementing = true;
        const inc = this.getRotationSpeed() >= 0 ? this.#rotationSpeedIncrement : -this.#rotationSpeedIncrement
        const newRotation = (this.getRotationSpeed() + inc)*-1;
        const cappedRotation = newRotation >= 0 ? Math.min(newRotation, this.#rotationSpeedMax) : Math.max(newRotation, -this.#rotationSpeedMax);
        if (this.#incrementSpinPower !== 0) {
            const rotationSpeedLerp = new Lerp(v => this.setRotationSpeed(v));
            rotationSpeedLerp.apply(cappedRotation > 0 ? cappedRotation + this.#incrementSpinPower : cappedRotation - this.#incrementSpinPower)
            rotationSpeedLerp.run(cappedRotation, .5)
        } else {
            this.setRotationSpeed(cappedRotation);
        }

        sounds.increment.play();
        this.onPreIncrement();
    }

    callIncrement() {
        this.#preIncrement();
    }

    #increment() {
        this.#isIncrementing = false;
        this.setWallSpeedMult(Math.min(this.getWallSpeedMult() + this.#wallSpeedIncrement, this.#wallSpeedMax));
        this.onIncrement();
        this.#step();
    }

    #handleVisibilityChange = () => document.hidden && this.kill()

    #update(time) {
        if (this.#gameOver) return
        const frameTime = time - this.#lastUpdateTime;
        this._levelTime = (time - this.#levelInitTime)/1000;

        this.#lastUpdateTime = time;
        this.onUpdate(frameTime/1000);

        this.#messageHideTime -= frameTime/1000;
        if (this.#messageHideTime <= -0.01) gameMessage.textContent = ''
        
        this.#incrementTimer += frameTime/1000;
        if (this.#incrementTimer > this.#incrementTime) {
            this.callIncrement();
        }
        if (this.#isIncrementing && this.getWallCount() === 0) this.#increment();
        
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    #render(time) {
        const frameTime = time - this.#lastRenderTime;
        this.#lastRenderTime = time;

        this.#cws.forEach(cw => {
            cw.setSkew(this.getSkew());
            cw.set3dLayersCount(this.get3dLayersCount());
            cw.set3dDistance(this.get3dDistance());
            cw.setRotation(this.getRotation());
            cw.set3dColor(this.get3dColor());
            if (this.get3dFalloffColor()) cw.set3dFalloffColor()
            else cw.clear3dFalloffColor();
        })

        this.onRender(frameTime/1000)
        this.#renderId = requestAnimationFrame(t => this.#render(t))
    }
    destroy() {
        this.#games.forEach(game => game.destroy());
        this.#cws.forEach(cw => cw.destroy());
        super.destroy();

        this.clearIntervals();
        this.clearEvents();

        sounds.death.stop();
        sounds.increment.stop();
        sounds.swap.stop();
        
        cancelAnimationFrame(this.#updateId)
        cancelAnimationFrame(this.#renderId)
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        if (this.#audio) this.#audio.pause()
    }
    
    setBackgroundSwapTime(v) {
        if (!this.#initialized) super.setBackgroundSwapTime(v / this.#props.difficulty);
        else super.setBackgroundSwapTime(v);
    }
    setWallSpeedMult(v) {
        if (!this.#initialized) super.setWallSpeedMult(v * this.#props.difficulty);
        else super.setWallSpeedMult(v);
    }
    setRotationSpeed(v) {
        if (!this.#initialized) super.setRotationSpeed(v * this.#props.difficulty);
        else super.setRotationSpeed(v);
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
    setIncrementSpinPower(v) {
        if (typeof(v) !== 'number') return
        this.#incrementSpinPower = v
    }
    getIncrementSpinPower() { return this.#incrementSpinPower }

    kill() {
        if (this.#config.invincibleModeEnabled) return
        
        super.kill()
        this.#games.forEach(game => game.kill())
        
        this.clearIntervals();
        this.clearEvents();

        document.querySelector('#game-ui .top-right').style.display = 'block'

        document.getElementById('restart-help-msg').style.display = 'block'
        if (this.#audio) this.#audio.pause()
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        this.#gameOver = true
        cancelAnimationFrame(this.#updateId);

        this.setShakePower(10);
        new Lerp(v => {
            this.setShakePower(v);
            if (!this.isDestroyed()) super.draw()
        }).apply(30).run(0, 0.35);

        new Lerp(v => this.setRotation(v)).apply(this.getRotation()).run(this.getRotation() + this.getRotationSpeed() * 400, 1.5, Lerp.Easing.EASE_OUT);

        if (this.#config.flashOnDeathEnabled) {
            const flashLerp = new Lerp(v => document.getElementById('override-flash-effect').style.backgroundColor = v.getRGBAStyle());
            flashLerp.apply(new Color(255, 255, 255, .6))
            flashLerp.run(new Color(255, 255, 255, 0), 1)
        }

        const levelStats = getLevelStats(this.#levelData.key, this.#props.difficulty);
        const newTotalTime = (levelStats.totalTime ?? 0) + this._levelTime;
        levelStats.totalTime = Math.floor(newTotalTime * 1000)/1000;
        writeLevelStats(this.#levelData.key, this.#props.difficulty, levelStats);
    }

    setBackgroundTileColors(arr) {
        super.setBackgroundTileColors(arr);
        const color0 = new Color(arr[0].r, arr[0].g, arr[0].b, arr[0].a);
        document.documentElement.style.setProperty('--background-tile-color', color0.getRGBAStyle());
    }
    #updateDocumentMainColor() {
        document.documentElement.style.setProperty('--main-color', this.#fontColor ? this.#fontColor.getRGBAStyle() : this.getMainColor().getRGBAStyle());
    }
    setFontColor({r, g, b, a}) {
        const v = new Color(r, g, b, a)
        this.#fontColor = v;
        this.#updateDocumentMainColor();
    }
    clearFontColor() {
        this.#fontColor = undefined;
        this.#updateDocumentMainColor();
    }
    setMainColor({r, g, b, a}) {
        const v = new Color(r, g, b, a);
        super.setMainColor(v);
        this.#updateDocumentMainColor();
    }
    setSwapEnabled(v) {
        super.setSwapEnabled(v);
        document.getElementById('swap-enabled-msg').style.display = v ? 'block' : 'none';
    }

    setRotationSpeedMax(v) {
        if (typeof(v) !== 'number') return
        this.#rotationSpeedMax = v
    }
    getRotationSpeedMax() { return this.#rotationSpeedMax }
    setWallSpeedMax(v) {
        if (typeof(v) !== 'number') return
        this.#wallSpeedMax = v
    }
    getWallSpeedMax() { return this.#wallSpeedMax }

    getTime() {
        return this._levelTime
    }
    getDifficultyMult() {
        return this.#props.difficulty
    }
    getTimestamp() {
        return this.#audioTimestamp
    }

    createEvent(timeSeconds, event) {
        const time = (timeSeconds-this._levelTime)*1000;
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
    showMessage(text, time) {
        gameMessage.textContent = text;
        this.#messageHideTime = time;
    }
    getAttempt() { return this.#props.attempt }

    createGame() {
        const game = new Game(app);
        game.setWallSpeedMult(this.getWallSpeedMult());
        game.setWallSpawnDistance(this.getWallSpawnDistance());
        game.setRotationSpeed(this.getRotationSpeed());
        game.setRotation(this.getRotation());
        game.set3dColor(this.get3dColor());
        game.set3dDepth(this.get3dDepth());
        game.set3dDistance(this.get3dDistance());
        if (this.get3dFalloffColor()) game.set3dFalloffColor(this.get3dFalloffColor());
        game.setBackgroundRadius(this.getBackgroundRadius());
        game.setBackgroundRotationOffset(this.getBackgroundRotationOffset());
        game.setBackgroundSwapTime(this.getBackgroundSwapTime());
        game.setBackgroundTileColors(this.getBackgroundTileColors());
        game.setCenterOffset(this.getCenterOffset());
        game.setLayer(this.getLayer());
        game.setMainColor(this.getMainColor());
        game.setOffset(this.getOffset());
        game.setPlayerDistanceMult(this.getPlayerDistanceMult());
        game.setPlayerRotationOffset(this.getPlayerRotationOffset());
        game.setPlayerSize(this.getPlayerSize());
        game.setPolygonColor(this.getPolygonColor());
        game.setRadius(this.getRadius());
        game.setScale(this.getScale());
        game.setSides(this.getSides());
        game.setSkew(this.getSkew());
        game.setSwapEnabled(this.getSwapEnabled());
        this.#games.push(game);
        return game;
    }

    createCustomWall() {
        const cw = new CustomWall(app);
        cw.setLayer(this.getLayer() + 0.002)
        this.#cws.push(cw);
        return cw;
    }
}