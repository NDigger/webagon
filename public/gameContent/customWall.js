import Mesh from "./mesh";
import { Vector2, Color } from "./structures";
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
    #layers3d = new Layers3d(this.appContext);
    #skew = 0;
    #rotation = 0;

    #color3d = new Color(0, 0, 0);
    #depth3d = 0;
    #distance3d = 0;
    #layersCount3d = 0;
    #centerOffset = new Vector2(0, 0);

    getAbsoluteVertex4() {
        const screenCenter = getScreenCenter();
        return this.getVertexPos4().map(vec2 => {
            let newPos = rotatePoint(vec2, new Vector2(0, 0), this.#rotation)
            newPos.x += screenCenter.x + this.#centerOffset.x
            newPos.y /= this.#skew + 1;
            newPos.y +=  screenCenter.y + this.#centerOffset.y;
            return newPos;
        });
    }
    
    draw() {
        // i % 2 === 0: x coord
        // i % 2 === 1: y coord
        const pos = this.getAbsoluteVertex4()
        this._geometry.positions = new Float32Array([
            pos[0].x, pos[0].y,
            pos[1].x, pos[1].y,
            pos[2].x, pos[2].y,
            pos[3].x, pos[3].y
        ]);
        this.#layers3d.setVertexPos4(pos[0], pos[1], pos[2], pos[3]);
    }

    setRotation(v) {
        if (typeof(v) !== 'number') return 
        this.#rotation = v;
        this.scheduleDraw();
    }
    getRotation() { return this.#rotation; }
    setCenterOffset({x, y}) {
        this.#centerOffset = new Vector2(x, y);
        this.scheduleDraw();
    }
    getCenterOffset() { return this.#centerOffset; }

    setSkew(v) {
        if (typeof(v) !== 'number') return 
        this.#skew = v;
        this.#layers3d.setSkew(v);
        this.scheduleDraw();
    }
    getSkew() { return this.#skew; }

    set3dDepth(v) {
        if (typeof(v) !== 'number') return 
        this.#depth3d = v;
        this.#layers3d.setDepth(v);
    }
    get3dDepth() { return this.#depth3d; }
    set3dDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance3d = v;
        this.#layers3d.setDistance(v);
    }
    get3dDistance() { return this.#distance3d; }
    set3dLayer(v) {
        if (typeof(v) !== 'number') return
        this.#layersCount3d = v;
        this.#layers3d.setLayer(v);
    }
    get3dLayer() { return this.#layersCount3d; }
    set3dColor({r, g, b, a}) {
        const color = new Color(r, g, b, a);
        this.#color3d = color;
        this.#layers3d.setColor(color);
    }
    get3DColor() { return this.#color3d }

    // setLayer(v) {
    //     super.setLayer(v)
    //     this.#layers3d.setLayer(v - 0.001);
    // }

    destroy() {
        this.#layers3d.destroy();
        super.destroy()
    }
}
