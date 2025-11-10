import CustomWall from "./customWall";
import { Vector2, Color, Size } from "../../utils/structures";

const degToRad = deg => deg * Math.PI / 180;

export default class Player extends CustomWall {
    #size = new Size(24, 10);
    #distance = 0;
    #rotationOffset = 0;

    constructor(app) {
        super(app)
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
    updatePosition() {
        this.setVertexPos4(
            new Vector2(this.#distance + this.#size.height, 0).rotate(degToRad(this.#rotationOffset)),
            new Vector2(this.#distance, -this.#size.width/2).rotate(degToRad(this.#rotationOffset)),
            new Vector2(this.#distance, 0).rotate(degToRad(this.#rotationOffset)),
            new Vector2(this.#distance, this.#size.width/2).rotate(degToRad(this.#rotationOffset)),
        )
        super.updatePosition()
    }

    setDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance = v;
    }

    draw() {
        this.updatePosition();
        super.draw();
    }

    destroy() {
        super.destroy()
    }
}