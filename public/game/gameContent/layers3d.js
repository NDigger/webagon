import GameObject from "./gameObject";
import Mesh from "./mesh";
import Lerp from "../../utils/interpolation";
import { Vector2, Color } from "../../utils/structures";
import { getScreenCenter } from "../utils";

export default class Layers3d extends GameObject {
    #meshes = [];
    #vertexPos4 = [];
    #layer = 0;

    #depth = 0;
    #distance = 10;
    #skew = 0;
    #color = new Color(0, 0, 0);
    #falloffColor = null;
    
    draw() {
        this.#meshes.forEach(mesh => mesh.destroy())
        this.#meshes = [];
        for (let i = 1; i <= this.#depth; i++) {
            const mesh = new Mesh(this.app)
            if (this.#falloffColor == null) mesh.setColor(this.#color);
            else mesh.setColor(Lerp.interpolate(this.#color, this.#falloffColor, i/this.#depth))
            mesh.setLayer(this.#layer - i*0.00001)
            this.#meshes.push(mesh);
        }
        if (this.#vertexPos4) {
            const pos = this.#vertexPos4
            this.setVertexPos4(pos[0], pos[1], pos[2], pos[3])
            this.#meshes.forEach(mesh => mesh.draw())
        }
    }

    setDepth(v) {
        if (v === this.#meshes.length || typeof(v) !== 'number') return
        this.#depth = v;
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
        this.#layer = v;
        this.#meshes.forEach(mesh => mesh.setLayer(v));
    }

    setColor({r, g, b, a}) {
        this.#color = new Color(r, g, b, a);
    }

    setFalloffColor({r, g, b, a}) {
        this.#falloffColor = new Color(r, g, b, a);
    }

    clearFalloffColor() {
        this.#falloffColor = null;
    }

    destroy() {
        this.#meshes.forEach(mesh => mesh.destroy());
        this.#meshes = [];
        this.redrawEnabled = false;
    }

    setVertexPos4(pos1, pos2, pos3, pos4) {
        this.#vertexPos4 = [pos1, pos2, pos3, pos4];
        this.#meshes.forEach((mesh, i) => {
            const inc = (i + 1) * this.#distance * this.#skew;

            const newPos = this.#vertexPos4.map(pos => {
                const screenCenter = getScreenCenter();
                let np = pos
                np = np.sub(screenCenter)
                const depth = 1 - Math.min(np.y * 0.001, 0);
                np.y += inc / depth;
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