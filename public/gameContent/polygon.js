import PolygonObject from "./polygonObject";
import { Color, Vector2 } from "./structures";
import Player from "./player";


class PolygonBorder extends PolygonObject {
    #color = new Color(0, 0, 0);

    constructor(app) {
        super(app);
        this.setThickness(5);
        this.draw();
    }

    updateWallsProps() {
        this._walls.forEach(wall => {
            wall.setThickness(this.getThickness());
            wall.setColor(this.#color);
            wall.setSkew(this.getSkew());
            wall.setDistance(this.getDistance());
            wall.setRotation(this.getRotation());
            wall.setLayer(this.getLayer());
            wall.draw();
        })
    }
}
export default class Polygon extends PolygonObject {
    #color = new Color(0, 0, 0);
    #player = new Player(this.app);
    #border = new PolygonBorder(this.app);

    #borderColor = new Color(0, 0, 0);

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
        this.#player.setSkew(v);
        this.#border.setSkew(v);
    }

    setThickness(v) {
        const borderThickness = this.#border.getThickness();
        super.setThickness(v - borderThickness)
        this.#player.setDistance(v * 1.3)
        this.#border.setDistance(v - borderThickness);
    }

    setLayer(v) {
        super.setLayer(v)
        this.#player.setLayer(v);
        this.#border.setLayer(v);
    }

    setRotation(v) {
        super.setRotation(v)
        this.#player.setRotation(v);
        this.#border.setRotation(v);
    }

    setColor({r, g, b, a}) {
        this.#color = new Color(r, g, b, a);
        this.scheduleDraw();
    }

    getColor() {
        return this.#color;
    }

    setBorderColor({r, g, b, a}) {
        this.#border.setColor(new Color(r, g, b, a))
    }

    getBorderColor() {
        return this.#border.getColor();
    }
}