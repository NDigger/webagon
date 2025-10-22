import PolygonObject from "./polygonObject";
import { Color, Vector2 } from "./structures";
import Player from "./player";

export default class Polygon extends PolygonObject {
    #color = new Color(0, 0, 0);
    #player = new Player(this.app);

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

    setSkew(v) {
        super.setSkew(v)
        this.#player.setSkew(this.getSkew());
    }

    setThickness(v) {
        super.setThickness(v)
        this.#player.setDistance(this.getThickness() * 1.3)
    }

    setLayer(v) {
        super.setLayer(v)
        this.#player.setLayer(this.getLayer());
    }

    setRotation(v) {
        super.setRotation(v)
        this.#player.setRotation(this.getRotation());
    }

    setColor({r, g, b, a}) {
        this.#color = new Color(r, g, b, a);
        this.scheduleDraw();
    }

    getColor() {
        return this.#color;
    }
}