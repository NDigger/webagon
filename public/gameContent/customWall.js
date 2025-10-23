import Mesh from "./mesh";
import { Vector2 } from "./structures";
import Layers3d from "./layers3d";

const getScreenCenter = () => new Vector2(window.innerWidth/2, window.innerHeight/2)

const rotatePoint = (point, center, angleDeg) => {
  const angle = angleDeg * Math.PI / 180;

  const dx = point.x - center.x;
  const dy = point.y - center.y;

  const xRot = dx * Math.cos(angle) - dy * Math.sin(angle);
  const yRot = dx * Math.sin(angle) + dy * Math.cos(angle);

  return new Vector2(xRot + center.x, yRot + center.y);
}

export default class CustomWall extends Mesh {
    #layers3d = new Layers3d(this.app);
    #skew = 0;
    #rotation = 0;
    
    #depth3d;

    draw() {
        const screenCenter = getScreenCenter();
        // i % 2 === 0: x coord
        // i % 2 === 1: y coord
        const pos = this.getVector2VertexPos4().map(vec2 => {
            let newPos = rotatePoint(vec2, new Vector2(0, 0), this.#rotation)
            newPos.x += screenCenter.x 
            newPos.y /= this.#skew + 1;
            newPos.y +=  screenCenter.y;
            return newPos;
        });
        this._geometry.positions = new Float32Array([
            pos[0].x, pos[0].y,
            pos[1].x, pos[1].y,
            pos[2].x, pos[2].y,
            pos[3].x, pos[3].y
        ]);
        this.#layers3d.setVertexPos4(pos[0], pos[1], pos[2], pos[3])
    }

    setRotation(v) {
        if (typeof(v) === 'number') this.#rotation = v;
        this.scheduleDraw();
    }

    getRotation() {
        return this.#rotation;
    }

    setSkew(v) {
        if (typeof(v) === 'number') this.#skew = v;
        this.scheduleDraw();
    }

    getSkew() {
        return this.#skew;
    }

    set3dDepth(v) {
        if (typeof(v) === 'number') this.#depth3d = v
    }

    setLayer(v) {
        super.setLayer(v)
        this.#layers3d.setLayer(v - 0.001);
    }

    destroy() {
        super.destroy()
        this.#layers3d.destroy();
    }
}
