import CustomWall from "./customWall";
import { Vector2, Color, Size } from "../../utils/structures";

const degToRad = deg => deg * Math.PI / 180;

export default class Player extends CustomWall {
    #size = new Size(24, 10);
    #distance = 0;
    #rotationOffset = 0;
    #tilt = 0;

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
        const pos = [
            new Vector2(this.#distance + this.#size.height, 0),
            new Vector2(this.#distance, -this.#size.width/2),
            new Vector2(this.#distance, 0),
            new Vector2(this.#distance, this.#size.width/2),
        ]
        for (let i = 1; i <= 3; i++) {
            pos[i].x -= this.#distance + this.#size.height;
            pos[i] = pos[i].rotate(this.#tilt);
            pos[i].x += this.#distance + this.#size.height
        }
        pos.forEach((p, i) => pos[i] = p.rotate(degToRad(this.#rotationOffset)))
        this.setVertexPos4(
            pos[0],
            pos[1],
            pos[2],
            pos[3]
        )
        super.updatePosition()
    }

    setTilt(v) {
        if (typeof(v) !== 'number') return
        this.#tilt = v;
    }
    getTilt() { return this.#tilt }

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