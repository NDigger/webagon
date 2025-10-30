import CustomWall from "./customWall";
import { Vector2, Color, Size } from "../../utils/structures";

const degToRad = deg => deg * Math.PI / 180;

export default class Player extends CustomWall {
    positionRedrawEnabled = true;
    previousFrameRotationOffset = 0;

    #size = new Size(24, 10);

    #swapEnabled = false;
    #movementEnabled = true;
    
    #distance = 0;
    #rotationOffset = 0;

    constructor(appContext) {
        super(appContext)
        this.setColor(new Color(0, 0, 0))
    }

    getPointPosition() { 
        return new Vector2(this.#distance + this.#size.height, 0).rotate(degToRad(this.#rotationOffset)).add(this.getOffset());
    } 

    getPointAbsolutePosition() { // Used for collisions
        return this.getVertexAbsolutePos(0);
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
    }
}