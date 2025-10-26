import { Color } from "../utils/structures";
import PolygonObject from "./polygonObject";

export default class Death extends PolygonObject {
    #updateId;
    #lasttime = performance.now();

    constructor(appContext) {
        super(appContext);
        this.setColor(new Color(255, 0, 0));
        this.setLayer(100);

        this.draw();

        this.#updateId = requestAnimationFrame(t => this.#update(t))
    }

    #update(time) {
        const frameTime = time - this.#lasttime;
        this.#lasttime = time
        this.setColor(Color.hsvToRgb(time/1000, 1., 1.));
        const t = time / 1000
        this.setDistance((t * 2 - Math.floor(t * 2)) * 50);
        this.setThickness((t * 2 - Math.floor(t * 2)) * 20);
        this.#updateId = requestAnimationFrame(t => this.#update(t)) 
    }
}