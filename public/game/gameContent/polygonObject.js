import GameObject from "./gameObject";
import Wall from "./wall";
import { Color, Vector2 } from '../../utils/structures';

export default class PolygonObject extends GameObject {
    _walls = [];
    #sides = 6;
    #skew = 0;
    #rotation = 0;
    #layer = 0;
    #thickness = 0;
    #distance = 0;
    #color = new Color(0, 0, 0);
    #scale = new Vector2(1, 1);

    #centerOffset = new Vector2(0, 0);
    #offset = new Vector2(0, 0);

    #depth3d = 0;
    #distance3d = 0;
    #layer3d = 0;
    #color3d = new Color(0, 0, 0);
    #falloffColor3d = null;

    draw() {
        const sidesChanged = (this._walls[0]?.getSides() ?? -1) !== this.#sides;
        if (sidesChanged) {
            this._walls.forEach(wall => wall.destroy());
            this._walls = [];
            for (let i = 0; i < this.#sides; i++) {
                const wall = new Wall(this.appContext);
                wall.setSide(i);
                wall.setSides(this.#sides);
                this._walls.push(wall);
            }
            this.updateWallsProps();
        } else {
            this.updateWallsProps();
        }
    }

    setSides(v) { if (typeof v === 'number') { this.#sides = v; this.scheduleDraw(); } }
    getSides() { return this.#sides; }
    setRotation(v) { if (typeof v === 'number') { this.#rotation = v; this.scheduleDraw(); } }
    getRotation() { return this.#rotation; }
    setSkew(v) { if (typeof v === 'number') { this.#skew = v; this.scheduleDraw(); } }
    getSkew() { return this.#skew; }
    setLayer(v) { if (typeof v === 'number') { this.#layer = v; this.scheduleDraw(); } }
    getLayer() { return this.#layer; }
    setThickness(v) {
        if (typeof(v) !== 'number') return
        this.#thickness = v;
        this.scheduleDraw();
    }
    getThickness() { return this.#thickness; }
    setDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance = v;
        this.scheduleDraw();
    }
    getDistance() { return this.#distance; }
    setScale({x, y}) {
        this.#scale = new Vector2(x, y);
        this.scheduleDraw();
    }
    setColor({r, g, b, a}) {
        this.#color = new Color(r, g, b, a);
        this.scheduleDraw();
    }
    getColor() { return this.#color; }
    setCenterOffset({x, y}) {
        this.#centerOffset = new Vector2(x, y);
        this.scheduleDraw();
    }
    getCenterOffset() { return this.#centerOffset }
    setOffset({x, y}) {
        this.#offset = new Vector2(x, y);
        this.scheduleDraw();
    }
    getOffset() { return this.#offset }

    set3dDepth(v) {
        if (typeof(v) !== 'number') return 
        this.#depth3d = v;
        this.scheduleDraw();
    }
    get3dDepth() { return this.#depth3d; }
    set3dDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance3d = v;
        this.scheduleDraw();
    }
    get3dDistance() { return this.#distance3d; }
    set3dLayer(v) {
        if (typeof(v) !== 'number') return
        this.#layer3d = v;
        this.scheduleDraw();
    }
    get3dLayer() { return this.#layer3d; }
    set3dColor({r, g, b, a}) {
        this.#color3d = new Color(r, g, b, a);
        this.scheduleDraw();
    }
    get3dColor() { return this.#color3d; }
    set3dFalloffColor({r, g, b, a}) {
        this.#falloffColor3d = new Color(r, g, b, a);
        this.scheduleDraw();
    }
    get3dFalloffColor() { return this.#falloffColor3d; }
    clear3dFalloffColor() {
        this.#falloffColor3d = null;
        this.scheduleDraw();
    }
    destroy() {
        this._walls.forEach(wall => {
            wall.destroy()
        })
        this.redrawEnabled = false
    }

    updateWallsProps() {
        this._walls.forEach(wall => {
            wall.setThickness(this.#thickness);
            wall.setColor(this.#color);
            wall.setSkew(this.#skew);
            wall.setDistance(this.#distance);
            wall.setRotation(this.#rotation);
            wall.setLayer(this.#layer);
            wall.setCenterOffset(this.#centerOffset);
            wall.setOffset(this.#offset);
            wall.setScale(this.#scale);

            wall.set3dDistance(this.#distance3d);
            wall.set3dDepth(this.#depth3d);
            wall.set3dLayer(this.#layer3d);
            wall.set3dColor(this.#color3d);
            if (this.#falloffColor3d != null) wall.set3dFalloffColor(this.#falloffColor3d);
            else wall.clear3dFalloffColor();
            
            wall.draw();
        })
    }
}
