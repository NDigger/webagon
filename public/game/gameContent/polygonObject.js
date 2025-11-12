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

    #layersCount3d = 0;
    #distance3d = 0;
    #layer3d = 0;
    #color3d = new Color(0, 0, 0);
    #depthMult3d = 0;
    #falloffColor3d = null;
    #falloffScale3d = new Vector2(1, 1);

    draw() {
        const sidesChanged = (this._walls[0]?.getSides() ?? -1) !== this.#sides;
        if (sidesChanged) {
            this._walls.forEach(wall => wall.destroy());
            this._walls = [];
            for (let i = 0; i < this.#sides; i++) {
                const wall = new Wall(this.app);
                wall.setSide(i);
                wall.setSides(this.#sides);
                this._walls.push(wall);
            }
            this.updateWallsProps();
        } else {
            this.updateWallsProps();
        }
    }

    setSides(v) { 
        if (typeof v !== 'number') return 
        this.#sides = v
    }
    getSides() { return this.#sides; }
    setRotation(v) { 
        if (typeof v !== 'number') return
        this.#rotation = v 
    }
    getRotation() { return this.#rotation; }
    setSkew(v) { 
        if (typeof v !== 'number') return  
        this.#skew = v 
    }
    getSkew() { return this.#skew; }
    setLayer(v) { 
        if (typeof v !== 'number') return
        this.#layer = v  
    }
    getLayer() { return this.#layer; }
    setThickness(v) {
        if (typeof(v) !== 'number') return
        this.#thickness = v;
    }
    getThickness() { return this.#thickness; }
    setDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance = v;
    }
    getDistance() { return this.#distance; }
    setScale({x, y}) {
        this.#scale = new Vector2(x, y);
    }
    setColor({r, g, b, a}) {
        this.#color = new Color(r, g, b, a);
    }
    getColor() { return this.#color; }
    setCenterOffset({x, y}) {
        this.#centerOffset = new Vector2(x, y);
    }
    getCenterOffset() { return this.#centerOffset }
    setOffset({x, y}) {
        this.#offset = new Vector2(x, y);
    }
    getOffset() { return this.#offset }

    set3dLayersCount(v) {
        if (typeof(v) !== 'number') return 
        this.#layersCount3d = v;
    }
    get3dLayersCount() { return this.#layersCount3d; }
    set3dDistance(v) {
        if (typeof(v) !== 'number') return
        this.#distance3d = v;
    }
    get3dDistance() { return this.#distance3d; }
    set3dLayer(v) {
        if (typeof(v) !== 'number') return
        this.#layer3d = v;
    }
    get3dLayer() { return this.#layer3d; }
    set3dColor({r, g, b, a}) {
        this.#color3d = new Color(r, g, b, a);
    }
    get3dColor() { return this.#color3d; }
    set3dFalloffColor({r, g, b, a}) {
        this.#falloffColor3d = new Color(r, g, b, a);
    }
    get3dFalloffColor() { return this.#falloffColor3d; }
    clear3dFalloffColor() {
        this.#falloffColor3d = null;
    }
    set3dFalloffScale({x, y}) {
        const v = new Vector2(x, y);
        this.#falloffScale3d = v; 
    }
    get3dFalloffScale() { return this.#falloffScale3d }
    set3dDepthMult(v) {
        if (typeof(v) !== 'number') return
        this.#depthMult3d = v;
    }
    destroy() {
        if (this.destroyed) return
        this.destroyed = true
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

            wall.set3dFalloffScale(this.#falloffScale3d);
            wall.set3dDistance(this.#distance3d);
            wall.set3dLayersCount(this.#layersCount3d);
            wall.set3dLayer(this.#layer3d);
            wall.set3dColor(this.#color3d);
            wall.set3dDepthMult(this.#depthMult3d);
            if (this.#falloffColor3d != null) wall.set3dFalloffColor(this.#falloffColor3d);
            else wall.clear3dFalloffColor();
            
            wall.draw();
        })
    }
}
