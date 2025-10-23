import PolygonObject from "./polygonObject.js";
import Wall from "./wall.js";
import { Color } from "./structures.js";

export default class Background extends PolygonObject {
    tileColors = [new Color(0, 0, 0)];

    constructor(appContext) {
        super(appContext)
        this.setThickness(1800);
        this.draw()
    }

    updateWallsProps() {
        this._walls.forEach((wall, i) => {
            wall.setDistance(this.getDistance());         
            wall.setThickness(this.getThickness());
            wall.setColor(this.tileColors[i % this.tileColors.length])
            wall.setSkew(this.getSkew());
            wall.setRotation(this.getRotation());
            wall.setLayer(this.getLayer());
            wall.draw()
        })
    }

    setTileColors(arr) {
        this.tileColors = arr;
        this.scheduleDraw();
    }

    getTileColors() {
        return this.tileColors
    }
}