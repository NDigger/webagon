import Mesh from "./mesh";
import { Vector2, Color } from "../../utils/structures";
import Layers3d from "./layers3d";
import { getScreenCenter, rotatePoint } from "../utils";

export default class CustomWall extends Mesh {
    #layers3d = new Layers3d(this.app);
    #skew = 0;
    #rotation = 0;
    #scale = new Vector2(1, 1);
    #offset = new Vector2(0, 0);
    #centerOffset = new Vector2(0, 0);
    
    #color3d = new Color(0, 0, 0);
    #falloffColor3d = null;
    #layersCount3d = 0;
    #distance3d = 0;
    #depthMult3d = 0;
    #falloffScale3d = new Vector2(1, 1);

    #savedUnmodifiedVertexPos4 = [new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0), new Vector2(0, 0)];

    #getTransformedVertexPos4() {
        const screenCenter = getScreenCenter();
        return this.#savedUnmodifiedVertexPos4.map(vec2 => {
            let pos = vec2; 
            pos = pos.add(this.#offset)
            pos = rotatePoint(pos, new Vector2(0, 0), this.#rotation)
            const prevPos = new Vector2(pos.x, pos.y);

            pos = pos.mul(this.#scale);
            pos.y /= this.#skew + 1;

            // Pseudo3d
            const depth = 1 - Math.min(prevPos.y * this.#depthMult3d / 1000, 0.);
            pos.x /= depth;
            pos.y /= depth;

            // Camera rotation
            // const cameraRotation = 60;
            // pos = rotatePoint(pos, new Vector2(0, 0), -cameraRotation);

            // Centering
            pos = pos.add(new Vector2(screenCenter.x + this.#centerOffset.x, screenCenter.y + this.#centerOffset.y));
            return pos;
        });
    }
    
    draw() {
        // i % 2 === 0: x coord
        // i % 2 === 1: y coord
        this.updatePosition();
        super.draw();
        this.#layers3d.draw();
    }

    updatePosition() {
        const pos = this.#getTransformedVertexPos4();
        super.setVertexPos4(pos[0], pos[1], pos[2], pos[3]);
        this.#layers3d.setVertexPos4(pos[0], pos[1], pos[2], pos[3]);
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

    getVertexPos4() { return this.#savedUnmodifiedVertexPos4; }

    getVertexPos(v) { return this.#savedUnmodifiedVertexPos4[v] }

    getCollisions() {
        return this.#savedUnmodifiedVertexPos4.map(vec2 => {
            vec2 = vec2.mul(this.#scale);
            return vec2;
        })
    }

    setRotation(v) {
        if (typeof(v) !== 'number') return 
        this.#rotation = v;
    }
    getRotation() { return this.#rotation; }
    setOffset({x, y}) {
        this.#offset = new Vector2(x, y);
    }
    getOffset() { return this.#offset }
    setCenterOffset({x, y}) {
        this.#centerOffset = new Vector2(x, y);
    }
    getCenterOffset() { return this.#centerOffset; }

    setSkew(v) {
        if (typeof(v) !== 'number') return 
        this.#skew = v;
        this.#layers3d.setSkew(v);
    }
    getSkew() { return this.#skew; }
    setScale({x, y}) {
        this.#scale = new Vector2(x, y);
        this.#layers3d.setDistance(this.#distance3d * this.#scale.y);
    }
    getScale() { return this.#scale }

    set3dDepthMult(v) {
        if (typeof(v) !== 'number') return 
        this.#depthMult3d = v;
        this.#layers3d.setDepthMult(v);
    }
    get3dDepthMult() { return this.#depthMult3d }
    set3dLayersCount(v) {
        if (typeof(v) !== 'number') return 
        this.#layersCount3d = v;
        this.#layers3d.setLayersCount(v);
    }
    get3dLayersCount() { return this.#layersCount3d; }
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
    set3dFalloffScale({x, y}) {
        const v = new Vector2(x, y);
        this.#falloffScale3d = v;
        this.#layers3d.setFalloffScale(v);
    }
    get3dFalloffScale() { return this.#falloffScale3d; }
    // setLayer(v) {
    //     super.setLayer(v)
    //     this.#layers3d.setLayer(v - 0.001);
    // }

    destroy() {
        super.destroy()
        this.#layers3d.destroy();
    }
}
