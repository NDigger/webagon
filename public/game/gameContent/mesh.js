import GameObject from "./gameObject";
import * as PIXI from "pixi.js";
import { Vector2, Color } from "../../utils/structures";

const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

let shakeTimer = 0 
const f = () => {
    shakeTimer = performance.now();
    requestAnimationFrame(f)
}
requestAnimationFrame(f)

const pseudoRndShake = (power) => {
    return new Vector2(Math.sin(shakeTimer * 2.4104) * power, Math.cos(shakeTimer * 42.4215) * power);
}

export default class Mesh extends GameObject {
    #object;
    _geometry;
    _positions = [0, 0, 0, 0, 0, 0, 0, 0];
    #absolutePositions = [new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0)];
    #layer;
    #color = new Color(0, 0, 0);

    constructor(appContext) {
        super(appContext)

        this._geometry = new PIXI.MeshGeometry({
            positions: new Float32Array(this._positions),
            uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
            indices: new Uint16Array([0, 1, 2, 2, 3, 0])
        });
        this.#object = new PIXI.Mesh({geometry: this._geometry});

        this.addStageChild();
        this.setColor(new Color(0, 0, 0));

        this.draw = this.draw.bind(this);
        window.addEventListener('resize', this.draw);
    };

    draw() {
        if (this?._geometry?.positions) this._geometry.positions = new Float32Array(this.#absolutePositions);
    }

    setColor({r, g, b, a}) {
        this.#color = new Color(r, g, b, a);
        this.#object.tint = Color.rgbToHex(r, g, b);
        if (typeof(a) === "number") this.#object.alpha = a/255;
    }

    getColor() {
        return this.#color
    }

    setVertexPos(point, {x, y}) {
        const inc = point * 2;
        this._positions[0 + inc] = x;
        this._positions[1 + inc] = y;
        this.scheduleDraw();
    }

    getVertexPos(point) {
        const pos = this._positions;
        const inc = point * 2;
        return new Vector2(pos[0 + inc], pos[1 + inc])
    }

    getVertexPos4() {
        return [
            new Vector2(this._positions[0], this._positions[1]),
            new Vector2(this._positions[2], this._positions[3]),
            new Vector2(this._positions[4], this._positions[5]),
            new Vector2(this._positions[6], this._positions[7])
        ]
    }

    getVertexAbsolutePos(point) {
        const pos = this.#absolutePositions;
        const inc = point * 2;
        return new Vector2(pos[0 + inc], pos[1 + inc])
    }

    getVertexAbsolutePos4() {
        const pos = this.#absolutePositions;
        return [
            new Vector2(pos[0], pos[1]),
            new Vector2(pos[2], pos[3]),
            new Vector2(pos[4], pos[5]),
            new Vector2(pos[6], pos[7])
        ]
    }

    setVertexPos4(vec1, vec2, vec3, vec4) {
        this._positions[0] = vec1.x;
        this._positions[1] = vec1.y;
        this._positions[2] = vec2.x;
        this._positions[3] = vec2.y;
        this._positions[4] = vec3.x;
        this._positions[5] = vec3.y;
        this._positions[6] = vec4.x;
        this._positions[7] = vec4.y;

        const s = pseudoRndShake(globalThis.shakePower ?? 0)
        const baseWidth = 1920;
        const baseHeight = 1080;
        const scale = new Vector2(window.innerWidth / baseWidth, window.innerHeight / baseHeight);

        this.#absolutePositions = this._positions.map((v, i) => i % 2 === 0 ? (v + s.x) * scale.x : (v + s.y) * scale.y);

        this.scheduleDraw();
    }

    addStageChild() {
        this.appContext.pixiApp.stage.addChild(this.#object);
    }

    destroy() {
        if (this.destroyed) return
        this.appContext.pixiApp.stage.removeChild(this.#object)
        window.removeEventListener('resize', this.draw);
        this.#object?.geometry.destroy();
        this.#object.destroy();
        this.#object = null;
        this.redrawEnabled = false;
        this.destroyed = true;
    }

    setLayer(v) {
        this.#layer = v;
        this.#object.zIndex = v;
    }
    getLayer() {
        return this.#layer
    }

    getPositions() {
        return this._positions
    }
}