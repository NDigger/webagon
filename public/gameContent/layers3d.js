import GameObject from "./gameObject";
import Mesh from "./mesh";
import { Vector2, Color } from "./structures";

export default class Layers3d extends GameObject {
    #meshes = []

    constructor(app) {
        super(app)

        for (let i = 1; i <= 3; i++) {
            const mesh = new Mesh(this.app)
            mesh.setColor(new Color(2, 0, 0, 25))
            mesh.setLayer(-10)
            this.#meshes.push(mesh);
        }
    }

    setLayer(v) {
        this.#meshes.forEach(mesh => {
            mesh.setLayer(v);
            mesh.scheduleDraw();
        })
    }

    destroy() {
        console.log('destroyed')
        this.#meshes.forEach(mesh => mesh.destroy());
        this.#meshes = [];
    }

    setVertexPos4(pos1, pos2, pos3, pos4) {
        this.#meshes.forEach((mesh, i) => {
            const inc = i + 1;
            mesh.setVertexPos4(
                new Vector2(pos1.x, pos1.y + inc * 40), 
                new Vector2(pos2.x, pos2.y + inc * 40), 
                new Vector2(pos3.x, pos3.y + inc * 40), 
                new Vector2(pos4.x, pos4.y + inc * 40), 
            )
        })
    }
}