import DrawHandler from "./drawHandler";
import Game from "./game";

export default class Level { 
    onInit = () => {};
    onUpdate = () => {};
    onRender = () => {};
    onLoad = () => {};

    #pixiApp;

    #levelInitTime = performance.now();

    game;

    #gameOver = false;
    #renderId = null;
    #updateId = null;
    #lastUpdateTime = performance.now();
    #lastRenderTime = performance.now();

    #audio;
    #currentLevelData;

    constructor(pixiApp, currentLevelData) {
        this.#currentLevelData = currentLevelData
        this.#pixiApp = pixiApp
    }
    
    init() {
        const game = new Game({
            pixiApp: this.#pixiApp,
            drawHandler: new DrawHandler(),
        })
        this.game = game;

        const audio = new Audio(this.#currentLevelData.musicPath);
        audio.oncanplay = () => {
            this.#audio = audio;
        }
        const musicTimestamps = this.#currentLevelData.musicTimestamps
        audio.currentTime = musicTimestamps[Math.floor(Math.random() * musicTimestamps.length)] ?? 0
        audio.play();


        this.onInit();

        this.#updateId = requestAnimationFrame(t => this.#update(t));
        this.#renderId = requestAnimationFrame(t => this.#render(t));
        document.addEventListener('visibilitychange', this.#handleVisibilityChange);

        this.game.onDeath = () => this.#onDeath()
    }
    
    #handleVisibilityChange = () => document.hidden && this.game.kill()

    #update(time) {
        if (this.#gameOver) return
        const frameTime = time - this.#lastUpdateTime;
        const levelTime = time - this.#levelInitTime;
        this.#lastUpdateTime = time;
        this.onUpdate(frameTime/1000);

        const timer = document.getElementById('timer');
        timer.textContent = Math.floor(levelTime)/1000;
        const gameUi = document.getElementById('game-ui')
        if (this.game) gameUi.style.color = this.game.getMainColor().getRGBStyle();
        
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    #render(time) {
        const frameTime = time - this.#lastRenderTime;
        this.#lastRenderTime = time;
        this.onRender(frameTime/1000)
        this.#renderId = requestAnimationFrame(t => this.#render(t))
    }

    destroy() {
        cancelAnimationFrame(this.#updateId)
        cancelAnimationFrame(this.#renderId)
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        if (this.#audio) this.#audio.pause()
        this.game.destroy()
    }

    #onDeath() {
        document.getElementById('restart-help-msg').style.display = 'block'
        if (this.#audio) this.#audio.pause()
        document.removeEventListener('visibilitychange', this.#handleVisibilityChange);
        this.#gameOver = true
        cancelAnimationFrame(this.#updateId);
    }
}