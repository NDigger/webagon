import PolygonObject from "./polygonObject";
import { Color, Vector2 } from "./structures";
import Player from "./player";

export default class Polygon extends PolygonObject {
    #color = new Color(0, 0, 0);
    #player = 

    constructor(app) {
        super(app);
        this.setThickness(60);
        this.draw();
    }

    updateWallsProps() {
        this._walls.forEach(wall => {
            wall.setThickness(this.getThickness());
            wall.setColor(this.#color);
            wall.setSkew(this.getSkew());
            wall.setRotation(this.getRotation());
            wall.setLayer(this.getLayer());
            wall.draw();
        })
    }

    setColor({r, g, b, a}) {
        this.#color = new Color(r, g, b, a);
        this.scheduleDraw();
    }

    getColor() {
        return this.#color;
    }
}