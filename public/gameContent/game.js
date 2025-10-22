import { Polygon } from "pixi.js";
import Background from "./background";

export { default as Background } from "./gameContent/background";
export { default as Wall } from "./gameContent/wall";
export { default as Polygon } from "./gameContent/polygon";
export { Vector2, Color } from "./gameContent/structures";

export default class Game extends GameObject {
    #background = new Background(app)
    #polygon = new Polygon(app)

    constructor(app) {
        super(app)
    }
}