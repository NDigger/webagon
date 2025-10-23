import CustomWall from "./customWall";
import { Vector2 } from "./structures";
import { Color } from "./structures";

export default class Player extends CustomWall {
    #rotationOffset = 0;
    #lasttime = performance.now();
    #leftKeyPressed = false;
    #rightKeyPressed = false;
    #distance = 0;
    #speedMult = 0.6;

    constructor(app) {
        super(app)
        this.setDistance(this.#distance);
        this.setColor(new Color(0, 0, 0))
        
        document.addEventListener('keydown', e => {
            if (e.keyCode === 37) this.#leftKeyPressed = true;
            if (e.keyCode === 39) this.#rightKeyPressed = true;
        })
        document.addEventListener('keyup', e => {
            if (e.keyCode === 37) this.#leftKeyPressed = false;
            if (e.keyCode === 39) this.#rightKeyPressed = false;
        })
        requestAnimationFrame(time => this.#update(time));
    }

    #update(time) {
        const frameTime = time - this.#lasttime;
        this.#lasttime = time;
        if (this.#leftKeyPressed) this.#rotationOffset -= frameTime * this.#speedMult;
        if (this.#rightKeyPressed) this.#rotationOffset += frameTime * this.#speedMult;
        requestAnimationFrame(time => this.#update(time));
    }
    
    setDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance = v;
        this.setVertexPos4(
            new Vector2(v, 0),
            new Vector2(v, 10),
            new Vector2(v + 10, 0),
            new Vector2(v, -10),
        )
    }

    setRotation(v) {
        super.setRotation(v + this.#rotationOffset);
    }
}