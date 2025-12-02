import GameObject from "./gameObject";
import Mesh from "./mesh";
import Lerp from "../../utils/interpolation";
import { Vector2, Color } from "../../utils/structures";
import { getScreenCenter } from "../utils";

export default class Layers3d extends GameObject {
    #meshes = [];
    #vertexPos4 = [];
    #layer = 0;

    #layersCount = 0;
    #distance = 10;
    #skew = 0;
    #depthMult = 0;
    #color = new Color(0, 0, 0);
    #falloffColor = null;
    #falloffScale = new Vector2(1, 1);
    
    draw() {
        this.#meshes.forEach(mesh => mesh.destroy())
        this.#meshes = [];
        for (let i = 1; i <= this.#layersCount; i++) {
            const mesh = new Mesh(this.app)
            if (this.#falloffColor == null) mesh.setColor(this.#color);
            else mesh.setColor(Lerp.interpolate(this.#color, this.#falloffColor, i/this.#layersCount))
            mesh.setLayer(this.#layer - i*0.00001)
            this.#meshes.push(mesh);
        }
        if (this.#vertexPos4) {
            const pos = this.#vertexPos4
            this.setVertexPos4(pos[0], pos[1], pos[2], pos[3])
            this.#meshes.forEach(mesh => mesh.draw())
        }
    }

    setLayersCount(v) {
        if (v === this.#meshes.length || typeof(v) !== 'number') return
        this.#layersCount = v;
    }

    setDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance = v;
    }

    setSkew(v) {
        if (typeof(v) !== 'number') return;
        this.#skew = v;
    }

    setLayer(v) {
        if (typeof(v) !== 'number') return;
        this.#layer = v;
        this.#meshes.forEach(mesh => mesh.setLayer(v));
    }

    setColor({r, g, b, a}) {
        this.#color = new Color(r, g, b, a);
    }

    setFalloffColor({r, g, b, a}) {
        this.#falloffColor = new Color(r, g, b, a);
    }
    setFalloffScale({x, y}) {
        const fs = new Vector2(x, y);
        this.#falloffScale = fs;
    }
    getFalloffScale() { return this.#falloffScale }

    setDepthMult(v) {
        if (typeof(v) !== 'number') return;
        this.#depthMult = v;
    }

    clearFalloffColor() {
        this.#falloffColor = null;
    }

    destroy() {
        this.#meshes.forEach(mesh => mesh.destroy());
        this.#meshes = [];
    }

    setVertexPos4(pos1, pos2, pos3, pos4) {
        this.#vertexPos4 = [pos1, pos2, pos3, pos4];
        this.#meshes.forEach((mesh, i) => {
            const layerYInc = (i + 1) * this.#distance * this.#skew;
            const layerScaleMult = Lerp.interpolate(new Vector2(1, 1), this.#falloffScale, (i + 1)/this.#layersCount);
            const newPos = this.#vertexPos4.map(pos => {
                const screenCenter = getScreenCenter();
                let np = pos
                np = np.sub(screenCenter)

                const depth = 1 - Math.min(np.y * this.#depthMult / 1000, 0);

                np = np.mul(layerScaleMult);
                np.y += layerYInc / depth;

                np = np.add(screenCenter);
                return np;
            })

            mesh.setVertexPos4(
                newPos[0],
                newPos[1],
                newPos[2],
                newPos[3],
            )
        })
    }
}