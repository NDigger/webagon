import GameObject from "./gameObject";
import * as PIXI from "pixi.js";
import { Vector2, Color } from "./structures";

const componentToHex = c => {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(Math.floor(r)) + componentToHex(Math.floor(g)) + componentToHex(Math.floor(b));
}

export default class Mesh extends GameObject {
    #object;
    _geometry;
    _positions = [0, 0, 0, 0, 0, 0, 0, 0];
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

        window.addEventListener('resize', this.draw);
    };

    draw() {
        this._geometry.positions = new Float32Array(this._positions);
    }

    setColor({r, g, b, a}) {
        this.#color = new Color(r, g, b, a);
        this.#object.tint = rgbToHex(r, g, b);
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

    getVector2VertexPos4() {
        return [
            new Vector2(this._positions[0], this._positions[1]),
            new Vector2(this._positions[2], this._positions[3]),
            new Vector2(this._positions[4], this._positions[5]),
            new Vector2(this._positions[6], this._positions[7])
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
        this.scheduleDraw();
    }

    addStageChild() {
        this.appContext.pixiApp.stage.addChild(this.#object);
    }

    destroy() {
        this.appContext.pixiApp.stage.removeChild(this.#object)
        window.removeEventListener('resize', this.draw);
        // this.#object.geometry.destroy();
        this.#object.destroy();
        // this.#object = null;
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