import GameObject from "./gameObject";
import PolygonObject from "./polygonObject.js";
import Wall  from "./wall.js";
import { Color } from "./structures.js";

export default class Background extends PolygonObject {
    #walls = [];
    #distance = 0;
    #thickness = 1000;
    #sides = 6;
    tileColors = [new Color(0, 0, 0)];

    #skew = 0;
    #rotation = 0;
    #layer = 0;

    constructor(app) {
        super(app)
        this.draw()
    }

    updateWallsProps() {
        console.log(this.tileColors)
        this._walls.forEach((wall, i) => {
            wall.setDistance(this.getDistance());         
            wall.setThickness(this.getThickness());
            wall.setColor(this.tileColors[i % this.tileColors.length])
            wall.setSkew(this.getSkew());
            wall.setRotation(this.getRotation());
            wall.setLayer(this.getLayer());
            wall.draw();
        })
    }

    // draw() {
    //     const sidesChanged = (this.#walls[0]?.getSides() ?? -1) !== this.#sides;
    //     if (sidesChanged) {
    //         this.#walls.forEach(wall => wall.destroy());
    //         this.#walls = [];
    //         for (let i = 0; i < this.#sides; i++) {
    //             const wall = new Wall(this.app);
    //             wall.setSide(i);
    //             wall.setSides(this.#sides);
    //             this.#walls.push(wall)
    //         }
    //         this.updateWallsProps();
    //     } else this.updateWallsProps();
    // }

    // setSides(v) {
    //     if (typeof(v) !== 'number') return
    //     this.#sides = v;
    //     this.scheduleDraw()
    // }
    
    // getSides() {
    //     return this.#sides
    // }

    // setDistance(v) {
    //     if (typeof(v) !== 'number') return
    //     this.#distance = v;
    //     this.scheduleDraw();
    // }

    // getDistance() {
    //     return this.#distance
    // }

    // setThickness(v) {
    //     if (typeof(v) !== 'number') return
    //     this.#thickness = v;
    //     this.scheduleDraw();
    // }

    // getThickness() {
    //     return this.#thickness;
    // }

    setTileColors(arr) {
        this.tileColors = arr;
        this.scheduleDraw();
    }

    getTileColors() {
        return this.tileColors
    }

    // setSkew(v) {
    //     if (typeof(v) === 'number') this.#skew = v;
    //     this.scheduleDraw();
    // }

    // getSkew() {
    //     return this.#skew;
    // }

    // setRotation(v) {
    //     if (typeof(v) === 'number') this.#rotation = v;
    //     this.scheduleDraw();
    // }

    // setLayer(v) {
    //     if (typeof(v) === 'number') this.#layer = v;
    //     this.scheduleDraw();
    // }

    // getLayer() {
    //     return this.#layer
    // }
}