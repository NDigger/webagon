import PolygonObject from "./polygonObject.js";
import { Color } from "../../utils/structures.js";

export default class Background extends PolygonObject {
    #swapped = false;
    #tileColors = [new Color(0, 0, 0)];
    #activeTileColors = [new Color(0, 0, 0)];
    #darkenUnevenChunkEnabled = true;

    #swapTime = 1000;
    #swapTimer = 1000;
    #swapEnabled = true;

    #lasttime = performance.now();
    #updateId;

    constructor(app) {
        super(app)
        this.setThickness(2500);
        this.draw()

        this.#updateId = requestAnimationFrame(t => this.#update(t))
    }

    updateWallsProps() {
        super.updateWallsProps();
        this._walls.forEach((wall, i) => {
            const tileColor = this.#activeTileColors[i % this.#activeTileColors.length];
            const brightness = .7
            const color = (i === (this.getSides() - 1) && this.getSides() % 2 === 1 && this.#darkenUnevenChunkEnabled) 
                        ? new Color(tileColor.r * brightness, tileColor.g * brightness, tileColor.b * brightness, tileColor.a)
                        : tileColor
            const gsc = v => isNaN(v) ? 0 : v;
            wall.setColor(new Color(gsc(color.r), gsc(color.g), gsc(color.b), gsc(color.a)))
        })
    }

    #getActiveTileColors() {
        if (this.#swapped) return this.#tileColors
        else return [this.#tileColors[this.#tileColors.length - 1], ...this.#tileColors.slice(0, this.#tileColors.length - 1)];
    }

    #update(time) {
        if (this.isDestroyed()) return;

        const frameTime = time - this.#lasttime;
        this.#lasttime = time;
        
        if (this.#swapEnabled) {
            this.#swapTimer += frameTime;
            if (this.#swapTimer > this.#swapTime) {
                this.#swapTimer = 0;
                this.#swapped = !this.#swapped;

                this.#activeTileColors = this.#getActiveTileColors();
            }
        }

        if (!this.isDestroyed()) this.#updateId = requestAnimationFrame(t => this.#update(t));
    }

    setSwapEnabled(v) {
        if (typeof(v) !== 'boolean') return
        this.#swapEnabled = v; 
    }
    getSwapped() { return this.#swapped }

    setTileColors(arr) {
        const v = arr.map(c => new Color(c.r, c.g, c.b, c.a));
        this.#tileColors = v;
        this.#activeTileColors = this.#getActiveTileColors();
    }
    getTileColors() { return this.#tileColors }
    setDarkenUnevenChunkEnabled(v) {
        if (typeof(v) !== 'boolean') return;
        this.#darkenUnevenChunkEnabled = v;
    }
    getDarkenUnevenChunkEnabled() {
        return this.#darkenUnevenChunkEnabled
    }

    setSwapTime(v) {
        if (typeof(v) !== 'number') return
        this.#swapTime = v*1000;
        // this.#swapTimer = v*1000;
    }

    destroy() {
        super.destroy();
        cancelAnimationFrame(this.#updateId);
    }
}