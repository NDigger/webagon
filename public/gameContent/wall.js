import CustomWall from "./customWall";
import { Vector2 } from "../utils/structures";

export default class Wall extends CustomWall {
    #side = 0;
    #sides = 0;
    #thickness = 40;
    #distance = 0;
    #offset = new Vector2(0, 0);

    #getWallVertexPos4() {
        const halfSides = this.#sides / 2;
        const firstAngle = this.#side * Math.PI / halfSides + Math.PI / this.#sides;
        const secondAngle = (firstAngle + 0.5 * Math.PI / halfSides + Math.PI / this.#sides);
        const x1 = (this.#distance * Math.cos(firstAngle));
        const y1 = (this.#distance * Math.sin(firstAngle));
        const x2 = ((this.#thickness + this.#distance) * Math.cos(firstAngle));
        const y2 = ((this.#thickness + this.#distance) * Math.sin(firstAngle));
        const x3 = ((this.#thickness + this.#distance) * Math.cos(secondAngle));
        const y3 = ((this.#thickness + this.#distance) * Math.sin(secondAngle));
        const x4 = (this.#distance * Math.cos(secondAngle));
        const y4 = (this.#distance * Math.sin(secondAngle));
        return [
            new Vector2(x1, y1),
            new Vector2(x2, y2),
            new Vector2(x3, y3),
            new Vector2(x4, y4)
        ]
    }

    draw() {
        const [pos1, pos2, pos3, pos4] = this.#getWallVertexPos4();
        this.setVertexPos4(pos1.add(this.#offset), pos2.add(this.#offset), pos3.add(this.#offset), pos4.add(this.#offset));
        super.draw();
    }

    setSide(v) {
        if (typeof(v) !== 'number') return;
         this.#side = Math.floor(v);
        this.scheduleDraw();
    }
    getSide() { return this.#side; }

    setSides(v) {
        if (typeof(v) !== 'number') return;
        this.#sides = Math.max(Math.floor(v), 3);
        this.scheduleDraw();
    }
    getSides() { return this.#sides; }

    setThickness(v) {
        if (typeof(v) !== 'number') return;
        this.#thickness = v;
        this.scheduleDraw();
    }
    getThickness() { return this.#thickness; }

    setDistance(v) {
        if (typeof(v) !== 'number') return;
        this.#distance = v;
        this.scheduleDraw();
    }
    getDistance() { return this.#distance; }
    
    setOffset({x, y}) {
        this.#offset = new Vector2(x, y);
        this.scheduleDraw();
    }
    getOffset() { return this.#offset }
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