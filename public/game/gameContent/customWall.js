import Mesh from "./mesh";
import { Vector2, Color } from "../../utils/structures";
import Layers3d from "./layers3d";

const getScreenCenter = () => new Vector2(1920/2, 1080/2)

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
    #scale = new Vector2(1, 1);
    #offset = new Vector2(0, 0);
    #centerOffset = new Vector2(0, 0);
    
    #color3d = new Color(0, 0, 0);
    #falloffColor3d = null;
    #depth3d = 0;
    #distance3d = 0;
    #layersCount3d = 0;

    #savedUnmodifiedVertexPos4 = [new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0)];

    getAbsoluteVertex4() {
        const screenCenter = getScreenCenter();
        return this.#savedUnmodifiedVertexPos4.map(vec2 => {
            let newPos = vec2; 
            newPos = newPos.add(this.#offset)
            newPos = rotatePoint(newPos, new Vector2(0, 0), this.#rotation)
            newPos = newPos.mul(this.#scale);
            newPos.y /= this.#skew + 1;
            newPos = newPos.add(new Vector2(screenCenter.x + this.#centerOffset.x, screenCenter.y + this.#centerOffset.y));
            return newPos;
        });
    }
    
    draw() {
        // i % 2 === 0: x coord
        // i % 2 === 1: y coord
        const pos = this.getAbsoluteVertex4();
        super.setVertexPos4(pos[0], pos[1], pos[2], pos[3]);
        super.draw();
        this.#layers3d.setVertexPos4(pos[0], pos[1], pos[2], pos[3]);
        this.#layers3d.draw();
    }

    setVertexPos4(pos1, pos2, pos3, pos4) {
        super.setVertexPos4(pos1, pos2, pos3, pos4)
        this.#savedUnmodifiedVertexPos4 = [pos1, pos2, pos3, pos4]
    }

    setVertexPos(point, {x, y}) {
        const pos = new Vector2(x, y);
        super.setVertexPos(point, pos);
        this.#savedUnmodifiedVertexPos4[point] = pos;
    }

    setRotation(v) {
        if (typeof(v) !== 'number') return 
        this.#rotation = v;
        this.scheduleDraw();
    }
    getRotation() { return this.#rotation; }
    setOffset({x, y}) {
        this.#offset = new Vector2(x, y);
        this.scheduleDraw();
    }
    getOffset() { return this.#offset }
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
    setScale({x, y}) {
        this.#scale = new Vector2(x, y);
        this.#layers3d.setDistance(this.#distance3d * this.#scale.y);
    }
    getScale() { return this.#scale }

    set3dDepth(v) {
        if (typeof(v) !== 'number') return 
        this.#depth3d = v;
        this.#layers3d.setDepth(v);
    }
    get3dDepth() { return this.#depth3d; }
    set3dDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance3d = v;
        this.#layers3d.setDistance(v * this.#scale.y);
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
    get3dColor() { return this.#color3d }
    set3dFalloffColor({r, g, b, a}) {
        const color = new Color(r, g, b, a);
        this.#falloffColor3d = color;
        this.#layers3d.setFalloffColor(color);
    }
    get3dFalloffColor() { return this.#falloffColor3d}
    clear3dFalloffColor() {
        this.#falloffColor3d = null;
        this.#layers3d.clearFalloffColor();
    }
    // setLayer(v) {
    //     super.setLayer(v)
    //     this.#layers3d.setLayer(v - 0.001);
    // }

    destroy() {
        super.destroy()
        this.#layers3d.destroy();
    }
}
