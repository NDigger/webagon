import CustomWall from "./customWall";
import { Vector2 } from "./structures";
import { Color } from "./structures";
import PolygonObject from "./polygonObject";

class Death extends PolygonObject {
    #updateId;
    #lasttime = performance.now();

    constructor(appContext) {
        super(appContext);
        this.setThickness(30);
        this.setColor(new Color(255, 0, 0));
        this.setLayer(100);
        this.setDistance(10);

        this.draw();

        this.#updateId = requestAnimationFrame(t => this.#update(t))
    }

    #update(time) {
        this.set3dDistance(10);
        this.set3dDepth(10);
        this.set3dLayer(0.001);

        const frameTime = time - this.#lasttime;
        this.#lasttime = time
        this.setColor(Color.hsvToRgb(time/1000, 1., 1.));
        const t = time / 1000
        this.setDistance((t * 2 - Math.floor(t * 2)) * 50);
        this.#updateId = requestAnimationFrame(t => this.#update(t)) 
    }
}

const degToRad = deg => deg * Math.PI / 180;

export default class Player extends CustomWall {
    #lasttime = performance.now();
    #leftKeyPressed = false;
    #rightKeyPressed = false;

    #updateId;
    
    #distance = 0;
    #speedMult = 0.6;
    #rotationOffset = 0;

    constructor(appContext) {
        super(appContext)
        this.setDistance(this.#distance);
        this.setColor(new Color(0, 0, 0))
        
        window.addEventListener('keydown', this.#onKeyDown);
        window.addEventListener('keyup', this.#onKeyUp);
        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }

    getPointPosition() { return this.getVector2VertexPos4()[0] } 
    getPointRotatedPosition() { return this.getPointPosition().rotate(degToRad(this.#rotationOffset)) }

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
        console.log(this.getPointRotatedPosition());

        this.#updateId = requestAnimationFrame(time => this.#update(time));
    }

    setRotation(v) {
        super.setRotation(v + this.#rotationOffset);
    }
    
    setDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance = v;
        this.setVertexPos4(
            new Vector2(v + 10, 0),
            new Vector2(v, -12),
            new Vector2(v, 0),
            new Vector2(v, 12),
        )
    }

    destroy() {
        super.destroy()
        document.removeEventListener('keydown', this.#onKeyDown);
        document.removeEventListener('keyup', this.#onKeyUp);
        cancelAnimationFrame(this.#updateId);
    }
}