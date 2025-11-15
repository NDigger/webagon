import Game from "./game";
import { Color } from "../utils/structures";
import Lerp from "../utils/interpolation";
import { setBestScore } from "../script";
import CustomWall from "./gameContent/customWall";
import { getConfig } from "../storage";

import { getLevelStats, writeLevelStats } from "../storage";

const newPersonalBestMessage = document.getElementById('game-new-personal-best-msg');
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

const getRandomNewPBMessage = () => newPBMessages[Math.floor(Math.random() * newPBMessages.length)]

export default class Level extends Game { 
    onInit = () => {};
    onUpdate = () => {};
    onRender = () => {};
    // onLoad = () => {};
    onStep = async () => {};
    onIncrement = () => {};
    onPreIncrement = () => {};

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
    #levelTime = 0;

    #isNewBestSaved = false;

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

    #props = {
        selectFirstMusicTimestamp: false,
        difficulty: 1,
    }

    #games = [];
    #cws = [];

    constructor(app, levelData, props) {
        super(app)
        this.#props = props
        this.setBackgroundTileColors([Color.BLACK()]);
        this.#levelData = levelData
    }
    
    init() {
        const audio = new Audio(this.#levelData.musicPath);
        audio.volume = this.#config.musicVolume;
        audio.loop = true;
        audio.oncanplay = () => {
            this.#audio = audio;
        }
        const musicTimestamps = this.#levelData.musicTimestamps
        const timestamp = musicTimestamps[this.#props.selectFirstMusicTimestamp ? 0 : Math.floor(Math.random() * musicTimestamps.length)] ?? 0
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
        const levelTime = time - this.#levelInitTime;
        this.#lastUpdateTime = time;
        this.#levelTime = (time - this.#levelInitTime)/1000;
        this.onUpdate(frameTime/1000);
        
        this.#incrementTimer += frameTime/1000;
        if (this.#incrementTimer > this.#incrementTime) {
            this.callIncrement();
        }
        if (this.#isIncrementing && this.getWallCount() === 0) this.#increment();

        const timer = document.getElementById('timer');
        timer.textContent = Math.floor(levelTime)/1000;
        
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
        cancelAnimationFrame(this.#updateId)
        cancelAnimationFrame(this.#renderId)
        this.clearIntervals();
        this.clearEvents();
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        if (this.#audio) this.#audio.pause()

        if (this.#isNewBest() && !this.#isNewBestSaved) this.#saveBest();

        newPersonalBestMessage.style.display = 'none'
    }

    #isNewBest() {
        const levelStats = getLevelStats(this.#levelData.key, this.#props.difficulty);
        const previousBest = levelStats?.best ?? 0;
        const newBest = Math.floor(this.#levelTime*1000)/1000;
        return newBest > previousBest
    }

    #saveBest() {
        this.#isNewBestSaved = true
        const levelStats = getLevelStats(this.#levelData.key, this.#props.difficulty);
        const newBest = Math.floor(this.#levelTime*1000)/1000;
        levelStats.best = newBest;
        writeLevelStats(this.#levelData.key, this.#props.difficulty, levelStats)

        setBestScore(newBest)
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
        super.kill()
        this.#games.forEach(game => game.kill())
        
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
        
        if (this.#isNewBest()) {
            console.log(getRandomNewPBMessage() )
            newPersonalBestMessage.style.display = 'block';
            newPersonalBestMessage.textContent = this.#config.funModeEnabled ? getRandomNewPBMessage() : 'new personal best'
            this.#saveBest();
        }

        const levelStats = getLevelStats(this.#levelData.key, this.#props.difficulty);
        const newTotalTime = (levelStats.totalTime ?? 0) + this.#levelTime;
        levelStats.totalTime = Math.floor(newTotalTime * 1000)/1000;
        writeLevelStats(this.#levelData.key, this.#props.difficulty, levelStats);
    }

    setBackgroundTileColors(arr) {
        super.setBackgroundTileColors(arr);
        document.documentElement.style.setProperty('--background-tile-color', arr[0].getRGBAStyle());
    }
    setMainColor({r, g, b, a}) {
        const color = new Color(r, g, b, a);
        super.setMainColor(color)
        document.documentElement.style.setProperty('--main-color', color.getRGBAStyle());
        // const gameUi = document.getElementById('game-ui')
        // gameUi.style.color = this.getMainColor().getRGBStyle();
    }
    // setBackgroundTileColors(arr) {
    //     super.setBackgroundTileColors(arr)
    //     const gameUi = document.getElementById('game-ui')
    //     gameUi.style.color = this.getMainColor().getRGBStyle();
    // }
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
        return this.#levelTime
    }
    getDifficulty() {
        return this.#props.difficulty
    }
    getTimestamp() {
        return this.#audioTimestamp
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