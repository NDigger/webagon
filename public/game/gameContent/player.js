import CustomWall from "./customWall";
import { Vector2, Color, Size } from "../../utils/structures";

const degToRad = deg => deg * Math.PI / 180;

export default class Player extends CustomWall {
    #lasttime = performance.now();
    #leftKeyPressed = false;
    #rightKeyPressed = false;

    positionRedrawEnabled = true;
    previousFrameRotationOffset = 0;

    #size = new Size(24, 10);

    #swapKeyPressed = false;

    #swapEnabled = false;
    #movementEnabled = true;

    #updateId;
    
    #distance = 0;
    #speedMult = 0.6;
    #rotationOffset = 0;

    constructor(appContext) {
        super(appContext)
        this.setColor(new Color(0, 0, 0))
        
        window.addEventListener('keydown', this.#onKeyDown);
        window.addEventListener('keyup', this.#onKeyUp);
        this.#updateId = requestAnimationFrame(time => this.#update(time));

    }

    getPointPosition() { 
        return new Vector2(this.#distance + this.#size.height, 0).rotate(degToRad(this.#rotationOffset)).add(this.getOffset());
    } 

    getPointAbsolutePosition() { // Used for collisions
        return this.getVertexAbsolutePos(0);
    }

    #onKeyDown = e => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.#leftKeyPressed = true;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') this.#rightKeyPressed = true;

        if (e.code === 'Space' && this.#swapEnabled && !this.#swapKeyPressed) {
            this.#rotationOffset += 180;
            this.#swapKeyPressed = true;
        }
    }

    #onKeyUp = e => {
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.#leftKeyPressed = false;
        if (e.code === 'ArrowRight' || e.code === 'KeyD') this.#rightKeyPressed = false;
        if (e.code === 'Space') this.#swapKeyPressed = false;
    }

    #update(time) {
        const frameTime = time - this.#lasttime;
        this.#lasttime = time;
        if (this.#movementEnabled) {
            if (this.#leftKeyPressed || this.#rightKeyPressed) {
                this.previousFrameRotationOffset = this.#rotationOffset
            }
            if (this.#leftKeyPressed) this.#rotationOffset -= frameTime * this.#speedMult;
            if (this.#rightKeyPressed) this.#rotationOffset += frameTime * this.#speedMult;
        }

        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }

    setSize({width, height}) {
        this.#size = new Size(width, height);
    }
    getSize() { return this.#size }
    setRotationOffset(v) {
        if (typeof(v) !== 'number') return
        this.#rotationOffset = v;
    }
    getRotationOffset() { return this.#rotationOffset }
    setMovementEnabled(v) {
        if (typeof(v) !== 'boolean') return
        this.#movementEnabled = v;
    }
    getMovementEnabled() { return this.#movementEnabled; }
    setSwapEnabled(v) {
        if (typeof(v) !== 'boolean') return
        this.#swapEnabled = v;
    }
    getSwapEnabled() { return this.#swapEnabled; }
    
    setDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance = v;
        this.scheduleDraw();
    }

    draw() {
        if (this.positionRedrawEnabled) {
            this.setVertexPos4(
                new Vector2(this.#distance + this.#size.height, 0).rotate(degToRad(this.#rotationOffset)),
                new Vector2(this.#distance, -this.#size.width/2).rotate(degToRad(this.#rotationOffset)),
                new Vector2(this.#distance, 0).rotate(degToRad(this.#rotationOffset)),
                new Vector2(this.#distance, this.#size.width/2).rotate(degToRad(this.#rotationOffset)),
            )
        }
        super.draw();
    }

    destroy() {
        super.destroy()
        document.removeEventListener('keydown', this.#onKeyDown);
        document.removeEventListener('keyup', this.#onKeyUp);
        cancelAnimationFrame(this.#updateId);
    }
}