import { Color } from "../utils/structures";
import { loadLevel } from "./levelLoader";
import Background from "./gameContent/background";
import { app } from "../script";

class LevelPreviewContent {
    onInit = () => {};
    onUpdate = () => {};
    onRender = () => {};

    #updateId;
    #lastTime;

    #rotationSpeed = 0;

    style = {
        mainColor: new Color(255, 255, 255),
        backgroundTileColors: [new Color(0, 0, 0)],
        rotation: 0,
        sides: 6,
        backgroundDarkenUnevenChunkEnabled: true,
        backgroundSwapTime: 1,
        fontColor: undefined,
    }

    init() {
        this.onInit();
        this.#lastTime = performance.now();
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    #update(time) {
        const frameTime = time - this.#lastTime;
        this.#lastTime = time;

        this.style.rotation += this.#rotationSpeed * frameTime;

        this.onRender(frameTime/1000);
        this.onUpdate(frameTime/1000);
        this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    setMainColor({r, g, b, a}) {
        this.style.mainColor = new Color(r, g, b, a);
    }
    getMainColor() { return this.style.mainColor; }
    setBackgroundTileColors(arr) {
        const v = arr.map(c => new Color(c.r, c.g, c.b, c.a));
        this.style.backgroundTileColors = v;
        document.documentElement.style.setProperty('--background-tile-color', v[0].getRGBAStyle());
    }
    getBackgroundTileColors() { return this.style.backgroundTileColors; }
    setBackgroundDarkenUnevenChunkEnabled(v) {
        this.style.backgroundDarkenUnevenChunkEnabled = v
    }
    getBackgroundDarkenUnevenChunkEnabled() { return this.style.backgroundDarkenUnevenChunkEnabled }
    setBackgroundSwapTime(v) {
        this.style.backgroundSwapTime = v*1000;
    }
    getBackgroundSwapTime() { return this.style.backgroundSwapTime }
    setRotation(v) {
        this.rotation = v;
    }
    getRotation() { return this.rotation }
    setRotationSpeed(v) {
        this.#rotationSpeed = v;
    }
    getRotationSpeed() { return this.#rotationSpeed }
    setFontColor({r, g, b, a}) {
        const v = new Color(r, g, b, a);
        this.style.fontColor = v
    }
    getFontColor() { return this.style.fontColor }
    clearFontColor() {
        this.style.fontColor = undefined
    }

    setSides(v) { this.style.sides = v; }
    getSides() { return this.style.sides; }
    getTime() {
        return this.#lastTime/1000
    }
    getDifficultyMult() { return 1 }
    destroy() {
        cancelAnimationFrame(this.#updateId);
    }
}

export default class LevelPreview {
    #content = null;
    #background = undefined;
    
    #updateId;

    constructor() {
        this.#background = new Background(app);
    }

    #update() { // Created to conveniently apply styles 
        const style = this.getStyle()
        if (style == null) return

        const b = this.#background;
        b.setTileColors(style.backgroundTileColors);
        b.setRotation(style.rotation);
        b.setDarkenUnevenChunkEnabled(style.backgroundDarkenUnevenChunkEnabled);
        b.setSwapTime(style.backgroundSwapTime);
        document.documentElement.style.setProperty('--main-color', style.fontColor ? style.fontColor.getRGBAStyle() : style.mainColor.getRGBAStyle());
        b.setSides(style.sides);
        b.draw();

        this.#updateId = requestAnimationFrame(() => this.#update());
    }

    async load(levelPath) {
        cancelAnimationFrame(this.#updateId)

        const content = new Proxy(new LevelPreviewContent(), {
            get(target, prop) {
                if (prop in target) {
                    const value = target[prop];
                    if (typeof value === "function") return (...args) => value.apply(target, args);
                    return value;
                }
                return () => {};
            },
            set(target, prop, value) {
                if (prop in target) target[prop] = value;
                return true;
            }
        });
        if (this.#content) this.#content.destroy();
        this.#content = content;

        const result = await loadLevel(content, levelPath);
        if (!result) throw new Error('LevelPreview content not loaded.');
        this.#updateId = requestAnimationFrame(() => this.#update());
    }

    getStyle() { return this.#content?.style }

    destroy() {
        cancelAnimationFrame(this.#updateId);
        this.#content.destroy();
        this.#content = undefined;
        this.#background.destroy();
        this.#background = undefined;
    }
}