import CustomWall from "./customWall";
import { Vector2 } from "../../utils/structures";

const degToRad = v => v * Math.PI / 180;

export default class Wall extends CustomWall {
    #side = 0;
    #sides = 0;
    #thickness = 40;
    #distance = 0;

    #leftAngleOffset = 0;
    #rightAngleOffset = 0;
    #skewLeft = 0;
    #skewRight = 0;


    #getWallVertexPos4() {
        const halfSides = this.#sides / 2;
        const firstAngle = this.#side * Math.PI / halfSides + Math.PI / this.#sides;
        const secondAngle = firstAngle + 0.5 * Math.PI / halfSides + Math.PI / this.#sides;
        const x1 = (this.#distance * Math.cos(firstAngle));
        const y1 = (this.#distance * Math.sin(firstAngle));
        const x2 = ((this.#thickness + this.#distance + this.#skewLeft) * Math.cos(firstAngle + this.#leftAngleOffset));
        const y2 = ((this.#thickness + this.#distance + this.#skewLeft) * Math.sin(firstAngle + this.#leftAngleOffset));
        const x3 = ((this.#thickness + this.#distance + this.#skewRight) * Math.cos(secondAngle + this.#rightAngleOffset));
        const y3 = ((this.#thickness + this.#distance + this.#skewRight) * Math.sin(secondAngle + this.#rightAngleOffset));
        const x4 = (this.#distance * Math.cos(secondAngle));
        const y4 = (this.#distance * Math.sin(secondAngle));

        return [
            new Vector2(x1, y1),
            new Vector2(x2, y2),
            new Vector2(x3, y3),
            new Vector2(x4, y4)
        ]
    }

    getVertexAbsolutePos4() {
        const pos4 = super.getVertexAbsolutePos4()
        const extra = 0.1; // Prevents wall clip
        return [
            pos4[0].rotate(-degToRad(extra/2)),
            pos4[1].rotate(-degToRad(extra/2)),
            pos4[2].rotate(degToRad(extra)),
            pos4[3].rotate(degToRad(extra))
        ]
    }

    draw() {
        this.updatePosition();
        super.draw();
    }

    updatePosition() {
        const [pos1, pos2, pos3, pos4] = this.#getWallVertexPos4();
        this.setVertexPos4(pos1, pos2, pos3, pos4);
        super.updatePosition()
    }

    setSide(v) {
        if (typeof(v) !== 'number') return;
        this.#side = Math.floor(v);
    }
    getSide() { return this.#side; }

    setSides(v) {
        if (typeof(v) !== 'number') return;
        this.#sides = Math.max(Math.floor(v), 3);
    }
    getSides() { return this.#sides; }

    setThickness(v) {
        if (typeof(v) !== 'number') return;
        this.#thickness = v;
    }
    getThickness() { return this.#thickness; }

    setDistance(v) {
        if (typeof(v) !== 'number') return;
        this.#distance = v;
    }
    getDistance() { return this.#distance; }

    setLeftAngleOffset(v) {
        if (typeof(v) !== 'number') return;
        this.#leftAngleOffset = v;
    }
    getLeftAngleOffset() { return this.#leftAngleOffset }

    setRightAngleOffset(v) {
        if (typeof(v) !== 'number') return;
        this.#rightAngleOffset = v;
    }
    getRightAngleOffset() { return this.#rightAngleOffset }

    setSkewLeft(v) {
        if (typeof(v) !== 'number') return;
        this.#skewLeft = v;
    }
    getSkewLeft() { return this.#skewLeft }

    setSkewRight(v) {
        if (typeof(v) !== 'number') return;
        this.#skewRight = v;
    }
    getSkewRight() { return this.#skewRight }
}

const getWallVertex4 = ({sides, side, thickness, distance}) => {
    const firstAngle = side * Math.PI / (sides / 2) + Math.PI / sides;
    const secondAngle = (firstAngle + 0.5 * Math.PI / (sides / 2) + Math.PI / sides);
    const x1 = (distance * Math.cos(firstAngle));
    const y1 = (distance * Math.sin(firstAngle));
    const x2 = ((thickness + distance) * Math.cos(firstAngle));
    const y2 = ((thickness + distance) * Math.sin(firstAngle));
    const x3 = ((thickness + distance) * Math.cos(secondAngle));
    const y3 = ((thickness + distance) * Math.sin(secondAngle));
    const x4 = (distance * Math.cos(secondAngle));
    const y4 = (distance * Math.sin(secondAngle));
    return [
        new Vector2(x1, y1),
        new Vector2(x2, y2),
        new Vector2(x3, y3),
        new Vector2(x4, y4)
    ]
}