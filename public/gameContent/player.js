import CustomWall from "./customWall";
import { Vector2 } from "./structures";

export default class Player extends CustomWall {
    constructor(app) {
        super(app)
        this.setVertexPos4(
            new Vector2(1000, 100),
            new Vector2(0, 100),
            new Vector2(0, 100),
            new Vector2(100, 0),
        )
    }
}