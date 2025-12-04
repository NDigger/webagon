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

const clampColorValue = v => Math.max(0, Math.min(255, v));
export default class Mesh extends GameObject {
    #object;
    _geometry;
    #positions = [0, 0, 0, 0, 0, 0, 0, 0];
    #absolutePositions = [new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0)];
    #layer;
    #color = new Color(0, 0, 0);

    constructor(app) {
        super(app)

        this._geometry = new PIXI.MeshGeometry({
            positions: new Float32Array(this.#positions),
            uvs: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
            indices: new Uint16Array([0, 1, 2, 2, 3, 0])
        });
        this.#object = new PIXI.Mesh({geometry: this._geometry});

        this.#addStageChild();
        this.setColor(new Color(0, 0, 0));

        this.draw = this.draw.bind(this);
        window.addEventListener('resize', this.draw);
    };

    draw() {
        if (this?._geometry?.positions) this._geometry.positions = new Float32Array(this.#absolutePositions);
    }

    setColor({r, g, b, a}) {
        this.#color = new Color(
            clampColorValue(255, r), 
            clampColorValue(255, g), 
            clampColorValue(255, b), 
            clampColorValue(255, a)
        );
        this.#object.tint = Color.rgbToHex(r, g, b);
        if (typeof(a) === "number") this.#object.alpha = a/255;
    }

    getColor() {
        return this.#color
    }

    setVertexPos(point, {x, y}) {
        const inc = point * 2;
        this.#positions[0 + inc] = x;
        this.#positions[1 + inc] = y;
        this.#updateAbsolutePositions();
    }

    getVertexPos(point) {
        const pos = this.#positions;
        const inc = point * 2;
        return new Vector2(pos[0 + inc], pos[1 + inc])
    }

    getVertexPos4() {
        return [
            new Vector2(this.#positions[0], this.#positions[1]),
            new Vector2(this.#positions[2], this.#positions[3]),
            new Vector2(this.#positions[4], this.#positions[5]),
            new Vector2(this.#positions[6], this.#positions[7])
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

    #updateAbsolutePositions() {
        const s = pseudoRndShake(globalThis.shakePower ?? 0)
        const baseWidth = 1920;
        const baseHeight = 1080;
        const scale = new Vector2(window.innerWidth / baseWidth, window.innerHeight / baseHeight);

        this.#absolutePositions = this.#positions.map((v, i) => i % 2 === 0 ? (v + s.x) * scale.x : (v + s.y) * scale.y);
    }

    setVertexPos4(vec1, vec2, vec3, vec4) {
        this.#positions[0] = vec1.x;
        this.#positions[1] = vec1.y;
        this.#positions[2] = vec2.x;
        this.#positions[3] = vec2.y;
        this.#positions[4] = vec3.x;
        this.#positions[5] = vec3.y;
        this.#positions[6] = vec4.x;
        this.#positions[7] = vec4.y;

        this.#updateAbsolutePositions()
    }

    #addStageChild() {
        this.app.stage.addChild(this.#object);
    }

    destroy() {
        super.destroy();
        this.app.stage.removeChild(this.#object)
        window.removeEventListener('resize', this.draw);
        this.#object?.geometry.destroy();
        this.#object.destroy();
        this.#object = null;
    }

    setLayer(v) {
        this.#layer = v;
        this.#object.zIndex = v;
    }
    getLayer() {
        return this.#layer;
    }

    getPositions() {
        return this.#positions;
    }
}