import GameObject from "./gameObject";
import { Color, Vector2 } from "./structures";
import Wall from "./wall";

export default class Shape extends GameObject {
    #walls = [];

    #layer = 0;
    #color = new Color(0, 0, 0);
    #radius = 70;
    #sides = 6;
    #rotation = 0;
    #skew = 0;

    constructor(app) {
        super(app);
        this.draw();
    }

    updateWallsProps() {
        this.#walls.forEach(wall => {
            wall.setThickness(this.#radius);
            wall.setColor(this.#color);
            wall.setSkew(this.#skew);
            wall.setRotation(this.#rotation);
            wall.setLayer(this.#layer);
            wall.draw();
        })
    }

    draw() {
        const sidesChanged = (this.#walls[0]?.getSides() ?? -1) !== this.#sides;
        if (sidesChanged) {
            for (let i = 0; i < this.#sides; i++) {
                const wall = new Wall(this.app);
                wall.setSide(i);
                wall.setSides(this.#sides);
                this.#walls.push(wall)
            }
            this.updateWallsProps();
        } else this.updateWallsProps();
    }

    setRadius(v) {
        if (typeof(v) === 'number') this.#radius = v;
        this.scheduleDraw();
    }

    getRadius() {
        return this.#radius;
    }

    setColor(v) {
        this.#color = v;
        this.scheduleDraw();
    }

    getColor() {
        return this.color;
    }

    setSides(v) {
        if (typeof(v) === 'number') this.#sides = v;
        this.scheduleDraw();
    }

    getSides() {
        return this.#sides;
    }

    setRotation(v) {
        if (typeof(v) === 'number') this.#rotation = v;
        this.scheduleDraw();
    }

    getRotation() {
        return this.#rotation;
    }

    setSkew(v) {
        if (typeof(v) === 'number') this.#skew = v;
        this.scheduleDraw();
    }

    setLayer(v) {
        if (typeof(v) === 'number') this.#layer = v;
        this.scheduleDraw();
    }

    getLayer() {
        return this.#layer
    }
}