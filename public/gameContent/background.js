import PolygonObject from "./polygonObject.js";
import Wall from "./wall.js";
import { Color } from "../utils/structures.js";

export default class Background extends PolygonObject {
    tileColors = [new Color(0, 0, 0)];

    constructor(appContext) {
        super(appContext)
        this.setThickness(2500);
        this.draw()
    }

    updateWallsProps() {
        super.updateWallsProps();
        this._walls.forEach((wall, i) => {
            const tileColor = this.tileColors[i % this.tileColors.length];
            const brightness = .7
            const color = (i === (this.getSides() - 1) && this.getSides() % 2 === 1) 
                        ? new Color(tileColor.r * brightness, tileColor.g * brightness, tileColor.b * brightness, tileColor.a)
                        : tileColor
            wall.setColor(color)
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