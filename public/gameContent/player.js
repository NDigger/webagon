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
    #updateId;

    constructor(appContext) {
        super(appContext)
        this.setDistance(this.#distance);
        this.setColor(new Color(0, 0, 0))
        
        window.addEventListener('keydown', this.#onKeyDown);
        window.addEventListener('keyup', this.#onKeyUp);
        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }

    #onKeyDown = e => {
        if (e.keyCode === 37) this.#leftKeyPressed = true;
        if (e.keyCode === 39) this.#rightKeyPressed = true;
    }

    #onKeyUp = e => {
        if (e.keyCode === 37) this.#leftKeyPressed = false;
        if (e.keyCode === 39) this.#rightKeyPressed = false;
    }

    #update(time) {
        const frameTime = time - this.#lasttime;
        this.#lasttime = time;
        if (this.#leftKeyPressed) this.#rotationOffset -= frameTime * this.#speedMult;
        if (this.#rightKeyPressed) this.#rotationOffset += frameTime * this.#speedMult;
        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }
    
    setDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance = v;
        this.setVertexPos4(
            new Vector2(v, 0),
            new Vector2(v, 12),
            new Vector2(v + 10, 0),
            new Vector2(v, -12),
        )
    }

    setRotation(v) {
        super.setRotation(v + this.#rotationOffset);
    }

    destroy() {
        super.destroy()
        document.removeEventListener('keydown', this.#onKeyDown);
        document.removeEventListener('keyup', this.#onKeyUp);
        cancelAnimationFrame(this.#updateId);
    }
}