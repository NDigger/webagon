import GameObject from "./gameObject";
import Mesh from "./mesh";
import { Vector2, Color } from "./structures";

export default class Layers3d extends GameObject {
    #meshes = [];
    #vertexPos4 = [];
    #layer = 0;

    #depth = 0;
    #distance = 10;
    #skew = 0;

    constructor(appContext) {
        super(appContext)
    }

    draw() {
        this.#meshes.forEach(mesh => mesh.destroy())
        this.#meshes = [];
        for (let i = 1; i <= this.#depth; i++) {
            const mesh = new Mesh(this.appContext)
            mesh.setColor(new Color(0, 0, 0, 255))
            mesh.setLayer(this.#layer)
            this.#meshes.push(mesh);
        }
        if (this.#vertexPos4) {
            const pos = this.#vertexPos4
            this.setVertexPos4(pos[0], pos[1], pos[2], pos[3])
        }
    }

    setDepth(v) {
        if (v === this.#meshes.length || typeof(v) !== 'number') return
        this.#depth = v;
        this.scheduleDraw()
    }

    setDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance = v;
        this.scheduleDraw();
    }

    setSkew(v) {
        if (typeof(v) !== 'number') return
        this.#skew = v;
        this.scheduleDraw();
    }

    setLayer(v) {
        this.#layer = v;
        this.#meshes.forEach(mesh => mesh.setLayer(v))
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
            mesh.setVertexPos4(
                new Vector2(pos1.x, pos1.y + inc), 
                new Vector2(pos2.x, pos2.y + inc), 
                new Vector2(pos3.x, pos3.y + inc), 
                new Vector2(pos4.x, pos4.y + inc), 
            )
        })
    }
}