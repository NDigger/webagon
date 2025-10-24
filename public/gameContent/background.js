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
        super.updateWallsProps();
        this._walls.forEach((wall, i) => {
            const tileColor = this.tileColors[i % this.tileColors.length];
            const color = (i === (this.getSides() - 1) && this.getSides() % 2 === 1) 
                        ? tileColor
                        : new Color(tileColor.r * .9, tileColor.g * .9, tileColor.b * .9, tileColor.a)
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