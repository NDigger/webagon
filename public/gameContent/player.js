import CustomWall from "./customWall";
import { Vector2 } from "../utils/structures";
import { Color } from "../utils/structures";

const degToRad = deg => deg * Math.PI / 180;

export default class Player extends CustomWall {
    #lasttime = performance.now();
    #leftKeyPressed = false;
    #rightKeyPressed = false;

    #swapEnabled = false;
    #movementEnabled = true;

    #updateId;
    
    #distance = 0;
    #speedMult = 0.6;
    #rotationOffset = 0;

    constructor(appContext) {
        super(appContext)
        this.setDistance(this.#distance);
        this.setColor(new Color(0, 0, 0))
        
        window.addEventListener('keydown', this.#onKeyDown);
        window.addEventListener('keyup', this.#onKeyUp);
        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }

    getPointPosition() { 
        return new Vector2(this.#distance + 10, 0).rotate(degToRad(this.#rotationOffset)).add(this.getOffset())
    } 

    getPointAbsolutePosition() { // Used for collisions
        return this.getVertexAbsolutePos(0)
    }

    #onKeyDown = e => {
        if (e.keyCode === 37) this.#leftKeyPressed = true;
        if (e.keyCode === 39) this.#rightKeyPressed = true;
        if (e.keyCode === 32 && this.#swapEnabled) this.#rotationOffset += 180;
    }

    #onKeyUp = e => {
        if (e.keyCode === 37) this.#leftKeyPressed = false;
        if (e.keyCode === 39) this.#rightKeyPressed = false;
    }

    #update(time) {
        const frameTime = time - this.#lasttime;
        this.#lasttime = time;
        if (this.#movementEnabled) {
            if (this.#leftKeyPressed) this.#rotationOffset -= frameTime * this.#speedMult;
            if (this.#rightKeyPressed) this.#rotationOffset += frameTime * this.#speedMult;
        }

        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }

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
        this.setVertexPos4(
            new Vector2(v + 10, 0).rotate(degToRad(this.#rotationOffset)),
            new Vector2(v, -12).rotate(degToRad(this.#rotationOffset)),
            new Vector2(v, 0).rotate(degToRad(this.#rotationOffset)),
            new Vector2(v, 12).rotate(degToRad(this.#rotationOffset)),
        )
    }

    draw() {
        this.setVertexPos4(
            new Vector2(this.#distance + 10, 0).rotate(degToRad(this.#rotationOffset)),
            new Vector2(this.#distance , -12).rotate(degToRad(this.#rotationOffset)),
            new Vector2(this.#distance , 0).rotate(degToRad(this.#rotationOffset)),
            new Vector2(this.#distance , 12).rotate(degToRad(this.#rotationOffset)),
        )
        super.draw();
    }

    destroy() {
        super.destroy()
        document.removeEventListener('keydown', this.#onKeyDown);
        document.removeEventListener('keyup', this.#onKeyUp);
        cancelAnimationFrame(this.#updateId);
    }
}