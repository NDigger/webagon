import PolygonObject from "./polygonObject";
import { Color, Vector2 } from "./structures";
import Player from "./player";

class PolygonBorder extends PolygonObject {
    constructor(appContext) {
        super(appContext);
        this.setThickness(5);
        this.draw();
    }
}

export default class Polygon extends PolygonObject {
    #player = new Player(this.appContext);
    #border = new PolygonBorder(this.appContext);

    constructor(appContext) {
        super(appContext);
        this.setThickness(60);
        this.draw();
    }

    scheduleDraw() {
        super.scheduleDraw();
        this.#player.scheduleDraw();
        this.#border.scheduleDraw();
    }

    setSides(v) {
        super.setSides(v);
        this.#border.setSides(v);
    }

    setSkew(v) {
        super.setSkew(v)
        this.#player.setSkew(v);
        this.#border.setSkew(v);
    }

    setThickness(v) {
        const borderThickness = this.#border.getThickness();
        super.setThickness(v - borderThickness)
        this.#player.setDistance(v * 1.25)
        this.#border.setDistance(v - borderThickness);
    }

    setLayer(v) {
        super.setLayer(v)
        this.#player.setLayer(v);
        this.#border.setLayer(v);
    }

    setRotation(v) {
        super.setRotation(v)
        this.#player.setRotation(v);
        this.#border.setRotation(v);
    }

    setScale({x, y}) {
        const scale = new Vector2(x, y);
        super.setScale(scale)
        this.#player.setScale(scale)
        this.#border.setScale(scale);
    }

    setBorderColor({r, g, b, a}) {
        this.#border.setColor(new Color(r, g, b, a))
    }
    getBorderColor() {
        return this.#border.getColor();
    }

    setPlayerColor({r, g, b, a}) {
        this.#player.setColor(new Color(r, g, b, a))
    }

    getPlayerColor() {
        return this.#player.getColor();
    }

    set3dDepth(v) {
        super.set3dDepth(v);
        this.#player.set3dDepth(v);
        this.#border.set3dDepth(v);
    }

    set3dDistance(v) {
        super.set3dDepth(v);
        this.#player.set3dDistance(v);
        this.#border.set3dDistance(v);
    }

    set3dLayer(v) {
        super.set3dLayer(v);
        this.#player.set3dLayer(v);
        this.#border.set3dLayer(v);
    }

    set3dColor(v) {
        this.#player.set3dColor(v);
        this.#border.set3dColor(v);
    }

    set3dFalloffColor(v) {
        this.#player.set3dFalloffColor(v);
        this.#border.set3dFalloffColor(v);
    }

    clear3dFalloffColor() {
        this.#player.clear3dFalloffColor();
        this.#border.clear3dFalloffColor();
    }

    setPlayerSwapEnabled(v) { 
        if (typeof(v) !== 'boolean') return
        this.#player.setSwapEnabled(v);
    };
    getPlayerPosition() { return this.#player.getPointPosition() }
    getPlayerAbsolutePosition() { return this.#player.getVertexAbsolutePos(0) }
}